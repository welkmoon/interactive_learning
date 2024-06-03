import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Курси',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Заголовок',
      type: 'string',
    }),
    defineField({
      name: 'exp',
      title: 'Досвід',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (rule) => rule.required(),
      options: {
        maxLength: 96,
      },
    }),
    defineField({
      name: 'excerpt',
      title: 'Короткий текст',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'mainImage',
      title: 'Зображення',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'content2',
      title: 'Контент',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'contentSection'}],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})
