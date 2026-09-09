<script lang="ts">
	import { User, Mail, Calendar, Key, Camera, UserCheck, Lock, Upload, Save } from 'lucide-svelte';

	// ok ntar kita ambil data dari database
	let user = {
		name: 'M. Fadhlan',
		username: 'simax17',
		email: 'mfadhlan1721@gmail.com',
		created_at: '21 March 2023',
		avatar: null
	};

	let newPassword = $state<string>('');
	let selectedFile = null;

	function handlePasswordChange() {
		// Handling ubah kata sandi
		console.log('Password changed:', newPassword);
	}
</script>

<div class="bg-bg-primary text-text-main min-h-screen px-6 py-10">
	<div class="mx-auto max-w-7xl space-y-8">
		<!-- Title Section -->
		<div class="border-bg-secondary-hover flex items-center justify-between border-b pb-5">
			<div>
				<h1 class="text-pure-white text-3xl font-extrabold tracking-wide uppercase">Profilku</h1>
				<p class="text-text-muted mt-1 text-sm">
					Kelola informasi akun dan keamanan laboratorium Anda
				</p>
			</div>
			<div
				class="bg-bg-secondary border-bg-secondary-hover text-accent-cyan flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs"
			>
				<UserCheck class="text-accent-primary h-4 w-4" />
				<span>Akun Terverifikasi</span>
			</div>
		</div>

		<!-- Main Content Layout Grid -->
		<div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
			<!-- Left Column: Informasi Profil Utama (8 Cols) -->
			<div class="space-y-8 lg:col-span-7">
				<!-- Profile Card -->
				<div
					class="bg-bg-secondary border-bg-secondary-hover group relative flex flex-col items-center gap-6 overflow-hidden rounded-xl border p-6 sm:flex-row sm:items-start sm:p-8"
				>
					<!-- Ambient Glow Effect -->
					<div
						class="bg-accent-primary/5 group-hover:bg-accent-primary/10 absolute -right-10 -bottom-10 h-40 w-40 rounded-full blur-2xl transition-all"
					></div>

					<!-- Avatar Wrapper -->
					<div class="relative shrink-0">
						<div
							class="bg-bg-primary-glare border-accent-primary/30 text-accent-primary flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border-2 shadow-lg"
						>
							{#if user.avatar}
								<img src={user.avatar} alt={user.name} class="h-full w-full object-cover" />
							{:else}
								<User class="text-text-muted h-16 w-16" />
							{/if}
						</div>
					</div>

					<!-- User Info Details -->
					<div class="flex-1 space-y-4 text-center sm:text-left">
						<div>
							<h2 class="text-pure-white text-2xl leading-tight font-bold">{user.name}</h2>
							<span
								class="bg-accent-primary-dim text-accent-primary border-accent-primary/20 mt-1 inline-block rounded border px-2.5 py-0.5 text-xs font-semibold"
							>
								Member / Mahasiswa
							</span>
						</div>

						<div class="border-bg-secondary-hover space-y-2.5 border-t pt-2 text-sm">
							<div class="text-text-muted flex items-center justify-center gap-3 sm:justify-start">
								<User class="text-accent-cyan h-4 w-4 shrink-0" />
								<span
									>Username: <strong class="text-pure-white font-medium">@{user.username}</strong
									></span
								>
							</div>
							<div class="text-text-muted flex items-center justify-center gap-3 sm:justify-start">
								<Mail class="text-accent-cyan h-4 w-4 shrink-0" />
								<span>Email: <strong class="text-pure-white font-medium">{user.email}</strong></span
								>
							</div>
							<div class="text-text-muted flex items-center justify-center gap-3 sm:justify-start">
								<Calendar class="text-accent-cyan h-4 w-4 shrink-0" />
								<span
									>Dibuat pada: <strong class="text-pure-white font-medium"
										>{user.created_at}</strong
									></span
								>
							</div>
						</div>
					</div>
				</div>

				<!-- Section Ubah Kata Sandi -->
				<div class="bg-bg-secondary border-bg-secondary-hover overflow-hidden rounded-xl border">
					<div
						class="bg-bg-primary-glare border-bg-secondary-hover text-pure-white flex items-center gap-2 border-b px-6 py-4 text-sm font-semibold"
					>
						<Lock class="text-accent-primary h-4 w-4" />
						<span>Ubah Kata Sandi</span>
					</div>

					<form on:submit|preventDefault={handlePasswordChange} class="space-y-4 p-6">
						<div class="space-y-2">
							<label
								for="password"
								class="text-text-muted block text-xs font-semibold tracking-wider uppercase"
							>
								Masukkan Sandi Baru
							</label>
							<div class="relative">
								<input
									type="password"
									id="password"
									bind:value={newPassword}
									placeholder="••••••••••••"
									class="bg-bg-primary border-bg-secondary-hover focus:border-accent-primary text-text-main placeholder-text-muted/50 w-full rounded-lg border px-4 py-2.5 text-sm transition-colors outline-none"
								/>
								<Key class="text-text-muted absolute top-3 right-3.5 h-4 w-4" />
							</div>
						</div>

						<button
							type="submit"
							class="bg-accent-primary hover:bg-accent-primary-hover text-text-dark shadow-accent-primary/10 flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-md transition-all"
						>
							<Save class="h-4 w-4" />
							<span>Ubah Sandi</span>
						</button>
					</form>
				</div>
			</div>

			<!-- Right Column: Ubah Foto & DataTambahan (5 Cols) -->
			<div class="space-y-8 lg:col-span-5">
				<!-- Section Ubah Foto Profil -->
				<div class="bg-bg-secondary border-bg-secondary-hover overflow-hidden rounded-xl border">
					<div
						class="bg-bg-primary-glare border-bg-secondary-hover text-pure-white flex items-center gap-2 border-b px-6 py-4 text-sm font-semibold"
					>
						<Camera class="text-accent-primary h-4 w-4" />
						<span>Ubah Foto Profil</span>
					</div>

					<div class="space-y-4 p-6">
						<div class="flex w-full items-center justify-center">
							<label
								class="border-bg-secondary-hover hover:border-accent-primary bg-bg-primary/50 hover:bg-bg-primary flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all"
							>
								<div class="text-text-muted flex flex-col items-center justify-center pt-5 pb-6">
									<Upload class="text-accent-cyan mb-2 h-8 w-8" />
									<p class="text-xs font-medium">Klik untuk memilih file foto</p>
									<p class="text-text-muted/70 mt-1 text-[10px]">PNG, JPG atau WEBP (Max. 2MB)</p>
								</div>
								<input type="file" class="hidden" accept="image/*" />
							</label>
						</div>

						<button
							class="bg-bg-secondary-hover hover:bg-bg-primary-glare border-bg-secondary-hover text-pure-white flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition-all"
						>
							<Upload class="text-accent-primary h-4 w-4" />
							<span>Unggah Foto</span>
						</button>
					</div>
				</div>

				<!-- Section Ubah Data -->
				<div class="bg-bg-secondary border-bg-secondary-hover overflow-hidden rounded-xl border">
					<div
						class="bg-bg-primary-glare border-bg-secondary-hover text-pure-white flex items-center gap-2 border-b px-6 py-4 text-sm font-semibold"
					>
						<User class="text-accent-primary h-4 w-4" />
						<span>Ubah Data</span>
					</div>

					<div class="space-y-4 p-6">
						<div class="space-y-2">
							<label
								for="name"
								class="text-text-muted block text-xs font-semibold tracking-wider uppercase"
								>Nama Lengkap</label
							>
							<input
								type="text"
								id="name"
								bind:value={user.name}
								class="bg-bg-primary border-bg-secondary-hover focus:border-accent-primary text-text-main w-full rounded-lg border px-4 py-2.5 text-sm transition-colors outline-none"
							/>
						</div>

						<div class="space-y-2">
							<label
								for="email"
								class="text-text-muted block text-xs font-semibold tracking-wider uppercase"
								>Alamat Email</label
							>
							<input
								type="email"
								id="email"
								bind:value={user.email}
								class="bg-bg-primary border-bg-secondary-hover focus:border-accent-primary text-text-main w-full rounded-lg border px-4 py-2.5 text-sm transition-colors outline-none"
							/>
						</div>

						<button
							class="bg-accent-primary hover:bg-accent-primary-hover text-text-dark flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all"
						>
							<Save class="h-4 w-4" />
							<span>Simpan Perubahan</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
