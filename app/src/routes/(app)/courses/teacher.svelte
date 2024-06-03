<script lang="ts">
	import { Button } from 'carbon-components-svelte';
	import type { CourseSchema } from './schema';

	export let courses: CourseSchema[];
</script>

{#if courses.length > 0}
	<div class="flex my-[calc(.875rem-3px)] flex-wrap gap-4">
		{#each courses as { title, excerpt, slug, topicName }}
			<a
				class="relative flex flex-col min-w-[300px] max-w-[50%] rounded-lg border flex-1 p-6 gap-6 w-1/2 bg-white shadow-lg justify-between"
				href="courses/{slug}"
			>
				<div class="relative flex flex-col space-y-1.5">
					<h3
						class="text-black text-2xl font-semibold whitespace-nowrap leading-none tracking-tight overflow-ellipsis overflow-hidden"
					>
						{title}
					</h3>
					<div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
						<span class="italic">Ваш курс</span>
						<span>Тема: {topicName}</span>
					</div>
					<p class="text-sm text-black">{excerpt}</p>
				</div>
				<Button
					kind="secondary"
					class="relative mt-auto !mx-auto bg-[#4c4c4c] w-full"
					href="courses/{slug}"
				>
					Відкрити
				</Button>
			</a>
		{/each}
	</div>
{:else}
	<div>Додайте курс до вашого облікового запису в адмін панелі</div>
{/if}
