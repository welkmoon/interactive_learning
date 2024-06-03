<script lang="ts">
	import { navigating } from '$app/stores';
	import { Button, PasswordInput, TextInput } from 'carbon-components-svelte';
	import { Control, Field } from 'formsnap';
	import { superForm, type Infer } from 'sveltekit-superforms';

	export let data;

	const form = superForm(data.form, {
		clearOnSubmit: 'none',
		onSubmit: async ({ formData }) => {
			formData.set('username', $formFields.username);
			formData.set('password', $formFields.password);
		}
	});

	const { form: formFields, message, enhance } = form;
</script>

<div class="flex flex-col items-center justify-center gap-8 text-center w-full h-full">
	<div class="gap-4">
		<h1
			class="text-2xl md:text-4xl font-bold tracking-tighter sm:text-4xl lg:text-6xl/none text-blue-950"
		>
			Платформа<br />
			<span class="font-sans text-[#E59BE9] text-nowrap">інтерактивного навчання</span>
		</h1>
		<p class="mx-auto text-gray-500 text-lg md:text-xl text-nowrap">Вхід для вчителя</p>
	</div>

	<form class="flex flex-col gap-2" method="POST" use:enhance>
		<Field {form} name="username">
			<Control let:attrs>
				<TextInput
					labelText="Ім'я вчителя"
					placeholder="Введіть ім'я вчителя..."
					bind:value={$formFields.username}
					{...attrs}
				/>
			</Control>
		</Field>
		<Field {form} name="password">
			<Control let:attrs>
				<PasswordInput
					labelText="Пароль"
					placeholder="Введіть пароль"
					bind:value={$formFields.password}
					{...attrs}
				/>
			</Control>
		</Field>

		{#if $message}
			<div>{$message}</div>
		{/if}

		<Button kind="primary" type="submit" class="mt-4 w-full text-center bg-[#0353e9] color-white">
			Увійти
		</Button>

		{#if $navigating}
			<div>Входимо в профіль...</div>
		{/if}
	</form>
</div>
