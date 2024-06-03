import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contentSection',
  title: 'Секція контента',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Заголовок',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Контент',
      type: 'markdown',
    }),
    defineField({
      name: 'quizz',
      title: 'Додаток',
      type: 'markdown',
    }),
    defineField({
      name: 'isQuizz',
      title: 'Чи має запитання?',
      type: 'boolean',
      hidden: ({parent}) => !Boolean(parent.quizz),
    }),
    defineField({
      name: 'chat',
      title: 'Чат',
      type: 'array',
      of: [
        {
          title: 'Повідомлення',
          type: 'reference',
          to: [{type: 'chatMessage'}],
        },
      ],
    }),
  ],
})
