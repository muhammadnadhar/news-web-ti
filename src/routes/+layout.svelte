<script lang="ts">
	import { onMount } from 'svelte';
	import './layout.css';
	import { pwaInfo } from 'virtual:pwa-info';
	import { pwaAssetsHead } from 'virtual:pwa-assets/head'; 

	onMount(async () => {
		if (pwaInfo) {
			// SvelteKit melakukan SSR, maka modul virtual wajib di-import secara dinamis di dalam onMount
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({
				immediate: true,
				onRegistered(r) {
					console.log(`PWA Service Worker Terdaftar: ${r}`);
				},
				onRegisterError(error) {
					console.error('PWA Registration Error:', error);
				}
			});
		}
	});

	// Mendapatkan tag link manifest secara reaktif dengan Runes
	let webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

	let { children } = $props();
</script>

<svelte:head>
	{@html webManifestLink}

<!-- Injeksi Otomatis Theme Color dari PWA Assets -->
	{#if pwaAssetsHead?.themeColor}
		<meta name="theme-color" content={pwaAssetsHead.themeColor.content} />
	{/if}

	<!-- Injeksi Otomatis Daftar Ikon Responsive dari PWA Assets -->
	{#if pwaAssetsHead?.links}
		{#each pwaAssetsHead.links as link}
			<link {...link} />
		{/each}
	{/if}
</svelte:head>

{@render children()}
