import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'chatMessage',
  title: 'Повідомлення',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Учень',
      type: 'reference',
      to: [{type: 'user'}, {type: 'teacher'}],
    }),
    defineField({
      name: 'message',
      type: 'text',
      title: 'Текст',
    }),
  ],
  preview: {
    select: {
      title: 'message',
      author: 'name.username',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})
