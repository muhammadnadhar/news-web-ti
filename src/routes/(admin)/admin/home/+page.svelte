<script lang="ts">
	import UserCard from '$lib/components/admin/userCard.svelte';
	import {
		BookOpenIcon,
		FileText,
		PencilIcon,
		PlusIcon,
		UserPlus2,
		UserPlusIcon,
		UsersIcon
	} from 'lucide-svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { mergeNewPath } from '$lib/utils';
	import type { MessageStatus } from '$lib/components/admin/message.svelte';
	import Message from '$lib/components/admin/message.svelte';

	let data: PageData = $props();

	let showMessage = $state(false);
	let messageConfig = $state<{
		status: MessageStatus;
		title: string;
		message: string;
	}>({
		status: 'info',
		title: '',
		message: ''
	});

	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}
</script>

{#if showMessage}
	<Message
		status={messageConfig.status}
		title={messageConfig.title}
		message={messageConfig.message}
		dismissible={true}
		timeout={4000}
		onclose={() => (showMessage = false)}
	/>
{/if}

<div class="container">
	<h1 class="page-title">Manajemen Data Prodi Teknologi Informasi</h1>

	<!-- seksi 1: tabel dosen -->
	<section class="section">
		<h2 class="section-title">Daftar Dosen & Staff</h2>
		{#if !data.primaryDosenList || data.primaryDosenList.length === 0}
			<div
				class="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-amber-500/30 bg-amber-500/5 p-8 text-center backdrop-blur-sm md:p-12"
			>
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
				>
					<UsersIcon class="h-8 w-8" />
				</div>

				<h3 class="text-pure-white mb-1 text-lg font-bold md:text-xl">
					Belum Ada Data Dosen & Staf
				</h3>
				<p class="mb-6 max-w-md text-sm text-text-muted">
					Data dosen dan staf belum ditemukan di sistem. Silakan tambahkan dosen atau staf baru.
				</p>
				<button
					type="button"
					onclick={() => goto('/admin/article/profil/dosen')}
					class="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] hover:bg-amber-400 active:scale-[0.98]"
				>
					<UserPlusIcon class="h-4 w-4" />
					<span>Tambah Dosen & Staf Baru</span>
				</button>
			</div>
		{:else}
			<div class="grid">
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each data.primaryDosenList as dosen (dosen.id)}
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
	</section>

	<!-- seksi 2: tabel perminatan ti -->
	<section class="w-full space-y-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h2 class="text-pure-white text-xl font-bold md:text-2xl">Peminatan / Konsentrasi TI</h2>
				<p class="text-sm text-text-muted">
					Kelola daftar peminatan dan bidang keahlian mahasiswa.
				</p>
			</div>

			<button
				type="button"
				onclick={() => goto(mergeNewPath('perminatan/add'))}
				class="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] hover:bg-amber-400 active:scale-[0.98]"
			>
				<PlusIcon class="h-4 w-4" />
				<span>Tambah Peminatan</span>
			</button>
		</div>

		<!-- Kondisi Jika Data Kosong vs Ada -->
		{#if !data.peminatanList || data.peminatanList.length === 0}
			<!-- EMPTY STATE (Full Card Warning / Notice Warna Kuning) -->
			<div
				class="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-amber-500/30 bg-amber-500/5 p-8 text-center backdrop-blur-sm md:p-12"
			>
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
				>
					<BookOpenIcon class="h-8 w-8" />
				</div>

				<h3 class="text-pure-white mb-1 text-lg font-bold md:text-xl">
					Belum Ada Data Peminatan TI
				</h3>
				<p class="mb-6 max-w-md text-sm text-text-muted">
					Bidang peminatan belum ditambahkan ke sistem. Silakan buat bidang peminatan baru untuk
					program studi Teknik Informatika.
				</p>

				<button
					type="button"
					onclick={() => goto(mergeNewPath('perminatan/add'))}
					class="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] hover:bg-amber-400 active:scale-[0.98]"
				>
					<PlusIcon class="h-4 w-4" />
					<span>Tambah Peminatan Baru</span>
				</button>
			</div>
		{:else}
			<!-- GRID DAFTAR PEMINATAN -->
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.peminatanList as item (item.id)}
					<div
						class="group flex flex-col justify-between rounded-2xl border border-white/10 bg-bg-secondary/40 p-5 backdrop-blur-md transition-all hover:border-amber-500/40 hover:bg-bg-secondary/60"
					>
						<div>
							<div class="mb-3 flex items-center justify-between">
								<span
									class="rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400"
								>
									Peminatan TI
								</span>
							</div>
							<h4
								class="text-pure-white text-lg font-bold transition-colors group-hover:text-amber-400"
							>
								{item.title}
							</h4>
							<p class="mt-2 line-clamp-3 text-sm leading-relaxed text-text-muted">
								{item.description}
							</p>
						</div>

						<!-- Action Buttons -->
						<div class="mt-5 flex items-center justify-end gap-2 border-t border-white/5 pt-4">
							<button
								type="button"
								onclick={() => goto(`/admin/peminatan/edit/${item.id}`)}
								class="rounded-lg p-2 text-text-muted transition-colors hover:bg-white/10 hover:text-white"
								title="Edit"
							>
								<PencilIcon class="h-4 w-4" />
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<!-- SEKSI 3: TABEL PROFIL PRODI -->
	<section class="w-full space-y-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h2 class="text-pure-white text-xl font-bold md:text-2xl">Profil & Pengaduan Prodi</h2>
				<p class="text-sm text-text-muted">
					Kelola informasi profil program studi dan gambar/QR barcode pengaduan.
				</p>
			</div>

			<button
				type="button"
				onclick={() => goto('')}
				class="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] hover:bg-amber-400 active:scale-[0.98]"
			>
				<PlusIcon class="h-4 w-4" />
				<span>Tambah Profil Baru</span>
			</button>
		</div>

		{#if !data.listProfil || data.listProfil.length === 0}
			<div
				class="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-amber-500/30 bg-amber-500/5 p-8 text-center backdrop-blur-sm md:p-12"
			>
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
				>
					<FileText class="h-8 w-8" />
				</div>

				<h3 class="text-pure-white mb-1 text-lg font-bold md:text-xl">
					Belum Ada Data Profil & Pengaduan Prodi
				</h3>
				<p class="mb-6 max-w-md text-sm text-text-muted">
					Data profil dan QR pengaduan belum ditemukan. Silakan tambahkan informasi profil prodi
					baru.
				</p>
				<button
					type="button"
					onclick={() => goto(ADD_PROFIL_URL)}
					class="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] hover:bg-amber-400 active:scale-[0.98]"
				>
					<PlusIcon class="h-4 w-4" />
					<span>Tambah Profil & Pengaduan Baru</span>
				</button>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.listProfil as profil (profil.id)}
					<UserCard
						id={profil.id}
						title={profil.title}
						description={profil.description}
						imageUrl={profil.image_url}
						editUrl={`/profile-prodi/edit/${profil.id}`}
					/>
				{/each}
			</div>
		{/if}
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
