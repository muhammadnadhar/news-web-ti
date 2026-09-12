<script lang="ts">
	import UserCard from '$lib/components/admin/userCard.svelte';
	import type { PageData } from './$types';


	let data: PageData = $props();
</script>

<div class="container">
	<h1 class="page-title">Manajemen Data Prodi Teknologi Informasi</h1>

	<!-- seksi 1: tabel dosen -->
	<section class="section">
		<h2 class="section-title">Daftar Dosen & Staff</h2>
		<div class="grid">
			{#each data.listDosen as dosen (dosen.id)}
				<UserCard
					id={dosen.id}
					title={dosen.name}
					subtitle={dosen.position}
					imageUrl={dosen.image_url}
					editUrl={`/dosen/edit/${dosen.id}`}
				/>
			{:else}
				<p class="empty-text">Belum ada data dosen.</p>
			{/each}
		</div>
	</section>

	<!-- seksi 2: tabel perminatan ti -->
	<section class="section">
		<h2 class="section-title">Perminatan TI</h2>
		<div class="grid">
			{#each data.listPerminatan as perminatan (perminatan.id)}
				<UserCard
					id={perminatan.id}
					title={perminatan.title}
					description={perminatan.description}
					editUrl={`/perminatan/edit/${perminatan.id}`}
				/>
			{:else}
				<p class="empty-text">Belum ada data perminatan TI.</p>
			{/each}
		</div>
	</section>

	<!-- SEKSI 3: TABEL PROFIL PRODI -->
	<section class="section">
		<h2 class="section-title">Profil & Pengaduan Prodi</h2>
		<div class="grid">
			{#each data.listProfil as profil (profil.id)}
				<UniversalCard
					id={profil.id}
					title={profil.title}
					description={profil.description}
					imageUrl={profil.image_url}
					editUrl={`/profil/edit/${profil.id}`}
				/>
			{:else}
				<p class="empty-text">Belum ada data profil prodi.</p>
			{/each}
		</div>
	</section>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}

	.page-title {
		font-size: 2rem;
		font-weight: 800;
		color: #0f172a;
		margin-bottom: 2.5rem;
		text-align: center;
	}

	.section {
		margin-bottom: 3rem;
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: #1e293b;
		margin-bottom: 1.25rem;
		border-bottom: 2px solid #e2e8f0;
		padding-bottom: 0.5rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.empty-text {
		color: #94a3b8;
		font-style: italic;
	}
</style>
