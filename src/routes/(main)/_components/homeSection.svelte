<script lang="ts">
	import UserCard from '$lib/components/admin/userCard.svelte';
	import type { DosenItemDTO } from '$lib/types/admin/home';
	import type { PerminatanTIItemDTO } from '$lib/types/admin/home';
	import type { ProfilProdiItemDTO } from '$lib/types/admin/home';

	// Props opsional dari ke-3 tabel
	let {
		listDosen = [],
		listPerminatan = [],
		listProfil = []
	}: {
		listDosen: DosenItemDTO[];
		listPerminatan: PerminatanTIItemDTO[];
		listProfil: ProfilProdiItemDTO[];
	} = $props();
</script>

<div class="dashboard-component">
	<!-- kategori 1: dosen & staff -->
	{#if listDosen.length > 0}
		<div class="section-group">
			<h2 class="group-title">
				<span class="badge">Dosen</span> Daftar Dosen & Staff ({listDosen.length})
			</h2>
			<div class="grid">
				{#each listDosen as dosen (dosen.id)}
					<UserCard
						id={dosen.id}
						title={dosen.name}
						subtitle={dosen.position}
						imageUrl={dosen.image_url}
						editUrl={`/dosen/edit/${dosen.id}`}
					/>
				{/each}
			</div>
		</div>
	{/if}

	<!-- KATEGORI 2: PERMINATAN TI -->
	{#if listPerminatan.length > 0}
		<div class="section-group">
			<h2 class="group-title">
				<span class="badge badge-purple">Perminatan</span> Bidang Keahlian TI ({listPerminatan.length})
			</h2>
			<div class="grid">
				{#each listPerminatan as perminatan (perminatan.id)}
					<UserCard
						id={perminatan.id}
						title={perminatan.title}
						description={perminatan.description}
						editUrl={`/perminatan/edit/${perminatan.id}`}
					/>
				{/each}
			</div>
		</div>
	{/if}

	<!-- KATEGORI 3: PROFIL PRODI -->
	{#if listProfil.length > 0}
		<div class="section-group">
			<h2 class="group-title">
				<span class="badge badge-green">Profil</span> Informasi & Pengaduan Prodi ({listProfil.length})
			</h2>
			<div class="grid">
				{#each listProfil as profil (profil.id)}
					<UserCard
						id={profil.id}
						title={profil.title}
						description={profil.description}
						imageUrl={profil.image_url}
						editUrl={`/profil/edit/${profil.id}`}
					/>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Jika semua data kosong -->
	{#if listDosen.length === 0 && listPerminatan.length === 0 && listProfil.length === 0}
		<div class="empty-state">
			<p>Tidak ada data yang tersedia</p>
		</div>
	{/if}
</div>

<style>
	.dashboard-component {
		width: 100%;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}

	.section-group {
		margin-bottom: 2.5rem;
	}

	.group-title {
		font-size: 1.35rem;
		font-weight: 700;
		color: #0f172a;
		margin-bottom: 1rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.badge {
		font-size: 0.75rem;
		padding: 0.25rem 0.6rem;
		border-radius: 6px;
		background-color: #e0f2fe;
		color: #0369a1;
		font-weight: 700;
		text-transform: uppercase;
	}

	.badge-purple {
		background-color: #f3e8ff;
		color: #6b21a8;
	}

	.badge-green {
		background-color: #dcfce7;
		color: #15803d;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.empty-state {
		text-align: center;
		padding: 3rem;
		color: #94a3b8;
		border: 2px dashed #e2e8f0;
		border-radius: 12px;
	}
</style>
