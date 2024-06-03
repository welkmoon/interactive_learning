<script lang="ts">
	import type { StatisticsSchema } from './schema';
	import Student from './student.svelte';
	import Teacher from './teacher.svelte';

	export let data;

	function getTotalExp(statistics: StatisticsSchema): number {
		return (
			statistics.activity
				?.filter((activity) => {
					return (
						activity.visitedSections &&
						activity.courseContentAmount &&
						activity.visitedSections.length === activity.courseContentAmount - 1
					);
				})
				?.reduce((acc, activity) => acc + Number(activity.courseExp || 0), 0) || 0
		);
	}

	function getTotalCorrectAnswers(statistics: StatisticsSchema): number {
		let count = 0;

		const correctIds: Record<string, boolean> = {};

		statistics.activity?.forEach((statistic) => {
			statistic.visitedSections?.forEach((section) => {
				const isUnset = correctIds[section._id] === undefined;

				if (section.isQuizz && isUnset) {
					correctIds[section._id] = !section.isFalseyResult;

					if (correctIds[section._id]) {
						count += 1;
					}
				}
			});
		});

		return count;
	}
</script>

{#if data.kind === 'error'}
	<div>Не вдалося завантажити профіль</div>
{:else if data.kind === 'teacher'}
	{#await data.content}
		<div>Завантажуємо дані профіля...</div>
	{:then content}
		{#if content === null}
			<div>Помилка обробки даних</div>
		{:else if content.messages.length === 0}
			<div>Ви не маєте жодних повідомлень</div>
		{:else}
			<Teacher name={data.username} messages={content.messages} />
		{/if}
	{/await}
{:else if data.kind === 'student'}
	{#await data.content}
		<div>Завантажуємо дані профіля...</div>
	{:then content}
		{#if content === null || !content.statistics}
			<div>Помилка обробки даних</div>
		{:else}
			<Student
				name={data.username}
				courses={content.courses}
				statistics={content.statistics.activity}
				totalExp={getTotalExp(content.statistics)}
				totalCorrectAnswers={getTotalCorrectAnswers(content.statistics)}
			/>
		{/if}
	{/await}
{/if}
