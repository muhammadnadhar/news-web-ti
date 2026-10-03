<script lang="ts">
	import {
		User,
		Mail,
		Calendar,
		Key,
		Camera,
		UserCheck,
		Lock,
		Upload,
		Save,
		AlertCircle,
		CheckCircle2,
		XCircle,
		X,
		Loader2
	} from 'lucide-svelte';
	import type { PageData, Actions } from './$types';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import type { MessageStatus } from '$lib/components/admin/message.svelte';
	import Message from '$lib/components/admin/message.svelte';
	import Spin from '$lib/components/loading/spin.svelte';
	import {
		folder_cloudinary_admin_user,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';
	import { enhance } from '$app/forms';
	// Mendapatkan data dari +page.server.ts menggunakan Svelte 5 Rune
	let { data, form }: { data: PageData; form: Actions } = $props();

	let newPassword = $state<string>('');
	let editName = $state<string>('');
	let editEmail = $state<string>('');
	let editUsername = $state('');
	let selectedFile = $state<File | null>(null);
	let publicId = $state('');

	let avatarForm: HTMLFormElement;
	let uploadedAvatarUrl = $state<string>('');

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

	// --- STATE UNTUK CUSTOM MODAL NOTIFIKASI ---
	let showModal = $state(false);
	let modalTitle = $state('');
	let modalMessage = $state('');
	let modalType = $state<'success' | 'error' | 'warning'>('success');

	// State tambahan untuk animasi loading/spinner foto profil
	let isUploadingAvatar = $state(false);

	function openNotification(
		title: string,
		message: string,
		type: 'success' | 'error' | 'warning' = 'success'
	) {
		modalTitle = title;
		modalMessage = message;
		modalType = type;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}

	// Sinkronkan state form lokal saat promise data user selesai dimuat
	$effect(() => {
		data.user.then((user) => {
			if (user) {
				editName = user.name || '';
				editEmail = user.email || '';
				editUsername = user.username || '';
				publicId = user.image_public_id ?? '';
			}
		});
	});
	function handleUploadSuccess(result: any) {
		if (result?.info?.secure_url) {
			uploadedAvatarUrl = result.info.secure_url;
			publicId = result.info.public_id;
			// Submit form secara otomatis setelah upload ke Cloudinary selesai
			setTimeout(() => avatarForm?.requestSubmit(), 100);
		}
	}

	// Handler submit Ubah Password
	async function handlePasswordChange(event: SubmitEvent) {
		event.preventDefault();

		if (!newPassword || newPassword.length < 6) {
			openNotification('Peringatan', 'Kata sandi baru minimal harus 6 karakter.', 'warning');
			return;
		}

		const formData = new FormData();
		formData.append('newPassword', newPassword);

		const response = await fetch('?/updatePassword', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			//	openNotification('Berhasil', 'Kata sandi berhasil diperbarui!', 'success');
			triggerMessage('success', 'Success', 'Kata sandi berhasil di perbaharui');
			newPassword = '';
		} else {
			openNotification('Gagal', 'Gagal memperbarui kata sandi.', 'error');
		}
	}

	// Handler submit Ubah Data Profil
	async function handleProfileUpdate(event: SubmitEvent) {
		event.preventDefault();

		if (!editName || !editUsername || !editEmail) {
			openNotification('Peringatan', 'Nama, Username, dan Email wajib diisi.', 'warning');
			return;
		}

		const formData = new FormData();
		formData.append('name', editName);
		formData.append('username', editUsername);
		formData.append('email', editEmail);

		const response = await fetch('?/updateProfile', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			//	openNotification('Berhasil', 'Profil berhasil diperbarui!', 'success');
			triggerMessage('success', 'Berhasil', 'Profil Berhasil di perbaharui');
		} else {
			openNotification('Gagal', 'Gagal memperbarui profil.', 'error');
		}
	}
</script>

<div class="min-h-screen bg-bg-primary px-6 py-10 text-text-main">
	<div class="mx-auto max-w-7xl space-y-8">
		<div class="flex items-center justify-between pb-5">
			<div>
				<h1 class="text-pure-white text-3xl font-extrabold tracking-wide uppercase">Profilku</h1>
				<p class="mt-1 text-sm text-text-muted">
					Kelola informasi akun dan keamanan laboratorium Anda
				</p>
			</div>
			<div
				class="flex items-center gap-2 rounded-lg border border-bg-secondary-hover bg-bg-secondary px-3 py-1.5 text-xs text-accent-cyan"
			>
				<UserCheck class="h-4 w-4 text-accent-primary" />
				<span>Akun Terverifikasi</span>
			</div>
		</div>

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

		{#await data.user}
			<Spin />
		{:then user}
			{#if user}
				<div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
					<!-- Left Column: Informasi Profil Utama (7 Cols) -->
					<div class="space-y-8 lg:col-span-7">
						<div
							class="group relative flex flex-col items-center gap-6 overflow-hidden rounded-xl border border-bg-secondary-hover bg-bg-secondary p-6 sm:flex-row sm:items-start sm:p-8"
						>
							<div
								class="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-accent-primary/5 blur-2xl transition-all group-hover:bg-accent-primary/10"
							></div>

							<div class="relative shrink-0">
								<div
									class="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border-2 border-accent-primary/30 bg-bg-primary-glare text-accent-primary shadow-lg"
								>
									{#if user.image_url}
										<img src={user.image_url} alt={user.name} class="h-full w-full object-cover" />
									{:else}
										<User class="h-16 w-16 text-text-muted" />
									{/if}
								</div>
							</div>

							<div class="flex-1 space-y-4 text-center sm:text-left">
								<div>
									<h2 class="text-pure-white text-2xl leading-tight font-bold">{user.name}</h2>
									<span
										class="mt-1 inline-block rounded border border-accent-primary/20 bg-accent-primary-dim px-2.5 py-0.5 text-xs font-semibold text-accent-primary"
									>
										Member / Mahasiswa
									</span>
								</div>

								<div class="space-y-2.5 border-t border-bg-secondary-hover pt-2 text-sm">
									<div
										class="flex items-center justify-center gap-3 text-text-muted sm:justify-start"
									>
										<User class="h-4 w-4 shrink-0 text-accent-cyan" />
										<span
											>Username: <strong class="text-pure-white font-medium"
												>@{user.username}</strong
											></span
										>
									</div>
									<div
										class="flex items-center justify-center gap-3 text-text-muted sm:justify-start"
									>
										<Mail class="h-4 w-4 shrink-0 text-accent-cyan" />
										<span
											>Email: <strong class="text-pure-white font-medium">{user.email}</strong
											></span
										>
									</div>
									<div
										class="flex items-center justify-center gap-3 text-text-muted sm:justify-start"
									>
										<Calendar class="h-4 w-4 shrink-0 text-accent-cyan" />
										<span
											>Dibuat pada: <strong class="text-pure-white font-medium"
												>{user.createdAt}</strong
											></span
										>
									</div>
								</div>
							</div>
						</div>

						<div
							class="overflow-hidden rounded-xl border border-bg-secondary-hover bg-bg-secondary"
						>
							<div
								class="text-pure-white flex items-center gap-2 border-b border-bg-secondary-hover bg-bg-primary-glare px-6 py-4 text-sm font-semibold"
							>
								<Lock class="h-4 w-4 text-accent-primary" />
								<span>Ubah Kata Sandi</span>
							</div>

							<form onsubmit={handlePasswordChange} class="space-y-4 p-6">
								<div class="space-y-2">
									<label
										for="password"
										class="block text-xs font-semibold tracking-wider text-text-muted uppercase"
									>
										Masukkan Sandi Baru
									</label>
									<div class="relative">
										<input
											type="password"
											id="password"
											bind:value={newPassword}
											placeholder="••••••••••••"
											class="w-full rounded-lg border border-bg-secondary-hover bg-bg-primary px-4 py-2.5 text-sm text-text-main placeholder-text-muted/50 transition-colors outline-none focus:border-accent-primary"
										/>
										<Key class="absolute top-3 right-3.5 h-4 w-4 text-text-muted" />
									</div>
								</div>

								<button
									type="submit"
									class="flex items-center gap-2 rounded-lg bg-accent-primary px-5 py-2.5 text-sm font-semibold text-text-dark shadow-md shadow-accent-primary/10 transition-all hover:bg-accent-primary-hover"
								>
									<Save class="h-4 w-4" />
									<span>Ubah Sandi</span>
								</button>
							</form>
						</div>
					</div>

					<!-- Right Column: Ubah Foto & Data Tambahan (5 Cols) -->
					<div class="space-y-8 lg:col-span-5">
						<div
							class="overflow-hidden rounded-xl border border-bg-secondary-hover bg-bg-secondary"
						>
							<div
								class="text-pure-white flex items-center gap-2 border-b border-bg-secondary-hover bg-bg-primary-glare px-6 py-4 text-sm font-semibold"
							>
								<Camera class="h-4 w-4 text-accent-primary" />
								<span>Ubah Foto Profil</span>
							</div>

							<div class="space-y-4 p-6">
								<CldUploadWidget
									uploadPreset={upload_cloudinary_preset}
									onSuccess={handleUploadSuccess}
									config={getUploadConfig()}
									options={getUploadOptions(folder_cloudinary_admin_user)}
									let:open
									let:isLoading
								>
									<button
										type="button"
										onclick={() => open()}
										disabled={isLoading || isUploadingAvatar}
										class="flex h-32 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-bg-secondary-hover bg-bg-primary/50 transition-all hover:border-accent-primary hover:bg-bg-primary disabled:opacity-50"
									>
										<div class="flex flex-col items-center justify-center text-text-muted">
											{#if isLoading || isUploadingAvatar}
												<Loader2 class="mb-2 h-8 w-8 animate-spin text-accent-cyan" />
												<p class="text-xs font-medium">
													{isUploadingAvatar ? 'Menyimpan ke Database...' : 'Membuka Cloudinary...'}
												</p>
											{:else}
												<Upload class="mb-2 h-8 w-8 text-accent-cyan" />
												<p class="text-xs font-medium">Klik untuk Unggah / Pilih Foto</p>
												<p class="mt-1 text-[10px] text-text-muted/70">Powered by Cloudinary</p>
											{/if}
										</div>
									</button>
								</CldUploadWidget>

								<form
									bind:this={avatarForm}
									method="POST"
									action="?/updateAvatar"
									use:enhance={() => {
										isUploadingAvatar = true; // Aktifkan spinner saat submit dimulai
										return async ({ update }) => {
											await update();
											isUploadingAvatar = false; // Matikan spinner setelah selesai
											triggerMessage('success', 'Berhasil', 'Foto profil berhasil diperbarui!');
										};
									}}
									class="hidden"
								>
									<input type="hidden" name="image_url" value={uploadedAvatarUrl} />
									<input type="hidden" name="image_public_id" value={publicId} />
								</form>
							</div>
						</div>

						<!-- Section Ubah Data -->
						<div
							class="overflow-hidden rounded-xl border border-bg-secondary-hover bg-bg-secondary"
						>
							<div
								class="text-pure-white flex items-center gap-2 border-b border-bg-secondary-hover bg-bg-primary-glare px-6 py-4 text-sm font-semibold"
							>
								<User class="h-4 w-4 text-accent-primary" />
								<span>Ubah Data</span>
							</div>

							<form onsubmit={handleProfileUpdate} class="space-y-4 p-6">
								<div class="space-y-2">
									<label
										for="name"
										class="block text-xs font-semibold tracking-wider text-text-muted uppercase"
									>
										Nama Lengkap
									</label>
									<input
										type="text"
										id="name"
										bind:value={editName}
										class="w-full rounded-lg border border-bg-secondary-hover bg-bg-primary px-4 py-2.5 text-sm text-text-main transition-colors outline-none focus:border-accent-primary"
									/>
								</div>

								<div class="space-y-2">
									<label
										for="username"
										class="block text-xs font-semibold tracking-wider text-text-muted uppercase"
									>
										Username
									</label>
									<input
										type="text"
										id="username"
										bind:value={editUsername}
										class="w-full rounded-lg border border-bg-secondary-hover bg-bg-primary px-4 py-2.5 text-sm text-text-main transition-colors outline-none focus:border-accent-primary"
									/>
								</div>

								<div class="space-y-2">
									<label
										for="email"
										class="block text-xs font-semibold tracking-wider text-text-muted uppercase"
									>
										Alamat Email
									</label>
									<input
										type="email"
										id="email"
										bind:value={editEmail}
										class="w-full rounded-lg border border-bg-secondary-hover bg-bg-primary px-4 py-2.5 text-sm text-text-main transition-colors outline-none focus:border-accent-primary"
									/>
								</div>

								<button
									type="submit"
									class="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-primary py-2.5 text-sm font-semibold text-text-dark transition-all hover:bg-accent-primary-hover"
								>
									<Save class="h-4 w-4" />
									<span>Simpan Perubahan</span>
								</button>
							</form>
						</div>
					</div>
				</div>
			{/if}
		{:catch error}
			<!-- Tampilan penanganan error jika query gagal -->
			<!-- <div -->
			<!-- 	class="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-red-400" -->
			<!-- > -->
			<!-- 	<AlertCircle class="h-6 w-6 shrink-0" /> -->
			<!-- 	<div> -->
			<!-- 		<h3 class="font-bold">Gagal memuat profil</h3> -->
			<!-- 		<p class="text-sm text-red-300/80"> -->
			<!-- 			{error?.message || 'Terjadi kesalahan tidak terduga.'} -->
			<!-- 		</p> -->
			<!-- 	</div> -->
			<!-- </div> -->
			{triggerMessage('error', 'error', error?.message || 'terjadi kesalahan yang tidak di duga')}
		{/await}
	</div>
</div>

{#if showModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm transition-all"
	>
		<div
			class="animate-in fade-in zoom-in-95 w-full max-w-md overflow-hidden rounded-xl border border-bg-secondary-hover bg-bg-secondary p-6 shadow-2xl duration-200"
		>
			<div class="flex items-start justify-between gap-4">
				<div class="flex items-center gap-3">
					{#if modalType === 'success'}
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400"
						>
							<CheckCircle2 class="h-6 w-6" />
						</div>
					{:else if modalType === 'error'}
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-400"
						>
							<XCircle class="h-6 w-6" />
						</div>
					{:else}
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400"
						>
							<AlertCircle class="h-6 w-6" />
						</div>
					{/if}

					<div>
						<h3 class="text-pure-white text-base font-bold">{modalTitle}</h3>
						<p class="mt-1 text-sm text-text-muted">{modalMessage}</p>
					</div>
				</div>

				<button
					type="button"
					onclick={closeModal}
					class="hover:text-pure-white text-text-muted transition-colors"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<div class="mt-6 flex justify-end">
				<button
					type="button"
					onclick={closeModal}
					class="rounded-lg bg-accent-primary px-5 py-2 text-sm font-semibold text-text-dark transition-all hover:bg-accent-primary-hover"
				>
					Tutup
				</button>
			</div>
		</div>
	</div>
{/if}
