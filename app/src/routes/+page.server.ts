// DONE, OPTIONAL add zod/hash cookie

import { message, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { typebox } from 'sveltekit-superforms/adapters';
import { UserSchema } from '$lib/schema';
import { type Actions } from '@sveltejs/kit';
import { client } from '$lib/sanity/client';

export const load: PageServerLoad = async (event) => {
	event.cookies.delete('username', { path: '/' });
	event.cookies.delete('userId', { path: '/' });
	event.cookies.delete('isUserAdmin', { path: '/' });

	return { form: await superValidate(event, typebox(UserSchema)) };
};

export const actions = {
	default: async ({ cookies, request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, typebox(UserSchema));

		const findUser = async ({ username, password }: { username: string; password: string }) => {
			try {
				const user = await client.fetch(
					`*[_type=="user" && username == $username && password == $password][0]{
                        _id,
                        username
                    }`,
					{ username, password }
				);

				if (user) {
					return {
						_id: user._id,
						username: user.username
					};
				} else {
					return null;
				}
			} catch (error) {
				console.error('Something went wrong while querying user list', error);
				return null;
			}
		};

		if (!form.valid) {
			return message(form, 'Неправильно введені дані', {
				status: 400
			});
		}

		const user = await findUser(form.data);

		if (user) {
			cookies.set('username', user.username, { path: '/', maxAge: 60 * 60 });
			cookies.set('userId', user._id, { path: '/', maxAge: 60 * 60 });
			cookies.set('isUserAdmin', 'false', { path: '/', maxAge: 60 * 60 });

			return message(form, 'Ви успішно увійшли в систему');
		} else {
			return message(form, "Нема користувача з таким ім'ям чи паролем.", {
				status: 404
			});
		}
	}
} satisfies Actions;
