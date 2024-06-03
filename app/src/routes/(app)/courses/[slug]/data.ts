import { Nullable } from '$lib';
import { client } from '$lib/sanity/client';
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { StatisticsSchema, statisticsQuery } from '../../profile/schema';

export const ContentSchema = Type.Object({
	content: Type.Array(
		Type.Object({
			postId: Type.String(),
			postTitle: Type.String(),
			postSlug: Type.String(),
			postContentAmount: Type.Number(),
			_id: Type.String(),
			title: Type.String(),
			content: Nullable(Type.String()),
			quizz: Nullable(Type.String()),
			isQuizz: Nullable(Type.Boolean()),
			chatId: Type.Optional(Type.String())
		})
	)
});

export type ContentSchema = Static<typeof ContentSchema>;

export const getPost = async (slug: string, username: string, isAdmin: boolean) => {
	const query = `*[_type=="post" && $slug == slug.current][0]{
        "content": content2[][0..$limit]->{
            "postId": ^._id,
            "postTitle": ^.title,
            "postSlug": ^.slug.current,
            "postContentAmount": count(^.content2),
            _id,
            title,
            content,
            quizz,
            isQuizz
        }
    }`;

	const limit = await client.fetch(
		`count(*[_type=="user" && username == $username][0].activity[$slug == @->course->slug.current]->visitedSections[isFalseyResult != false])`,
		{ slug, username }
	);
	const classes = await client.fetch(query, { slug, limit: isAdmin ? 999 : limit || 0, username });

	if (!Value.Check(ContentSchema, classes)) {
		console.error([...Value.Errors(ContentSchema, classes)]);
		return null;
	}

	return Value.Decode(ContentSchema, classes).content;
};

export const getStatistics = async (slug: string, username: string) => {
	const response = await client.fetch(statisticsQuery, { slug, username });

	if (!response || !Value.Check(StatisticsSchema, response)) {
		console.error([...Value.Errors(StatisticsSchema, response)]);
		return null;
	}

	return Value.Decode(StatisticsSchema, response).activity;
};
