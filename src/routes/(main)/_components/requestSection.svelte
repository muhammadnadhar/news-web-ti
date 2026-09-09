<script lang="ts">
	import { onMount } from 'svelte';

	import RequestCard from '$lib/components/requestCard.svelte';

	// State data dan status loading
	let peminatanList = [];
	let isLoading = $state<false>(true);

	// Simulasi fetch data dari API
	onMount(async () => {
		try {
			// Ganti URL ini dengan endpoint API asli kamu nantinya
			// const res = await fetch('/api/peminatan');
			// peminatanList = await res.json();

			// Mock data untuk demonstrasi
			peminatanList = [
				{
					id: 1,
					title: 'Kecerdasan Buatan',
					description:
						'Bidang ini berfokus pada pengembangan sistem yang dapat meniru kecerdasan manusia. Mahasiswa akan mempelajari algoritma AI, teknik pengolahan data, serta implementasi AI dalam berbagai bidang.',
					icon: 'brain',
					is_active: false
				},
				{
					id: 2,
					title: 'Teknologi Web dan Mobile',
					description:
						'Bidang ini mencakup pengembangan aplikasi berbasis web dan mobile dengan teknologi terkini. Mahasiswa akan mempelajari desain dan pengembangan antarmuka pengguna (UI/UX), pemrograman front-end dan back-end, serta integrasi sistem berbasis cloud.',
					icon: 'mobile',
					is_active: false
				},
				{
					id: 3,
					title: 'Keamanan Siber',
					description:
						'Bidang ini berfokus pada perlindungan sistem informasi dari ancaman siber, seperti peretasan, malware, dan pencurian data. Mahasiswa akan mempelajari teknik enkripsi, analisis keamanan jaringan, serta kebijakan dan regulasi keamanan data.',
					icon: 'shield',
					is_active: true // Aktif/Highlight seperti di gambar
				}
			];
		} catch (error) {
			console.error('Gagal mengambil data peminatan:', error);
		} finally {
			isLoading = false;
		}
	});
</script>

<section class="bg-bg-primary py-20">
	<div class="mx-auto max-w-7xl px-6">
		<!-- Section Header -->
		<div class="mb-14 space-y-2 text-center">
			<span
				class="text-accent-primary bg-accent-primary-dim/60 border-accent-primary/20 inline-block rounded-full border px-3.5 py-1.5 text-xs font-bold tracking-widest uppercase"
			>
				PEMINATAN
			</span>
			<h2 class="text-pure-white text-3xl font-extrabold tracking-tight sm:text-4xl">
				3 Bidang Peminatan TI
			</h2>
		</div>

		{#if isLoading}
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				{#each Array(3) as _}
					<div
						class="bg-bg-secondary/50 border-bg-secondary-hover h-96 animate-pulse rounded-xl border"
					></div>
				{/each}
			</div>
		{:else}
			<!-- Card Grid Container -->
			<div class="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
				{#each peminatanList as item (item.id)}
					<RequestCard
						title={item.title}
						description={item.description}
						iconName={item.icon}
						isActive={item.is_active}
					/>
				{/each}
			</div>
		{/if}
	</div>
</section>
