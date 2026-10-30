/// <reference types="@vite-pwa/sveltekit/info" />
/// <reference types="@vite-pwa/sveltekit/client" />
/// <reference types="vite-plugin-pwa/pwa-assets" />

import 'vite-plugin-pwa/svelte';
import 'vite-plugin-pwa/info';
import 'vite-plugin-pwa/client';
import 'vite-plugin-pwa/pwa-assets';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
