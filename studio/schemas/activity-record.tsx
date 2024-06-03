import { useEffect, useState } from 'react';
import {defineField, defineType, useClient} from 'sanity'
import {Badge, Flex, Box} from '@sanity/ui'
import {ObjectItemProps, PatchEvent, set, useFormValue} from 'sanity'
import { useDocumentPane } from 'sanity/structure';


function MyPreviewComponent(props) {
    const client = useClient({
	    apiVersion: '2022-10-21',
    })
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [title, setTitle] = useState<string | null>(null);

    const {onChange} = useDocumentPane()

    useEffect(() => {
      const fetchData = async () => {
        if(!props?.value?._ref) {
            return;
        }

        try {
          const result = await client.fetch(`*[_id == $ref][0]`, { ref: props.value._ref });

          setIsCorrect(result?.isQuizz === false || result?.isFalseyResult === false);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);

    return (
      <div style={{background: isCorrect === null ? 'gray' : isCorrect === true ? 'green' : 'red'}}>
        {props.renderDefault(props)}
      </div>
    )
}

export default defineType({
  name: 'activityRecord',
  title: 'Остання дія',
  type: 'object',
  fields: [
    defineField({
      name: 'course',
      title: 'Курс',
      type: 'reference',
      to: [{type: 'post'}],
    }),
    defineField({
      name: 'visitedSections',
      title: 'Пройдені частини',
      type: 'array',
      of: [
        {
            components: {
                item: MyPreviewComponent,
            }, 
            preview: {
                select: {
                    title: 'isQuizz',
                }
            },
            type: 'reference',
            to: [{type: 'activityRecordInfo'}],
        },
      ],
    }),
  ],
  preview: {
    select: {
        title: 'course.title',
    },
  },
})

