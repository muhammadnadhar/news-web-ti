<script lang="ts">
	import UserCard from '$lib/components/admin/userCard.svelte';
	import {
		AlertCircleIcon,
		BookOpenIcon,
		FileText,
		LayoutDashboard,
		PencilIcon,
		PlusIcon,
		UserPlus,
		UsersIcon,
		XCircleIcon
	} from 'lucide-svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { gotoEdit, mergeNewPath } from '$lib/utils';
	import type { MessageStatus } from '$lib/components/admin/message.svelte';
	import Message from '$lib/components/admin/message.svelte';
	import { page } from '$app/state';

	let { data }: { data: PageData } = $props();

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

	<!-- section dashboard profile  -->
	<section class="w-full space-y-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h2 class="text-pure-white text-xl font-bold md:text-2xl">Path URL Profile Dashboard</h2>
				<p class="text-sm text-text-muted">
					Kelola tautan dan rute halaman navigasi dashboard utama sistem.
				</p>
			</div>

			<button
				type="button"
				onclick={() => goto(mergeNewPath('profil-dashboard/add'))}
				class="inline-flex items-center justify-center gap-2 rounded-xl bg-bg-secondary px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] hover:bg-bg-secondary-hover active:scale-[0.98]"
			>
				<PlusIcon class="h-4 w-4" />
				<span>Tambah URL Path</span>
			</button>
		</div>

		{#await data.listProfileDashboard}
			<!-- Loading State -->
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each Array.from({ length: 3 }) as _}
					<div
						class="flex animate-pulse flex-col justify-between rounded-2xl border border-white/5 bg-bg-secondary/30 p-5"
					>
						<div class="space-y-3">
							<div class="h-5 w-20 rounded-md bg-white/10"></div>
							<div class="h-6 w-3/4 rounded-md bg-white/10"></div>
							<div class="h-32 w-full rounded-lg bg-white/5"></div>
						</div>
					</div>
				{/each}
			</div>
		{:then res}
			<!-- 
	           Normalisasi data 'res' menjadi Array agar aman dibaca oleh .length dan {#each}
	       -->
			{@const listProfileDashboard = Array.isArray(res) ? res : res ? [res] : []}

			{#if listProfileDashboard.length === 0}
				<!-- Empty State -->
				<div
					class="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-amber-500/30 bg-amber-500/5 p-8 text-center backdrop-blur-sm md:p-12"
				>
					<div
						class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
					>
						<LayoutDashboard class="h-8 w-8" />
					</div>
					<h3 class="text-pure-white mb-1 text-lg font-bold md:text-xl">
						Belum Ada Path URL Profile Dashboard
					</h3>
					<p class="mb-6 max-w-md text-sm text-text-muted">
						Daftar path URL untuk navigasi dashboard belum dikonfigurasi. Silakan tambahkan path URL
						baru.
					</p>
					<button
						type="button"
						onclick={() => goto(mergeNewPath('profil-dashboard/add'))}
						class="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] hover:bg-amber-400 active:scale-[0.98]"
					>
						<PlusIcon class="h-4 w-4" />
						<span>Tambah Path URL Baru</span>
					</button>
				</div>
			{:else}
				<!-- Grid Card Profile Dashboard -->
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each listProfileDashboard as item (item.id)}
						<UserCard
							imageUrl={item.image_path}
							id={item.id}
							description={item.title}
							editUrl={mergeNewPath(`edit/${item.id}`)}
						/>
					{/each}
				</div>
			{/if}
		{:catch error}
			<div
				class="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-rose-300"
			>
				<AlertCircleIcon class="h-6 w-6 shrink-0 text-rose-400" />
				<div>
					<p class="font-semibold">Gagal Memuat Data Profile Dashboard</p>
					<p class="text-xs text-rose-300/80">{error.message}</p>
				</div>
			</div>
		{/await}
	</section>

	<!-- section  tabel dosen -->
	<section class="w-full space-y-6">
		<!-- Header Section dengan Tombol Tambah di Kanan Atas -->
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h2 class="text-pure-white text-xl font-bold md:text-2xl">Daftar Dosen & Staf</h2>
				<p class="text-sm text-text-muted">
					Kelola jajaran dosen pengajar dan staf akademik program studi.
				</p>
			</div>

			<!-- Tombol Tambah Dosen (Selalu Tampil di Header) -->
			<button
				type="button"
				onclick={() => goto(mergeNewPath('dosen/add'))}
				class="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] hover:bg-amber-400 active:scale-[0.98]"
			>
				<UserPlus class="h-4 w-4" />
				<span>Tambah Dosen & Staf</span>
			</button>
		</div>

		<!-- Stream Handling dengan {#await} -->
		{#await data.primaryDosenList}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each Array(3) as _}
					<div
						class="flex animate-pulse items-center gap-4 rounded-2xl border border-white/5 bg-bg-secondary/30 p-4"
					>
						<div class="h-16 w-16 shrink-0 rounded-xl bg-white/10"></div>
						<div class="flex-1 space-y-2">
							<div class="h-4 w-3/4 rounded-md bg-white/10"></div>
							<div class="h-3 w-1/2 rounded-md bg-white/5"></div>
						</div>
					</div>
				{/each}
			</div>
		{:then primaryDosenList}
			{#if !primaryDosenList || primaryDosenList.length === 0}
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
						onclick={() => goto('/')}
						class="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] hover:bg-amber-400 active:scale-[0.98]"
					>
						<UserPlus class="h-4 w-4" />
						<span>Tambah Dosen & Staf Baru</span>
					</button>
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each primaryDosenList as dosen (dosen.id)}
						<UserCard
							id={dosen.id}
							title={dosen.name}
							subtitle={dosen.position}
							imageUrl={dosen.photo_url || ''}
							editUrl={`/dosen/edit/${dosen.id}`}
						/>
					{/each}
				</div>
			{/if}
		{:catch error}
			<div
				class="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-rose-300"
			>
				<AlertCircleIcon class="h-6 w-6 shrink-0 text-rose-400" />
				<div>
					<p class="font-semibold">Gagal Memuat Data Dosen</p>
					<p class="text-xs text-rose-300/80">{error.message}</p>
				</div>
			</div>
		{/await}
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

		{#await data.listPerminatan}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each Array(3) as _}
					<div
						class="flex animate-pulse flex-col justify-between rounded-2xl border border-white/5 bg-bg-secondary/30 p-5"
					>
						<div class="space-y-3">
							<div class="h-5 w-24 rounded-lg bg-white/10"></div>
							<div class="h-6 w-3/4 rounded-md bg-white/10"></div>
							<div class="space-y-2 pt-2">
								<div class="h-3 w-full rounded bg-white/5"></div>
								<div class="h-3 w-5/6 rounded bg-white/5"></div>
							</div>
						</div>
						<div class="mt-5 flex justify-end border-t border-white/5 pt-4">
							<div class="h-8 w-8 rounded-lg bg-white/5"></div>
						</div>
					</div>
				{/each}
			</div>
		{:then listPerminatan}
			{#if !listPerminatan || listPerminatan.length === 0}
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
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each listPerminatan as item (item.id)}
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

							<div class="mt-5 flex items-center justify-end gap-2 border-t border-white/5 pt-4">
								<button
									type="button"
									onclick={() => goto(`${page.url.pathname}/perminatan/edit/${item.id}`)}
									class="rounded-lg p-2 text-text-muted transition-colors hover:bg-white/10 hover:text-text-main"
									title="Edit"
								>
									<PencilIcon class="h-4 w-4" />
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		{:catch error}
			<div
				class="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-rose-300"
			>
				<AlertCircleIcon class="h-6 w-6 shrink-0 text-rose-400" />
				<div>
					<p class="font-semibold">Gagal Memuat Data Peminatan TI</p>
					<p class="text-xs text-rose-300/80">{error.message}</p>
				</div>
			</div>
		{/await}
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
				onclick={() => goto(mergeNewPath('profil-prodi/add'))}
				class="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] hover:bg-amber-400 active:scale-[0.98]"
			>
				<PlusIcon class="h-4 w-4" />
				<span>Tambah Profil Baru</span>
			</button>
		</div>

		{#await data.listProfil}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each Array(3) as _}
					<div
						class="flex animate-pulse flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-bg-secondary/30 p-5"
					>
						<div class="space-y-4">
							<!-- Image/QR Skeleton Placeholder -->
							<div class="h-44 w-full rounded-xl bg-white/10"></div>
							<div class="h-6 w-3/4 rounded-md bg-white/10"></div>
							<div class="space-y-2">
								<div class="h-3 w-full rounded bg-white/5"></div>
								<div class="h-3 w-4/5 rounded bg-white/5"></div>
							</div>
						</div>
						<div class="mt-5 flex justify-end border-t border-white/5 pt-4">
							<div class="h-8 w-8 rounded-lg bg-white/5"></div>
						</div>
					</div>
				{/each}
			</div>
		{:then listProfil}
			{#if !listProfil || listProfil.length === 0}
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
						onclick={() => goto(mergeNewPath('profil-study'))}
						class="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] hover:bg-amber-400 active:scale-[0.98]"
					>
						<PlusIcon class="h-4 w-4" />
						<span>Tambah Profil & Pengaduan Baru</span>
					</button>
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each listProfil as profil (profil.id)}
						<UserCard
							id={profil.id}
							title={profil.title}
							description={profil.description}
							imageUrl={profil.image_url || ''}
							editUrl={`${page.url.pathname}/profil-prodi/edit/${profil.id}`}
						/>
					{/each}
				</div>
			{/if}
		{:catch error}
			<div
				class="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-rose-300"
			>
				<AlertCircleIcon class="h-6 w-6 shrink-0 text-rose-400" />
				<div>
					<p class="font-semibold">Gagal Memuat Data Profil & Pengaduan Prodi</p>
					<p class="text-xs text-rose-300/80">{error.message}</p>
				</div>
			</div>
		{/await}
	</section>
</div>
