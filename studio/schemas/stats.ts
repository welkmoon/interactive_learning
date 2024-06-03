import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'stat',
  title: 'Згенерована статистика',
  type: 'document',
  fields: [
    defineField({
      name: 'username',
      title: "Ім'я",
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'courses',
      title: 'Курси',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'post'}],
        },
      ],
    }),
  ],
})
