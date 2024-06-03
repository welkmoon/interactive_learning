// DONE
import { getPost, getStatistics } from './data';

export const prerender = false;
export const ssr = false;

export async function load({ params, parent }) {
	const { userId, username = '', isUserAdmin } = await parent();

	return {
		post: getPost(params.slug, username, isUserAdmin === 'true'),
		statistics: getStatistics(params.slug, username),
		slug: params.slug,
		userId,
		username
	};
}
