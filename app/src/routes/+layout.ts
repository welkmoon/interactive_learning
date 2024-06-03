// DONE
import { setPreviewing } from '@sanity/visual-editing/svelte';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = (event) => {
	const { preview, userId, username, isUserAdmin } = event.data;
	// `@sanity/visual-editing/svelte` exports two helpers for setting and getting
	// preview state on the client: `setPreviewing` and `isPreviewing`.
	setPreviewing(preview);

	return { username, userId, isUserAdmin };
};
