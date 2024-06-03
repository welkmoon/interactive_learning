import { useEffect, useState } from 'react';
import {defineField, defineType, useClient} from 'sanity'


function MyPreviewComponent(props) {
    const client = useClient({
	    apiVersion: '2022-10-21',
    })
    const [title, setTitle] = useState<boolean | null>(null);

    useEffect(() => {
      const fetchData = async () => {
        if(!props?.value) {
            return;
        }

        try {
          const result = await client.fetch(`*[_id == $ref][0]`, { ref: props.value});
          
          setTitle(result?.title || "Нема заголовку");
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);

    return (
      <div>
        {title}
      </div>
    )
}

export default defineType({
  name: 'activityRecordInfo',
  title: 'Інформація останної дії',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Ідентифікатор секції',
      type: 'string',
      readOnly: true,
      components: {
        // input: MyPreviewComponent,
        field: MyPreviewComponent
      }
    }),
    defineField({
      name: 'isQuizz',
      title: 'Чи це квіз',
      type: 'boolean',
    }),
    defineField({
      name: 'isFalseyResult',
      title: 'Чи не успішно пройшов пройшов',
      type: 'boolean',
    }),
  ],
  preview: {
    select: {
        title: 'isQuizz'
    },
    prepare(value) {
        return {
            title: value.title ? 'Квіз' : 'Звичайна секція'
        };
    }
  }
})
