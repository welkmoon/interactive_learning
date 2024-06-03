<script lang="ts">
	import { Button } from 'carbon-components-svelte';

	export let isActive: boolean = false;
	export let text: string;
	export let onSendStatistics: (isFailed: boolean, isError: boolean) => number;

	function stripPrefix(str: string, prefix: string): string | null {
		if (str.startsWith(prefix)) {
			return str.slice(prefix.length);
		}

		return null;
	}

	let isError = false;
	const texts =
		text
			?.split('\n')
			?.map((part) => part.trim())
			?.filter((part) => part !== '')
			?.map((part) => {
				if (stripPrefix(part, 'Answer: ')) {
					return { isCorrect: true, text: stripPrefix(part, 'Answer: '), kind: 'tertiary' };
				} else {
					return { isCorrect: false, text: stripPrefix(part, 'WrongAnswer: '), kind: 'tertiary' };
				}
			}) || [];
</script>

<div class="flex flex-wrap gap-x-4">
	{#each texts as { isCorrect, text, kind }}
		<Button
			class="relative {kind === 'success' ? 'success_button' : ''}"
			style="margin: 1rem 0"
			{kind}
			on:click={isCorrect
				? () => {
						if (!isActive) {
							return;
						}

						if (!isError) {
							kind = 'success';
						} else {
							kind = 'secondary';
						}

						onSendStatistics(false, isError);
					}
				: () => {
						if (!isActive) {
							return;
						}

						isError = true;
						kind = 'danger-tertiary';

						onSendStatistics(true, isError);
					}}
		>
			{text}
		</Button>
	{/each}
</div>

<style>
	:global(.success_button) {
		background-color: #c5ff95;
		border: 1px solid #1c1678;
	}
</style>
