// DONE

import { client } from '$lib/sanity/client';
import type { PageLoad } from './$types';
import { Value } from '@sinclair/typebox/value';
import { ClassSchema, classSchemaQuery, teacherSchemaQuery } from './schema';
import { StatisticsSchema, statisticsQuery } from '../profile/schema';

export const prerender = false;
export const ssr = false;

export const load: PageLoad = async ({ parent }) => {
	const { username = '', isUserAdmin } = await parent();

	const getStatistics = async (username: string) => {
		const response = await client.fetch(statisticsQuery, { username });

		if (!Value.Check(StatisticsSchema, response)) {
			console.error([...Value.Errors(StatisticsSchema, response)]);
			return null;
		}

		return Value.Decode(StatisticsSchema, response);
	};

	const getCourses = async (username: string) => {
		const response = await client.fetch(classSchemaQuery, { username });

		if (!Value.Check(ClassSchema, response)) {
			console.error([...Value.Errors(ClassSchema, response)]);
			return null;
		}

		return (
			Value.Decode(ClassSchema, response)
				?.flatMap((topic) => topic.topics)
				?.flatMap((course) => course?.courses || []) || []
		);
	};

	const getTeacherCourses = async (username: string) => {
		const response = await client.fetch(teacherSchemaQuery, { username });

		if (!Value.Check(ClassSchema, response)) {
			console.error([...Value.Errors(ClassSchema, response)]);
			return null;
		}

		return (
			Value.Decode(ClassSchema, response)
				?.flatMap((topic) => topic.topics)
				?.flatMap((course) => course?.courses || []) || []
		);
	};

	if (isUserAdmin === 'false') {
		return {
			username,
			isUserAdmin,
			statistics: getStatistics(username),
			studentCourses: getCourses(username)
		};
	} else {
		return {
			username,
			isUserAdmin,
			teacherCourses: getTeacherCourses(username)
		};
	}
};
