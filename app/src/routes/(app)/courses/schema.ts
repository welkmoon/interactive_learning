import { Type, type Static } from '@sinclair/typebox';

export const classSchemaQuery = `*[_type=="class" && $username in users[]->username]{
    "topics": topics[]->{
        "courses": courses[]-> {
            title,
            excerpt,
            "slug": slug.current,
            "className": ^.^.name,
            "teacherName": ^.^.teacher->username,
            "topicName": ^.username,
        }
    },
  }`;

export const teacherSchemaQuery = `*[_type=="class" && teacher->username == $username]{
    "topics": topics[]->{
        "courses": courses[]-> {
            title,
            excerpt,
            "slug": slug.current,
            "className": ^.^.name,
            "teacherName": ^.^.teacher->username,
            "topicName": ^.username,
        }
    },
}`;

export const CourseSchema = Type.Object({
	title: Type.String(),
	excerpt: Type.String(),
	slug: Type.String(),
	className: Type.String(),
	teacherName: Type.String(),
	topicName: Type.String()
});

export const ClassSchema = Type.Array(
	Type.Object({
		topics: Type.Optional(
			Type.Array(
				Type.Object({
					courses: Type.Array(CourseSchema)
				})
			)
		)
	})
);

export type ClassSchema = Static<typeof ClassSchema>;
export type CourseSchema = Static<typeof CourseSchema>;
