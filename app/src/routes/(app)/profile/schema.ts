import { Nullable } from '$lib';
import { Type, type Static } from '@sinclair/typebox';

export const classQuery = `*[_type=="class" && !(_id in path("drafts.**")) && $username in users[]->username] {
    "topics": topics[]->{
        "courses": courses[]->{
            _id,
            title,
            excerpt,
            "slug": slug.current,
            "contentAmount": count(content2),
            "topicTitle": ^.username,
            "classId": ^.^._id,
            "className": ^.^.name,
            "teacher": ^.^.teacher->username,
        }
    },
}`;

export const CourseSchema = Type.Object(
	{
		_id: Type.String(),
		topicTitle: Type.String(),
		classId: Type.String(),
		className: Type.String(),
		teacher: Type.String(),
		title: Type.String(),
		slug: Type.String(),
		contentAmount: Type.Number()
	},
	{ $id: 'Course' }
);

export const ClassSchema = Type.Array(
	Type.Object(
		{ topics: Type.Array(Type.Object({ courses: Type.Array(CourseSchema) })) },
		{ $id: 'Class' }
	)
);

export const statisticsQuery = `*[_type=="user" && username == $username][0] {
    activity[]->{
        "courseTitle": course->title,
        "courseSlug": course->slug.current,
        "courseId": course->_id,
        "courseExp": course->exp,
        "courseContentAmount": count(course->content2),
        visitedSections[]->{
            _id,
            isQuizz,
            isFalseyResult
        }
    }
}`;

export const StatisticsSchema = Type.Object(
	{
		activity: Nullable(
			Type.Array(
				Type.Object({
					courseTitle: Type.String(),
					courseSlug: Type.String(),
					courseId: Type.String(),
					courseExp: Type.Union([Type.String(), Type.Number()]),
					courseContentAmount: Nullable(Type.Number()),
					visitedSections: Nullable(
						Type.Array(
							Type.Object({
								_id: Type.String(),
								isQuizz: Type.Boolean(),
								isFalseyResult: Type.Boolean()
							})
						)
					)
				})
			)
		)
	},
	{ $id: 'Statistics' }
);

export const MessageSchema = Type.Object(
	{
		slug: Type.String(),
		className: Type.String(),
		teacherName: Type.String(),
		topicName: Type.String(),
		courseName: Type.String(),
		authorName: Type.String(),
		sectionTitle: Type.String(),
		message: Type.String(),
		_createdAt: Type.String()
	},
	{ $id: 'Message' }
);

export const teacherQuery = `*[_type=="class" && teacher->username == $username] {
    "topics": topics[]->{
        "courses": courses[]-> {
            "content": content2[]->{
                "messages": chat[]-> {
                    "slug": ^.^.slug.current,
                    "className": ^.^.^.^.name,
                    "teacherName": ^.^.^.^.teacher->username,
                    "topicName": ^.^.^.username,
                    "courseName": ^.^.title,
                    "authorName": name->username,
                    "sectionTitle": ^.title,
                    message,
                    _createdAt,
                }
            }
        }
    }
}`;

export const TeacherSchema = Type.Array(
	Type.Object(
		{
			topics: Type.Array(
				Type.Object({
					courses: Type.Array(
						Type.Object({
							content: Type.Array(
								Type.Object({
									messages: Nullable(Type.Array(MessageSchema))
								})
							)
						})
					)
				})
			)
		},
		{ $id: 'Teacher' }
	)
);

export type CourseSchema = Static<typeof CourseSchema>;
export type ClassSchema = Static<typeof ClassSchema>;
export type StatisticsSchema = Static<typeof StatisticsSchema>;
export type MessageSchema = Static<typeof MessageSchema>;
export type TeacherSchema = Static<typeof TeacherSchema>;
