import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const dev = true || process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter({ strict: false }),
		paths: { base: dev ? '' : '/html-svelte-parser' },
	},

	vitePlugin: {
		experimental: {
			inspector: true,
		},
	},
};

export default config;
