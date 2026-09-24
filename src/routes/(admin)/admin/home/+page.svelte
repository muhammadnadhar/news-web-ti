<script lang="ts">
	import UserCard from '$lib/components/admin/userCard.svelte';
	import { AlertCircleIcon, LayoutDashboard, PencilIcon, PlusIcon, UserPlus } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { gotoEdit, mergeNewPath } from '$lib/utils';
	import type { MessageStatus } from '$lib/components/admin/message.svelte';
	import Message from '$lib/components/admin/message.svelte';
	import { page } from '$app/state';
	import type { ResponseMessage } from '$lib/types/message';

	let { data }: { data: PageData } = $props();

	let showMessage = $state(false);
	let messageConfig = $state<ResponseMessage>({
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

<!-- ----------- components ---------------- -->
{#snippet emptyState(
	title = 'Belum Ada Path URL Profile Dashboard',
	description = 'Daftar path URL untuk navigasi dashboard belum dikonfigurasi. Silakan tambahkan path URL baru.',
	actionText = 'Tambah Path URL Baru',
	onAction = () => goto(mergeNewPath('profil-dashboard/add')),
	IconComponent = LayoutDashboard
)}
	<div
		class="flex w-full flex-col items-center justify-center border border-border-light bg-bg-secondary p-8 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] transition-all hover:bg-bg-secondary-hover md:p-12"
	>
		<div
			class="mb-4 flex h-16 w-16 items-center justify-center border border-border-light bg-bg-primary text-accent-cyan shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
		>
			<IconComponent class="h-8 w-8" />
		</div>

		<h3 class="mb-1 text-lg font-bold text-text-main md:text-xl">
			{title}
		</h3>
		<p class="mb-6 max-w-md text-sm text-text-muted">
			{description}
		</p>

		{#if actionText && onAction}
			<button
				type="button"
				onclick={onAction}
				class="inline-flex items-center gap-2 border border-border-light bg-accent-primary px-5 py-2.5 text-sm font-bold text-text-dark shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] transition-all hover:bg-accent-primary-hover active:scale-95"
			>
				<PlusIcon class="h-4 w-4" />
				<span>{actionText}</span>
			</button>
		{/if}
	</div>
{/snippet}

<!-- Snippet Reusable Tombol Aksi (3D Neobrutalist) -->
{#snippet actionButton(
	label = 'Tambah Peminatan',
	onClick = () => goto(mergeNewPath('perminatan/add')),
	IconComponent = PlusIcon
)}
	<button
		type="button"
		onclick={onClick}
		class="inline-flex items-center justify-center gap-2 border border-border-color bg-bg-secondary px-4 py-2.5 text-sm font-bold text-text-main shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-bg-secondary-hover hover:text-accent-primary hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] active:scale-95"
	>
		{#if IconComponent}
			<IconComponent class="h-4 w-4" />
		{/if}
		<span>{label}</span>
	</button>
{/snippet}

<!-- ----------- components ---------------- -->

<div class="container">
	<h1 class="text-2xl font-black tracking-tight text-text-main uppercase md:text-3xl">
		Manajemen Data Prodi Teknologi Informasi
	</h1>

	<!-- section dashboard profile  -->
	<section class="mt-2.5 w-full space-y-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h2 class="text-pure-white text-xl font-bold md:text-2xl">Profile Dashboard</h2>
				<p class="text-sm text-text-muted">
					Kelola tautan dan rute halaman navigasi dashboard utama sistem.
				</p>
			</div>

			{@render actionButton('Tambah Image Dashboard', () =>
				goto(mergeNewPath('profil-dashboard/add'))
			)}
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
				{@render emptyState(
					'Belum Ad Path URL Profile Dashboard',
					'Daftar path URL untuk navigasi dashboard belum di konfigurasi, silahkan tambah path URL baru',
					'Tambah Foto Untuk Dashboard',
					() => goto(mergeNewPath('profil-dashboard/add'))
				)}
			{:else}
				<!-- Grid Card Profile Dashboard -->
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each listProfileDashboard as item (item.id)}
						<UserCard
							imageUrl={item.image_path}
							id={item.id}
							description={item.title}
							editUrl={mergeNewPath(`profil-dashboard/edit/${item.id}`)}
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
	<section class="mt-2.5 w-full space-y-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h2 class="text-pure-white text-xl font-bold md:text-2xl">Daftar Dosen atau Staff</h2>
				<p class="text-sm text-text-muted">
					Kelola jajaran dosen pengajar primary yang tampil di halaman utama
				</p>
			</div>
			{@render actionButton('Tambah Dosen Primary', () => goto(mergeNewPath('dosen/add')))}
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
				{@render emptyState(
					'Belum ada Data DOsen & Staff',
					'Data dosen dan staff belum sistem temukan , silahkan tambhakkan dosen dan staff baru',
					'Tambahkan Dosen',
					() => goto(mergeNewPath('dosen/add'))
				)}
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
	<section class="mt-2.5 w-full space-y-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h2 class="text-pure-white text-xl font-bold md:text-2xl">Peminatan / Konsentrasi TI</h2>
				<p class="text-sm text-text-muted">
					Kelola daftar peminatan dan bidang keahlian mahasiswa.
				</p>
			</div>

			{@render actionButton('Tambah Peminatan', () => goto(mergeNewPath('perminatan/add')))}
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
				{@render emptyState(
					'Belum ada Data Peminatan',
					'Bidang peminatan belum ditambhakan ke sistem. Silahakan buat bidang peminatan baru',
					'tambah peminatan baru',
					() => goto(mergeNewPath('perminatan/add'))
				)}
			{:else}
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{#each listPerminatan as item (item.id)}
						<div
							class="group flex flex-col justify-between border border-border-color bg-bg-secondary p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:border-accent-primary hover:bg-bg-secondary-hover hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,0.5)]"
						>
							<div>
								<div class="mb-3 flex items-center justify-between">
									<span
										class="inline-block border border-accent-primary/30 bg-accent-primary/10 px-2.5 py-1 text-xs font-semibold text-accent-primary uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
									>
										Peminatan TI
									</span>
								</div>

								<h4
									class="text-lg font-bold text-text-main transition-colors group-hover:text-accent-primary"
								>
									{item.title}
								</h4>

								<p class="mt-2 line-clamp-3 text-sm leading-relaxed text-text-muted">
									{item.description}
								</p>
							</div>

							<div
								class="mt-5 flex items-center justify-end gap-2 border-t border-border-color pt-4"
							>
								<button
									type="button"
									onclick={() => goto(`${page.url.pathname}/perminatan/edit/${item.id}`)}
									class="inline-flex items-center gap-1.5 border border-border-color bg-accent-primary px-3 py-1.5 text-xs font-bold text-text-dark shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] transition-all hover:bg-accent-primary-hover active:scale-95"
									title="Edit Peminatan"
								>
									<PencilIcon class="h-3.5 w-3.5" />
									<span>Ubah</span>
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
	<section class="mt-2.5 w-full space-y-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h2 class="text-pure-white text-xl font-bold md:text-2xl">Profil & Pengaduan Prodi</h2>
				<p class="text-sm text-text-muted">
					Kelola informasi profil program studi dan gambar/QR barcode pengaduan.
				</p>
			</div>

			{@render actionButton('Tambah Profil Lainya', () => goto(mergeNewPath('profil-prodi/add')))}
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
				{@render emptyState(
					'Belum ada Data Profile & Pengaduan Prodi',
					'Data profil belum ada  , silahkan tambbhakkan informasi profile baru , ini akan di tampilkan di halaman depan',
					'Tambah Profile Baru',
					() => goto(mergeNewPath('profil-dashboard'))
				)}
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
