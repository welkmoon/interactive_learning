import type { PageLoad } from './$types';
import { client } from '$lib/sanity/client';

import { Value } from '@sinclair/typebox/value';
import {
	ClassSchema,
	StatisticsSchema,
	TeacherSchema,
	classQuery,
	statisticsQuery,
	teacherQuery
} from './schema';

export const prerender = false;
export const ssr = false;

// TODO We may use id as a filter instead of username
async function getUserInfo(username: string) {
	const [response, statisticsResponse] = await Promise.all([
		client.fetch(classQuery, { username }),
		client.fetch(statisticsQuery, { username })
	]);

	if (!Value.Check(ClassSchema, response)) {
		console.error([...Value.Errors(ClassSchema, response)]);
		return null;
	}

	if (!response || !Value.Check(StatisticsSchema, statisticsResponse)) {
		console.error([...Value.Errors(StatisticsSchema, statisticsResponse)]);
		return null;
	}

	return {
		courses: Value.Decode(ClassSchema, response)
			.flatMap((topic) => topic.topics)
			.flatMap((course) => course.courses),
		statistics: Value.Decode(StatisticsSchema, statisticsResponse)
	};
}

async function getTeacherInfo(username: string) {
	const response = await client.fetch(teacherQuery, { username });

	if (!Value.Check(TeacherSchema, response)) {
		console.error([...Value.Errors(TeacherSchema, response)]);
		return null;
	}

	let messages = Value.Decode(TeacherSchema, response)
		.flatMap((topic) => topic.topics)
		.flatMap((course) => course.courses)
		.flatMap((content) => content.content)
		.flatMap((message) => message.messages || []);

	messages.sort(function (a, b) {
		return new Date(b._createdAt) - new Date(a._createdAt);
	});

	return {
		messages
	};
}

export const load: PageLoad = async ({ parent }) => {
	const { username, userId, isUserAdmin } = await parent();

	if (!username || !userId || !isUserAdmin) {
		return {
			kind: 'error'
		} as const;
	}

	if (isUserAdmin === 'true') {
		return {
			kind: 'teacher',
			username,
			content: getTeacherInfo(username)
		} as const;
	} else {
		return {
			kind: 'student',
			username,
			content: getUserInfo(username)
		} as const;
	}
};
