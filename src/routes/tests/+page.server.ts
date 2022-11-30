import { parse } from '$lib';
import { error } from '@sveltejs/kit';
import { html, svg } from '../../../tests/data';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = async ({ url }) => {
	const key = url.searchParams.get('test');
	if (!key) {
		throw error(404);
	}

	const test =
		key in html
			? html[key as keyof typeof html]
			: key in svg
			? svg[key as keyof typeof svg]
			: null;
	if (!test) {
		throw error(404);
	}

	return {
		test,
		withHtmlNodes: parse(test),
		withoutHtmlNodes: parse(test, { noHtmlNodes: true }),
	};
};
