import tailwindcss from '@tailwindcss/vite';
// import adapter from '@sveltejs/adapter-auto'; // tidak support auto
// import adapter from '@sveltejs/adapter-node'; // jika menggunakna node js
import adapter from 'svelte-adapter-bun';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
			// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
			// See https://svelte.dev/docs/kit/adapters for more information about adapters.
			adapter: adapter()
		}),

		SvelteKitPWA({
			// Strategi generate service worker otomatis
			strategies: 'generateSW',
			srcDir: 'src',
			mode: 'production',
			// Konfigurasi Web App Manifest untuk Mobile
			manifest: {
				name: 'News TI',
				short_name: 'news',
				description: 'Aplikasi mobile untuk management Berita untuk Prodi teknologi Informasi',
				theme_color: '#f8fafc',
				background_color: '#0b192c',
				display: 'standalone',
				orientation: 'portrait',
				start_url: '/',
				icons: [
					{
						src: '/favicon.svg',
						sizes: '64x64 32x32 24x24 16x16',
						type: 'image/x-icon',
						purpose: 'any' // Agar bentuk ikon adaptif mengikuti lingkaran/kotak di Android
					},

					{
						// Ikon ukuran besar untuk layar resolusi tinggi (High-DPI) dan Play Store PWA
						src: '/uin-icon.webp',
						sizes: '512x512',
						type: 'image/webp',
						purpose: 'any maskable'
					}
				]
			},

			//  Menggunakan susunan pola sejalan dengan folder output SvelteKit
			workbox: {
				globPatterns: [
					'client/**/*.{js,css,ico,png,svg,webp,webmanifest,woff,woff2}',
					'prerendered/**/*.{html,json}'
				]
			},

			// Aktifkan fitur PWA saat dalam mode pengembangan (development) untuk testing
			devOptions: {
				enabled: true,
				type: 'module'
			}
		})
	],
	server: {
		// Mengizinkan semua host (termasuk domain ngrok)
		allowedHosts: true
	}
});
