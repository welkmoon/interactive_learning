import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'teacher',
  title: 'Вчитель',
  type: 'document',
  fields: [
    defineField({
      name: 'username',
      title: "Ім'я",
      type: 'string',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value?.trim()) {
            return "Поле обов'язкове"
          }

          return true
        }),
    }),
    defineField({
      name: 'password',
      title: 'Пароль',
      type: 'string',
      hidden: ({document}) => Boolean(document?._createdAt),
      validation: (rule) => rule.required().min(6),
    }),
    defineField({
      name: 'posts',
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
