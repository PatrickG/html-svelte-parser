import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({ fallback: '404.html' }),
		paths: {
			base: /** @type {`/${string}` | undefined} */ (process.env.BASE_PATH),
		},
	},

	vitePlugin: { inspector: true },
};

export default config;
