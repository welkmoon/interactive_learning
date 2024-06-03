import sgMail from '@sendgrid/mail';
import { error, json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);

	// console.info(await request.formData());

	const msg = {
		to: 'm.famashyk@gmail.com', // Change to your recipient
		from: 'mark.tanashchuk@gmail.com', // Change to your verified sender
		subject: 'Сайт дипломної',
		text: `
      Марія Валентинівна запрошує Вас доєднатись до курсу
      .............
      Дані для входу: 
      Ім'я: test
      Пароль: test
    `,
		html: `
      <div>
        <div>Марія Валентинівна запрошує Вас доєднатись до курсу</div>
        <br />
        <div>Ім'я: test</div>
        <br />
        <div>Пароль: test</div>
      </div>
    `
	};

	return sgMail
		.send(msg)
		.then((res) => {
			console.log('Email sent');
			return json(res);
		})
		.catch((err) => {
			console.error(err);
			return error(err);
		});
};
