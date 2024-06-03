<script lang="ts">
	import { CodeSnippet } from 'carbon-components-svelte';

	export let text: string;

	function unEscape(htmlStr: string) {
		return htmlStr
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'")
			.replace(/&amp;/g, '&');
	}
</script>

<CodeSnippet class="w-full min-h-16 max-w-none my-6" code={unEscape(text)} />

<style>
	:global(.bx--snippet--inline) {
		display: inline-flex;
		text-align: left;
	}

	:global(.bx--snippet--inline code) {
		text-align: left;
	}
</style>
