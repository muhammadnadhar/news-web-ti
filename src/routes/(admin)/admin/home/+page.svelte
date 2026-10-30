<script lang="ts">
	import UserCard from '$lib/components/admin/userCard.svelte';
	import { AlertCircleIcon, LayoutDashboard, PencilIcon, PlusIcon } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { goto, invalidateAll } from '$app/navigation';
	import { mergeNewPath } from '$lib/utils';
	import { page } from '$app/state';
	import type { MessageStatus, ResponseMessage } from '$lib/types/message';
	import SpinLoading from '$lib/components/loading/spin.svelte';
	import { deserialize } from '$app/forms';
	import TablelProfilProdi from './_component/tablelProfilProdi.svelte';
	import Message from '$lib/components/notif/message.svelte';
	import AlertModal from '$lib/components/notif/alertModal.svelte';

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
	// State untuk mengontrol modal
	let openModal = $state(false);
	let activeDeleteAction = $state<() => void | Promise<void>>(() => {});
	let activeItemTitle = $state('');

	// Fungsi universal untuk membuka modal dengan aksi dan judul tertentu
	const handleOpenModal = (title: string, deleteAction: () => void) => {
		activeItemTitle = title;
		activeDeleteAction = deleteAction;
		openModal = true;
	};

	async function handleDeleteprofileProdi(id: string) {
		try {
			const formData = new FormData();
			formData.append('id', id);

			const response = await fetch('?/deleteProfileDashboard', {
				method: 'POST',
				body: formData
			});

			const result = deserialize(await response.text());

			if (result.type === 'success') {
				triggerMessage(
					'success',
					'Berhasil',
					(result.data as { message?: string })?.message || 'Data berhasil dihapus'
				);
				await invalidateAll();
			} else {
				triggerMessage(
					'error',
					'Gagal',
					(result.data as { message?: string })?.message || 'Gagal menghapus data'
				);
			}
		} catch (error) {
			console.error('Error deleting profile:', error);
			triggerMessage('error', 'Kesalahan', 'Terjadi kesalahan pada jaringan/server');
		}
	}

	async function handleDeleteDosenPrimary(id: string) {
		try {
			const formData = new FormData();
			formData.append('id', id);

			const response = await fetch('?/deleteDosenPrimary', {
				method: 'POST',
				body: formData
			});

			const result = deserialize(await response.text());

			if (result.type === 'success') {
				triggerMessage(
					'success',
					'Berhasil',
					(result.data as { message?: string })?.message || 'Dosen berhasil dihapus'
				);
				await invalidateAll();
			} else {
				triggerMessage(
					'error',
					'Gagal',
					(result.data as { message?: string })?.message || 'Gagal menghapus dosen'
				);
			}
		} catch (error) {
			console.error('Error deleting dosen primary:', error);
			triggerMessage('error', 'Kesalahan', 'Terjadi kesalahan pada jaringan/server');
		}
	}

	async function handleDeletePerminatanTI(id: string) {
		try {
			const formData = new FormData();
			formData.append('id', id);

			const response = await fetch('?/deletePerminatanTI', {
				method: 'POST',
				body: formData
			});

			const result = deserialize(await response.text());

			if (result.type === 'success') {
				triggerMessage(
					'success',
					'Berhasil',
					(result.data as { message?: string })?.message || 'Perminatan TI berhasil dihapus'
				);
				await invalidateAll();
			} else {
				triggerMessage(
					'error',
					'Gagal',
					(result.data as { message?: string })?.message || 'Gagal menghapus perminatan TI'
				);
			}
		} catch (error) {
			console.error('Error deleting perminatan TI:', error);
			triggerMessage('error', 'Kesalahan', 'Terjadi kesalahan pada jaringan/server');
		}
	}

	async function handleDeleteProfileProdiItem(id: string) {
		try {
			const formData = new FormData();
			formData.append('id', id);

			const response = await fetch('?/deleteProfileProdiItem', {
				method: 'POST',
				body: formData
			});

			const result = deserialize(await response.text());

			if (result.type === 'success') {
				triggerMessage(
					'success',
					'Berhasil',
					(result.data as { message?: string })?.message || 'Item profil prodi berhasil dihapus'
				);
				await invalidateAll();
			} else {
				triggerMessage(
					'error',
					'Gagal',
					(result.data as { message?: string })?.message || 'Gagal menghapus item profil prodi'
				);
			}
		} catch (error) {
			console.error('Error deleting profile prodi item:', error);
			triggerMessage('error', 'Kesalahan', 'Terjadi kesalahan pada jaringan/server');
		}
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
	<h1 class="text-2xl font-black tracking-tight text-text-main md:text-3xl">
		Manajemen Data Prodi Teknologi Informasi
	</h1>

	<!-- section dashboard profile  -->
	<section class="my-10 w-full space-y-6">
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
			<SpinLoading />
		{:then res}
			<!-- 
	           Normalisasi data 'res' menjadi Array agar aman dibaca oleh .length dan {#each}
	       -->
			{@const listProfileDashboard = Array.isArray(res) ? res : res ? [res] : []}

			{#if listProfileDashboard.length === 0}
				{@render emptyState(
					'Belum Gambar di Dashboard',
					'Daftar Gambar dashboard belum di konfigurasi, silahkan tambah Gambar baru',
					'Tambah Gambar Untuk Dashboard',
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
							onDelete={() =>
								handleOpenModal(item.title || 'Data Dashboard', async () => {
									await handleDeleteprofileProdi(item.id);
								})}
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
	<section class="my-10 w-full space-y-6">
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
			<SpinLoading />
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
					{#each primaryDosenList as dosen, index (dosen.primary_id ?? index)}
						<UserCard
							id={dosen.primary_id ?? index}
							title={dosen.name}
							subtitle={dosen.position}
							imageUrl={dosen.photo_url || ''}
							editUrl={mergeNewPath(`/dosen/edit/${dosen.primary_id ?? index}`)}
							onDelete={() =>
								handleOpenModal(dosen.name || 'Data Dosen Primary', async () => {
									await handleDeleteDosenPrimary(dosen.primary_id || dosen.lecturer_staff_id);
								})}
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
	<section class="my-10 w-full space-y-6">
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
			<SpinLoading />
		{:then listPerminatan}
			{#if !listPerminatan || listPerminatan.length === 0}
				{@render emptyState(
					'Belum ada Data Peminatan',
					'Bidang peminatan belum ditambhakan ke sistem. Silahakan buat bidang peminatan baru',
					'tambah peminatan baru',
					() => goto(mergeNewPath('perminatan/add'))
				)}
			{:else}
				<div
					class="grid w-full gap-4 {listPerminatan.length === 1
						? 'grid-cols-1'
						: listPerminatan.length === 2
							? 'grid-cols-1 sm:grid-cols-2'
							: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}"
				>
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

								<button
									type="button"
									onclick={() =>
										handleOpenModal(item.title || 'Data Peminatan TI', async () => {
											await handleDeletePerminatanTI(item.id);
										})}
									class="inline-flex items-center gap-1.5 border border-border-color bg-status-error px-3 py-1.5 text-xs font-bold text-text-dark shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] transition-all hover:bg-status-error/30 active:scale-95"
									title="Edit Peminatan"
								>
									<PencilIcon class="h-3.5 w-3.5" />
									<span>Delete</span>
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

	<!-- section  sambutan kaprodi -->
	<section class="my-10 w-full space-y-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h2 class="text-pure-white text-xl font-bold md:text-2xl">Sambutan Kaprodi</h2>
				<p class="text-sm text-text-muted">
					Kelola pesan sambutan pimpinan yang tampil di halaman utama
				</p>
			</div>
			{@render actionButton('Atur Sambutan', () => goto(mergeNewPath('kaprodi')))}
		</div>

		{#await data.wellcomeKaprodi}
			<SpinLoading />
		{:then wellcomeKaprodi}
			{#if !wellcomeKaprodi}
				{@render emptyState(
					'Belum ada Data Sambutan Pimpinan',
					'Data sambutan belum ditemukan di sistem, silahkan tambahkan data sambutan baru.',
					'Tambah Sambutan',
					() => goto(mergeNewPath('kaprodi'))
				)}
			{:else}
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<UserCard
						id={wellcomeKaprodi.id}
						title={wellcomeKaprodi.name ?? 'Pimpinan Prodi'}
						subtitle={wellcomeKaprodi.title}
						imageUrl={wellcomeKaprodi.photo_url || ''}
						editUrl={mergeNewPath('kaprodi')}
					/>
				</div>
			{/if}
		{:catch error}
			<div
				class="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-rose-300"
			>
				<AlertCircleIcon class="h-6 w-6 shrink-0 text-rose-400" />
				<div>
					<p class="font-semibold">Gagal Memuat Data Sambutan</p>
					<p class="text-xs text-rose-300/80">{error.message}</p>
				</div>
			</div>
		{/await}
	</section>

	<!-- seksi 4: tabel profil prodi -->
	<section class="my-10 w-full space-y-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h2 class="text-pure-white text-xl font-bold md:text-2xl">Profil & Pengaduan Prodi</h2>
				<p class="text-sm text-text-muted">
					Kelola informasi profil program studi Lainya bisa di masukin di sini.
				</p>
			</div>

			{@render actionButton('Tambah Profil Lainya', () => goto(mergeNewPath('profil-prodi/add')))}
		</div>

		{#await data.listProfil}
			<SpinLoading />
		{:then listProfil}
			{#if !listProfil || listProfil.length === 0}
				{@render emptyState(
					'Belum ada Data Profile & Pengaduan Prodi',
					'Data profil belum ada  , silahkan tambbhakkan informasi profile baru , ini akan di tampilkan di halaman depan',
					'Tambah Profile Baru',
					() => goto(mergeNewPath('profil-prodi/add'))
				)}
			{:else}
				<TablelProfilProdi
					{listProfil}
					pageUrlPathname={page.url.pathname}
					onDelete={(id) =>
						handleOpenModal('Data Profil Prodi', async () => {
							await handleDeleteProfileProdiItem(id);
						})}
				/>
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

<!-- Popup  -->
<!-- Popup Alert Modal Konfirmasi -->
<AlertModal
	isOpen={openModal}
	title="Konfirmasi Hapus"
	subtitle="Tindakan ini memerlukan verifikasi Anda"
	message="Apakah Anda yakin ingin menghapus data berikut?"
	itemTitle={activeItemTitle}
	variant="error"
	confirmText="Hapus Data"
	cancelText="Batal"
	onClose={() => {
		//  Reset state openModal agar bisa dibuka kembali di kemudian hari
		openModal = false;
	}}
	onSuccess={async () => {
		// Eksekusi fungsi hapus dan tunggu hingga selesai
		if (typeof activeDeleteAction === 'function') {
			await activeDeleteAction();
		}
		openModal = false;
	}}
/>
