import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'class',
  title: 'Класи',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Назва',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'teacher',
      title: 'Вчитель',
      type: 'reference',
      to: [{type: 'teacher'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'users',
      title: 'Учні',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'user'}],
        },
      ],
    }),
    defineField({
      name: 'topics',
      title: 'Теми',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'topic'}],
        },
      ],
    }),
  ],
})
