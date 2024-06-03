import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'user',
  title: 'Учні',
  type: 'document',
  fields: [
    defineField({
      name: 'username',
      title: "Ім'я",
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Пошта',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'password',
      title: 'Пароль',
      type: 'string',
      validation: (rule) => rule.required().min(6),
    }),
    defineField({
      name: 'class',
      title: 'Клас',
      type: 'reference',
      to: [{type: 'class'}],
    }),
    defineField({
      name: 'activity',
      title: 'Активність',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'activityRecord'}],
        },
      ],
    }),
  ],
})
