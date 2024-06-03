import { createClient } from '@sanity/client';
import { dataset, studioUrl } from '$lib/sanity/api';

export const client = createClient({
	projectId: '2aq2f5mz',
	token:
		'sk8xHI6BVCLW1opRebUpNauvSBUZ6Ac4fjoKgpBIDnKGDoDI0ROHF22wmFJ15qObqXPtIkviRnDOR8NsQqLXCQD0YLcwIpybsBmkoEW5hw100aUvsTpKSMR4TWJAXoolMd77NZMTJwNVbU5QTDkELTXEobduFyNtkAZXVei7HDoTTb7wHWOQ',
	dataset,
	apiVersion: '2022-10-21',
	useCdn: false,
	stega: {
		studioUrl
	}
});
