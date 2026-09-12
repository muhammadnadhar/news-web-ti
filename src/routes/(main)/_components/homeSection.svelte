<script lang="ts">
	import UserCard from '$lib/components/admin/userCard.svelte';
	import type { DosenItemDTO } from '$lib/types/admin/home';
	import type { PerminatanTIItemDTO } from '$lib/types/admin/home';
	import type { ProfilProdiItemDTO } from '$lib/types/admin/home';
	import { User } from 'lucide-svelte';

	// Props opsional dari ke-3 tabel

	let {
		listDosen = [],
		listPerminatan = [],
		listProfil = [],
		activeTab = 'all'
	}: {
		activeTab: 'all' | 'dosen' | 'perminatan' | 'profil';
		listDosen: DosenItemDTO[];
		listPerminatan: PerminatanTIItemDTO[];
		listProfil: ProfilProdiItemDTO[];
	} = $props();

	// Tab aktif jika ingin menyaring per kategori (default 'all')
</script>

<div class="dashboard-component">
	<!-- Tab Filter Navigasi Opsional -->
	<div class="filter-tabs">
		<button class:active={activeTab === 'all'} onclick={() => (activeTab = 'all')}
			>Semua Data</button
		>
		<button class:active={activeTab === 'dosen'} onclick={() => (activeTab = 'dosen')}
			>Dosen & Staff ({listDosen.length})</button
		>
		<button class:active={activeTab === 'perminatan'} onclick={() => (activeTab = 'perminatan')}
			>Perminatan TI ({listPerminatan.length})</button
		>
		<button class:active={activeTab === 'profil'} onclick={() => (activeTab = 'profil')}
			>Profil Prodi ({listProfil.length})</button
		>
	</div>

	<!-- KATEGORI 1: DOSEN & STAFF -->
	{#if (activeTab === 'all' || activeTab === 'dosen') && listDosen.length > 0}
		<div class="section-group">
			<h2 class="group-title">
				<span class="badge">Dosen</span> Daftar Dosen & Staff
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
	{#if (activeTab === 'all' || activeTab === 'perminatan') && listPerminatan.length > 0}
		<div class="section-group">
			<h2 class="group-title">
				<span class="badge badge-purple">Perminatan</span> Bidang Keahlian TI
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
	{#if (activeTab === 'all' || activeTab === 'profil') && listProfil.length > 0}
		<div class="section-group">
			<h2 class="group-title">
				<span class="badge badge-green">Profil</span> Informasi & Pengaduan Prodi
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

	<!-- JIKA TIDAK ADA DATA -->
	{#if listDosen.length === 0 && listPerminatan.length === 0 && listProfil.length === 0}
		<div class="empty-state">
			<p>Tidak ada data yang tersedia dari ketiga tabel.</p>
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

	.filter-tabs {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
	}

	.filter-tabs button {
		padding: 0.5rem 1rem;
		border: 1px solid #cbd5e1;
		background-color: #ffffff;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 600;
		color: #475569;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.filter-tabs button:hover {
		background-color: #f1f5f9;
	}

	.filter-tabs button.active {
		background-color: #0284c7;
		color: #ffffff;
		border-color: #0284c7;
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
