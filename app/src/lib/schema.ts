import { Type, type Static } from '@sinclair/typebox';

export const UserSchema = Type.Object({
	username: Type.String({ minLength: 1, errorMessage: 'Username is required' }),
	password: Type.String({ minLength: 6 })
});

export const PostSchema = Type.Object({
	title: Type.String(),
	slug: Type.Object({
		current: Type.String(),
		source: Type.String()
	}),
	excerpt: Type.String(),
	bodyRaw: Type.String()
});

export type UserSchema = Static<typeof UserSchema>;
export type PostSchema = Static<typeof PostSchema>;
