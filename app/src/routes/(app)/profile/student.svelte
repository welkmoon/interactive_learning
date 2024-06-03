<script lang="ts">
	import { Link } from 'carbon-components-svelte';
	import { Course } from 'carbon-icons-svelte';
	import CheckmarkOutline from 'carbon-icons-svelte/lib/CheckmarkOutline.svelte';
	import type { CourseSchema, StatisticsSchema } from './schema';

	export let name: string;
	export let courses: CourseSchema[];
	export let totalExp = 0;
	export let totalCorrectAnswers = 0;
	export let statistics: StatisticsSchema['activity'];

	$: unfinishedCoursesIds = new Set(
		statistics
			?.filter((course) => {
				const isNoActivity = !course.visitedSections;
				const isNotFinished =
					course.visitedSections &&
					course.courseContentAmount &&
					course.visitedSections.length > 0 &&
					course.courseContentAmount - 1 > course.visitedSections.length;

				return isNoActivity || isNotFinished;
			})
			?.map((course) => course.courseId) || []
	);

	$: finishedCoursesIds = new Set(
		statistics
			?.filter((course) => {
				return (
					course.visitedSections &&
					course.courseContentAmount &&
					course.visitedSections.length !== 0 &&
					course.visitedSections.length >= course.courseContentAmount - 1
				);
			})
			?.map((course) => course.courseId) || []
	);

	$: unfinishedCourses = courses.filter((course) => unfinishedCoursesIds.has(course._id));
</script>

<div class="flex flex-col w-full h-full max-w-screen-xl mx-auto">
	<main class="flex flex-col flex-1 w-full h-full gap-4 md:gap-8">
		<div class="flex w-full justify-between items-center gap-4">
			<div class="flex flex-col">
				<h2 class="text-xl md:text-3xl font-bold">Привіт, {name}!</h2>
			</div>

			<div class="text-md md:text-lg text-gray-700">
				{#if totalExp > 0}
					Ваш рівень: Початківець! | {totalExp} досвіду
				{:else}
					Пройдіть курс щоб отримати новий рівень!
				{/if}
			</div>
		</div>

		{#if statistics}
			<h3 class="font-medium">Статистика:</h3>

			<div class="flex flex-col">
				<main class="flex flex-1 flex-col gap-4">
					<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<div class="bg-white rounded-lg border bg-card text-card-foreground shadow-sm">
							<div class="p-6 flex flex-row items-center justify-between pb-2 space-y-0">
								<h3 class="whitespace-nowrap tracking-tight text-sm font-medium">
									Курсів<br /> пройдено
								</h3>
								<Course size={24} />
							</div>
							<div class="p-6">
								<div class="text-2xl font-bold">
									{finishedCoursesIds.size}/{courses.length}
								</div>
							</div>
						</div>
						<div class="bg-white rounded-lg border bg-card text-card-foreground shadow-sm">
							<div class="p-6 flex flex-row items-center justify-between pb-2 space-y-0">
								<h3 class="whitespace-nowrap tracking-tight text-sm font-medium">
									Правильних<br /> відповідей
								</h3>
								<CheckmarkOutline size={24} />
							</div>
							<div class="p-6">
								<div class="text-2xl font-bold">
									{totalCorrectAnswers}
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		{:else}
			<div>У вас поки що немає статистики</div>
		{/if}

		<h3 class="font-medium">Нові матеріали:</h3>

		{#if unfinishedCourses.length > 0}
			{#each unfinishedCourses as course}
				<div
					class="flex flex-col justify-center bg-white rounded-lg p-6 gap-6 border bg-card text-card-foreground shadow-sm"
				>
					<div class="flex flex-col items-center text-center justify-between pb-2 space-y-0">
						<h3 class="whitespace-nowrap tracking-tight text-sm font-medium">
							Продовжіть навчання
						</h3>
						<p>{course.title}</p>
					</div>
					<Link class="text-center mx-auto" href="/courses/{course.slug}">Продовжити</Link>
				</div>
			{/each}
		{:else if unfinishedCoursesIds.size > 0 || courses.length > finishedCoursesIds.size}
			<div
				class="flex flex-col justify-center bg-white rounded-lg p-6 gap-6 border bg-card text-card-foreground shadow-sm"
			>
				<div class="flex flex-col items-center text-center justify-between pb-2 space-y-0">
					<h3 class="whitespace-nowrap tracking-tight text-sm font-medium">Почніть новий курс!</h3>
				</div>
				<Link class="text-center mx-auto" href="/courses">Курси</Link>
			</div>
		{:else}
			<div
				class="flex flex-col justify-center bg-white rounded-lg p-6 gap-6 border bg-card text-card-foreground shadow-sm"
			>
				<div class="flex flex-col items-center text-center justify-between pb-2 space-y-0">
					<h3 class="tracking-tight text-sm font-medium">
						Ви пройшли всі курси! Попросіть вашово вчителя підключити до вас новий матеріал
					</h3>
				</div>
			</div>
		{/if}
	</main>
</div>
