import { message, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { typebox } from 'sveltekit-superforms/adapters';
import { UserSchema } from '$lib/schema';
import { type Actions, redirect } from '@sveltejs/kit';
import { client } from '$lib/sanity/client';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const TeacherSchema = Type.Object({
	_id: Type.String(),
	username: Type.String(),
	password: Type.String()
});

export const load: PageServerLoad = async (event) => {
	return { form: await superValidate(event, typebox(UserSchema)) };
};

export const actions = {
	default: async ({ cookies, request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, typebox(UserSchema));

		const findTeacher = async ({
			username,
			password
		}: UserSchema): Promise<(UserSchema & { _id: string }) | null> => {
			const query = `*[_type=="teacher" && username == "${username}" && password == "${password}"]{
                _id,
                username,
                password
            }[0]`;

			const response = await client.fetch(query);

			if (Value.Check(TeacherSchema, response)) {
				return Value.Decode(TeacherSchema, response);
			} else {
				console.error([...Value.Errors(TeacherSchema, response)]);
				return null;
			}
		};

		if (!form.valid) {
			return message(form, 'Неправильно введені дані');
		}

		const teacher = await findTeacher(form.data);

		if (teacher) {
			cookies.set('username', teacher.username, { path: '/', maxAge: 60 * 60 });
			cookies.set('userId', teacher._id, { path: '/', maxAge: 60 * 60 });
			cookies.set('isUserAdmin', 'true', { path: '/', maxAge: 60 * 60 });

			redirect(307, '/profile');
		} else {
			return message(form, "Нема вчителя з таким ім'ям чи паролем.");
		}
	}
} satisfies Actions;
