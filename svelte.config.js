import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Static single-page build for the demo (Cloudflare Pages / Workers Static
		// Assets). `fallback` serves index.html for any route; SSR is off in
		// `src/routes/+layout.ts` because the data layer is browser-local.
		adapter: adapter({ fallback: 'index.html' }),
		alias: {
			'@/*': 'src/*'                        // Create an alias for the src directory
		}
	}
};

export default config;
