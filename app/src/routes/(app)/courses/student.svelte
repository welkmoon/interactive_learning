<script lang="ts">
	import { Button } from 'carbon-components-svelte';
	import { ChevronDownOutline } from 'carbon-icons-svelte';
	import type { CourseSchema } from './schema';
	import type { StatisticsSchema } from '../profile/schema';

	export let statistics: StatisticsSchema['activity'];
	export let courses: CourseSchema[];

	$: progressHistory = new Map(
		statistics?.map((item) => [
			item.courseTitle,
			item.visitedSections && item.courseContentAmount
				? [item.visitedSections.length, item.courseContentAmount - 1]
				: null
		])
	);
</script>

{#if courses.length > 0}
	<div class="flex my-[calc(.875rem-3px)] flex-wrap gap-4">
		{#each courses as { title, excerpt, slug, teacherName, topicName }}
			{@const progress = progressHistory.get(title) || [-9999, 9999]}

			<a
				class="relative flex flex-col min-w-[300px] max-w-[50%] rounded-lg border flex-1 p-6 gap-6 w-1/2 bg-white shadow-lg justify-between"
				href="courses/{slug}"
			>
				<div class="absolute -top-2 -left-2">
					{#if progress[0] === progress[1]}
						<ChevronDownOutline size={24} color="#1ed760" />
					{/if}
				</div>
				<div class="relative flex flex-col space-y-1.5">
					{#if progress[0] > 0 && progress[0] !== progress[1]}
						<ul>
							<li style="list-style-type: '-  '" class="list-inside font-medium text-orange-500">
								в процесі
							</li>
						</ul>
					{/if}
					<h3
						class="{progress[0] === progress[1]
							? 'text-[#1ed760]'
							: 'text-black'} text-2xl font-semibold whitespace-nowrap leading-none tracking-tight overflow-ellipsis overflow-hidden"
					>
						{title}
					</h3>
					<div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
						{#if teacherName}
							<span>Вчитель: {teacherName}</span>
						{/if}
						<span>Тема: {topicName}</span>
					</div>
					<p class="text-sm text-black">{excerpt}</p>
				</div>
				<Button
					kind="secondary"
					class="relative mt-auto !mx-auto bg-[#4c4c4c] w-full"
					href="courses/{slug}"
				>
					{progress[0] === progress[1] ? 'Повторити' : progress[0] > 0 ? 'Продовжити' : 'Почати'}
				</Button>
			</a>
		{/each}
	</div>

	<div class="w-full px-4">
		{#if statistics?.filter((post) => post.visitedSections && post.courseContentAmount && post.visitedSections.length >= post.courseContentAmount - 1).length === courses.length}
			<div class="text-xl md:text-2xl font-medium mx-auto">Ви пройшли всі курси, так тримати!</div>
		{/if}
	</div>
{:else}
	<div class="w-full py-4">
		<div class="text-xl md:text-2xl font-medium mx-auto">
			У вас нема під'єднаних курсів, зверніться до вашого вчителя!
		</div>
	</div>
{/if}
