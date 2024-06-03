<svelte:options immutable />

<script lang="ts" context="module">
	import { Type } from '@sinclair/typebox';

	export const clickedOnWrongResult = writable(false);
	export const currentChatSection = writable<{ id: string | null }>({ id: null });

	const ChatMessages = Type.Object({
		chat: Nullable(
			Type.Array(
				Type.Object({
					authorName: Type.String(),
					message: Type.String(),
					_createdAt: Type.String()
				})
			)
		)
	});
</script>

<script lang="ts">
	import { Nullable } from '$lib';
	import { client } from '$lib/sanity/client';
	import { Value } from '@sinclair/typebox/value';
	import { Button, Link, ProgressBar, TextInput } from 'carbon-components-svelte';
	import { ArrowUpLeft, ChatLaunch } from 'carbon-icons-svelte';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	import { Avatar, Modal } from 'flowbite-svelte';
	import { marked } from 'marked';
	import SvelteMarkdown from 'svelte-markdown';
	import { writable } from 'svelte/store';
	import { v4 as uuidv4 } from 'uuid';
	import ButtonGroup from './ButtonGroup.svelte';
	import CodeSnippet from './CodeSnippet.svelte';
	import { getPost, getStatistics } from './data';

	export let data;

	let isModalOpen = false;
	let isMessageCreating = false;
	let currentMessage = '';
	let isLoading = writable(false);
	let postData: typeof data.post | Awaited<typeof data.post> = data.post;
	let statisticsData: typeof data.statistics | Awaited<typeof data.statistics> = data.statistics;

	async function handleSendMessage(message: string) {
		if (!$currentChatSection?.id) {
			return;
		}

		const messageId = uuidv4();

		const transaction = client.transaction();

		transaction
			.create({
				_id: messageId,
				_type: 'chatMessage',
				message: message,
				name: {
					_type: 'reference',
					_ref: data.userId
				}
			})
			.patch($currentChatSection.id, (p) => {
				return p.setIfMissing({ chat: [] }).append('chat', [
					{
						_ref: messageId,
						_type: 'reference'
					}
				]);
			});

		try {
			isMessageCreating = true;

			const result = await transaction
				.commit({ autoGenerateArrayKeys: true })
				.then((result) => {
					currentChatSection.set({ id: $currentChatSection.id });
					isMessageCreating = false;
					return result;
				})
				.catch((error) => {
					console.error(error);
					isMessageCreating = false;
					return null;
				});

			console.info({ handleSendMessageResult: result });
		} catch (error) {
			console.info(error);
			return;
		}
	}

	const getChatMessages = async (contentSectionId: string) => {
		try {
			const query = `*[_type == "contentSection" && _id == $id][0] {
                chat[]->{
                    "authorName": name->username,
                    message,
                    _createdAt
                }
            }`;

			const response = await client.fetch(query, {
				id: contentSectionId
			});

			if (!Value.Check(ChatMessages, response)) {
				console.error([...Value.Errors(ChatMessages, response)]);
				return [];
			}

			response.chat?.sort(
				(a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
			);

			return response.chat;
		} catch (error) {
			console.error(error);
			return [];
		}
	};

	async function handleClick(id: string) {
		if (isModalOpen) {
			currentChatSection.set({ id: null });
		} else {
			isModalOpen = true;
			currentChatSection.set({ id });
		}
	}

	function handleModalClose() {
		isModalOpen = false;
		currentChatSection.set({ id: null });
	}

	const handleSendStatistics = async (
		part: NonNullable<Awaited<typeof data.post>>[number],
		isFailed: boolean,
		isError: boolean,
		tokenText: string
	) => {
		if (isFailed) {
			$isLoading = false;
			return null;
		}

		$isLoading = true;

		try {
			// activity[] is null when array is empty
			const userInfo = await client.fetch(
				`*[_type == "user" && _id == $id][0] {
                    activity[]->{
                        _id
                    }
                }`,
				{ id: data.userId || '' }
			);
			const userActivity: Record<string, string>[] = userInfo?.activity || [];
			const activityRecordIndex = userActivity.findIndex((activityRecord) => {
				return activityRecord._id.startsWith(part.postId);
			});

			const transaction = client.transaction();
			const activityRecordInfoId = `${part._id}.${uuidv4()}`;

			transaction.create({
				_id: activityRecordInfoId,
				_type: 'activityRecordInfo',
				sectionId: part._id,
				isQuizz: part.isQuizz || false,
				isFalseyResult: tokenText !== 'Answer: Продовжити' && isError
			});

			if (activityRecordIndex === -1) {
				let newActivityRecordId = `${part.postId}.${uuidv4()}`;

				transaction
					.create({
						_id: newActivityRecordId,
						_type: 'activityRecord',
						course: {
							_type: 'reference',
							_ref: part.postId
						},
						visitedSections: [
							{
								_ref: activityRecordInfoId,
								_type: 'reference'
							}
						]
					})
					.patch(data.userId || '', (p) => {
						return p.setIfMissing({ activity: [] }).append('activity', [
							{
								_type: 'reference',
								_ref: newActivityRecordId
							}
						]);
					});
			} else {
				let newActivityRecordId = userActivity[activityRecordIndex]._id;

				transaction.patch(newActivityRecordId, (p) => {
					return p.setIfMissing({ visitedSections: [] }).append('visitedSections', [
						{
							_ref: activityRecordInfoId,
							_type: 'reference'
						}
					]);
				});
			}

			await transaction.commit({ autoGenerateArrayKeys: true });
			const [postData, statisticsData] = await Promise.all([
				getPost(data.slug, data.username, false),
				getStatistics(data.slug, data.username)
			]);

			$isLoading = false;

			return [postData, statisticsData] as const;
		} catch (error) {
			console.info(error);
			$isLoading = false;
			return null;
		}
	};
</script>

<Modal
	class="transition-opacity fixed w-3/4 bottom-2 left-1/2 -translate-x-1/2 z-50 p-4"
	title="Чат"
	bind:open={isModalOpen}
>
	{#if $currentChatSection.id}
		{#if !isMessageCreating}
			{#await getChatMessages($currentChatSection.id)}
				<div>Завантажуємо повідомлення</div>
			{:then chatMessages}
				{#if chatMessages?.length}
					<div class="flex flex-col gap-4 max-h-64 pr-4 overflow-y-auto">
						{#each chatMessages as { authorName, message, _createdAt }}
							<div class="flex flex-col gap-4 p-4 pb-8 bg-slate-100 text-black">
								<div class="flex justify-between">
									<div class="flex items-center">
										<Avatar class="w-6" size="xs" rounded />
										<div class="text-nowrap italic">{authorName}</div>
									</div>
									<div class="text-xs text-right">{new Date(_createdAt).toLocaleString()}</div>
								</div>
								<div class="w-full italic">{message}</div>
							</div>
						{/each}
					</div>
				{:else}
					<div>Тут ще нема повідомлень</div>
				{/if}
			{/await}
		{:else}
			<div>Завантажуємо повідомлення</div>
		{/if}
	{/if}

	<div class="absolute right-2 top-2">
		<Button
			iconDescription="Зачинити чат"
			icon={Close}
			kind="ghost"
			size="small"
			on:click={handleModalClose}
		/>
	</div>

	<div class="flex mt-4 py-4 gap-4">
		<TextInput
			placeholder="Напишіть повідомлення..."
			class="border-solid border-1 border-slate-200 h-full"
			bind:value={currentMessage}
		></TextInput>

		<Button
			type="submit"
			size="field"
			class="h-full !mb-0 !mt-auto"
			on:click={() => handleSendMessage(currentMessage)}>Відправити</Button
		>
	</div>
</Modal>

<div class="flex flex-col h-full w-full gap-2 max-w-screen-lg mx-auto px-8 py-2">
	{#await postData then post}
		{#if post}
			{@const parts =
				post.map((part, i) => {
					const tokens = marked.lexer([part?.content, part?.quizz].join('\n'));

					if (!part.quizz) {
						tokens.push({
							type: 'blockquote',
							raw: '> Answer: Продовжити',
							text: 'Answer: Продовжити'
						});
					}

					marked.walkTokens(tokens, (token) => {
						if (token.type == 'blockquote') {
							const answerPrefix = '> Answer:';
							const mistakePrefix = '> WrongAnswer:';

							if (token.raw.startsWith(answerPrefix) || token.raw.startsWith(mistakePrefix)) {
								token.type = 'button_group';
								// @ts-ignore
								token.onSendStatistics = async (isFailed, isError) => {
									console.info(isFailed, isError);
									const result = (await handleSendStatistics(
										part,
										isFailed,
										isError,
										token.text
									)) || [postData, statisticsData];

									postData = result[0];
									statisticsData = result[1];
								};
								// @ts-ignore
								token.isActive = post.length === i + 1;
							}
						}
					});
					return tokens;
				}) || []}
			{@const autoScroll = (node) => {
				const scroll = () => {
					const partsNodes = node.querySelectorAll('.part');
					const lastNode = partsNodes[partsNodes.length - 1];

					if (lastNode && post[0]?.postContentAmount > parts.length) {
						lastNode.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
					}
				};

				scroll();

				return {
					update() {
						scroll();
					}
				};
			}}

			<div class="glassmorphism flex items-center gap-4 w-full">
				<Button
					iconDescription="Назад"
					icon={ArrowUpLeft}
					kind="primary"
					class="bg-[#4c4c4c]"
					href="/courses"
				/>

				{#await statisticsData then statistics}
					{@const currentStatistics = statistics?.find((statistic) => {
						return statistic.courseSlug === data.slug;
					})}

					<ProgressBar
						class="w-full mr-4 h-full flex flex-col justify-center"
						value={!currentStatistics
							? 0
							: ((currentStatistics?.visitedSections?.length || 1) /
									Math.max(1, (currentStatistics?.courseContentAmount || 1) - 1)) *
								100}
					/>
				{/await}
			</div>

			<div
				id="content"
				class="w-full overflow-y-scroll hidden-scroll h-full"
				use:autoScroll={post?.length}
			>
				{#each parts as part, i}
					<div
						class="part relative flex flex-col text-sm py-4 pt-8 gap-2"
						style:opacity={i !== parts.length ? 0.8 : 1}
					>
						{#if !post[i]?.isQuizz && post[i]?._id}
							<button
								class="absolute hover:bg-slate-200 rounded-md cursor-pointer p-2 -left-0 -top-0"
								on:click={() => handleClick(post[i]?._id)}
							>
								<ChatLaunch size={24} />
							</button>
						{/if}

						<h3>{post[i].title || ''}</h3>

						<SvelteMarkdown
							source={part}
							renderers={{ code: CodeSnippet, button_group: ButtonGroup }}
						/>
					</div>
				{/each}

				{#await statisticsData then statistics}
					{@const currentStatistics = statistics?.find((statistic) => {
						return statistic.courseSlug === data.slug;
					})}

					<div class="flex flex-col">
						{#if currentStatistics?.visitedSections && currentStatistics.visitedSections.length === currentStatistics.courseContentAmount - 1}
							{@const [quizzResults, quizzCount] = (() => {
								let count = 0;
								let quizzCount = 0;

								const correctIds = {};

								currentStatistics.visitedSections?.forEach((section) => {
									const isUnset = correctIds[section._id] === undefined;

									if (section.isQuizz && isUnset) {
										quizzCount += 1;
										correctIds[section._id] = !section.isFalseyResult;

										if (correctIds[section._id]) {
											count += 1;
										}
									}
								});

								return [count, quizzCount];
							})()}

							{#if quizzCount > 0}
								<div class="my-4">
									Правильних відповідей на квізи: {quizzResults}
								</div>
							{/if}
						{/if}

						{#if $isLoading}
							<div class="py-4">Завантажується частина курса</div>
						{/if}
					</div>
				{/await}
			</div>
		{:else}
			Помилка отримування курсу
		{/if}
	{/await}
</div>

<style>
	.hidden-scroll {
		-ms-overflow-style: none;
		scrollbar-width: none;
		overflow-y: scroll;
		scroll-behavior: smooth;
	}
	.hidden-scroll::-webkit-scrollbar {
		display: none;
	}

	:global(code) {
		font-size: 1rem;
	}

	:global(a.bx--btn:not(:focus)) {
		box-shadow: none !important;
	}

	:global([aria-label='Close modal']) {
		display: none;
	}

	:global(.glassmorphism) {
		z-index: 999;
		background: rgba(255, 255, 255, 0.24);
		border-radius: 16px;
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	:global(.bx--progress-bar__label) {
		display: none;
	}
</style>
