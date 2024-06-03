// DONE
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const { preview } = event.locals;
	const username = event.cookies.get('username');
	const userId = event.cookies.get('userId');
	const isUserAdmin = event.cookies.get('isUserAdmin');

	return { preview, username, userId, isUserAdmin };
};
