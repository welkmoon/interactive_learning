<!-- DONE -->

<script lang="ts">
	import { goto } from '$app/navigation';
	import { UserSchema } from '$lib/schema';
	import { Button, PasswordInput, TextInput } from 'carbon-components-svelte';
	import { Control, Field } from 'formsnap';
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const form = superForm<UserSchema, string>(data.form, {
		clearOnSubmit: 'none',
		onSubmit: async ({ formData }) => {
			formData.set('username', $formFields.username);
			formData.set('password', $formFields.password);
		},
		onResult: async ({ result }) => {
			if (result.status === 200) {
				await goto('/profile');
			}
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
			<span class="font-sans text-yellow-500 text-nowrap">інтерактивного навчання</span>
		</h1>
		<p class="mx-auto text-gray-500 text-lg md:text-xl text-nowrap">Вхід для учня</p>
	</div>

	<form class="flex flex-col gap-2" method="POST" use:enhance>
		<Field {form} name="username">
			<Control let:attrs>
				<TextInput
					labelText="Ім'я користувача"
					placeholder="Введіть ім'я користувача..."
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
	</form>
</div>
