<!-- DONE -->

<script lang="ts">
	import { ButtonSet, Link } from 'carbon-components-svelte';
	import ChartLineData from 'carbon-icons-svelte/lib/ChartLineData.svelte';
	import Home from 'carbon-icons-svelte/lib/Home.svelte';
	import IbmCloudKubernetesService from 'carbon-icons-svelte/lib/IbmCloudKubernetesService.svelte';
	import { navigating, page } from '$app/stores';
</script>

<ButtonSet
	class="fixed z-[999] top-0 left-1/2 -translate-x-1/2 flex items-center w-full md:px-8 md:gap-8 md:py-4 max-w-screen-xl bg-slate-100"
>
	<Link
		class="text-nowrap w-fit outline-0 p-1 {$page.url.pathname === '/profile' ? '' : '!text-black'}"
		icon={ChartLineData}
		href="/profile">Головна</Link
	>

	<Link
		class="text-nowrap w-fit ml-0 p-1 mr-auto outline-0 {$page.url.pathname.startsWith('/courses')
			? ''
			: '!text-black'}"
		icon={IbmCloudKubernetesService}
		href="/courses"
	>
		Курси
	</Link>

	{#if $navigating}
		<div class="italic">Дані завантажуються...</div>
	{/if}

	<Link class="!text-black text-nowrap w-fit outline-0 p-1" icon={Home} href="/">Вийти</Link>
</ButtonSet>

<div class="flex-1 w-full p-8 pt-16 h-full max-w-screen-xl mx-auto">
	<slot />
</div>

<style>
	:global(.bx--btn-set .bx--btn:not(:focus)) {
		box-shadow: none;
	}
</style>
