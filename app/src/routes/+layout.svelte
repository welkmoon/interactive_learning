<!-- DONE -->
<script lang="ts">
	import { isPreviewing, VisualEditing } from '@sanity/visual-editing/svelte';
	import { page } from '$app/stores';
	import LiveMode from '../components/LiveMode.svelte';

	import '../app.css';
	import 'carbon-components-svelte/css/g10.css';
</script>

{#if $isPreviewing}
	<a href={`/preview/disable?redirect=${$page.url.pathname}`} class="preview-toggle">
		<span>Preview Enabled</span>
		<span>Disable Preview</span>
	</a>
{/if}

<slot />

{#if $isPreviewing}
	<VisualEditing />
	<LiveMode />
{/if}

<style>
	:global(body, html) {
		width: 100%;
		height: 100%;
	}
</style>
