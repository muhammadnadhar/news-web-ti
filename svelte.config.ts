import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),

    csrf : {
			checkOrigin: true, 
      // untuk sekarang menandakna secara langsung
      trustedOrigins: [
				'http://localhost:3000',
				'http://127.0.0.1:3000',
				'https://ti.fst.ar-raniry.ac.id/'
			]
    }
	}
};
