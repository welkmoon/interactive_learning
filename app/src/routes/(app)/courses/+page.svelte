<script lang="ts">
	import Teacher from './teacher.svelte';
	import Student from './student.svelte';

	export let data;
</script>

{#if data.isUserAdmin === 'false'}
	{#await Promise.all([data.studentCourses, data.statistics])}
		<div>Завантажуємо дані користувача</div>
	{:then [courses, statistics]}
		{#if courses && statistics}
			<Student {courses} statistics={statistics?.activity} />
		{:else}
			<div class="w-full py-4">Помилка обробки даних студента</div>
		{/if}
	{/await}
{:else}
	{#await data.teacherCourses}
		<div>Завантажуємо дані користувача</div>
	{:then courses}
		{#if courses}
			<Teacher {courses} />
		{:else}
			<div class="w-full py-4">Помилка обробки даних вчителя</div>
		{/if}
	{/await}
{/if}
