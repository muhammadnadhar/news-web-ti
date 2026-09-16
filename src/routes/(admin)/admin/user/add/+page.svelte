<!-- src/routes/admin/users/create/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		UserPlus,
		User,
		Mail,
		Lock,
		AtSign,
		ShieldCheck,
		Feather,
		UserCog,
		ArrowLeft,
		Check,
		AlertCircle
	} from 'lucide-svelte';
	import type { ActionData } from './$types';
	import type { UserAdminItem } from '$lib/types/admin/user';

	let { form }: { form: ActionData } = $props();

	// State reaktif Svelte 5
	let selectedRole = $state<UserAdminItem['role']>(form?.values?.role ?? 'Administrator');
	let selectedStatus = $state<UserAdminItem['status']>(form?.values?.status ?? 'Active');
	let isSubmitting = $state(false);

	// Definisi opsi role sesuai Interface
	const roleOptions: {
		id: UserAdminItem['role'];
		label: string;
		desc: string;
		icon: any;
		badgeBg: string;
	}[] = [
		{
			id: 'Author',
			label: 'Author (Penulis)',
			desc: 'Memiliki akses untuk membuat, mengedit, dan mengelola draf berita/konten.',
			icon: Feather,
			badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
		},
		{
			id: 'Administrator',
			label: 'Administrator',
			desc: 'Akses penuh ke seluruh sistem, manajemen pengguna, dan pengaturan.',
			icon: ShieldCheck,
			badgeBg: 'bg-scitech-mint/10 text-scitech-mint border-scitech-mint/30'
		},
		{
			id: 'Supervisor',
			label: 'Supervisor',
			desc: 'Akses pengawasan, verifikasi konten, dan publikasi berita.',
			icon: UserCog,
			badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
		}
	];
</script>

<svelte:head>
	<title>Tambah User Baru - Admin Portal</title>
</svelte:head>

<div class="bg-scitech-navy min-h-screen p-4 text-text-main md:p-8">
	<div class="mx-auto max-w-4xl space-y-6">
		<!-- Header Page -->
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<!-- <button -->
				<!-- 	href="/admin/users" -->
				<!-- 	class="bg-scitech-slate hover:border-scitech-mint/40 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 transition-colors" -->
				<!-- 	title="Kembali" -->
				<!-- > -->
				<!-- 	<ArrowLeft class="h-5 w-5 text-slate-300" /> -->
				<!-- </button> -->
				<div>
					<h1 class="text-2xl font-bold tracking-tight text-text-main">Tambah Pengguna Baru</h1>
					<p class="text-xs text-slate-400">Buat akun pengelola portal berita dan sistem</p>
				</div>
			</div>
		</div>

		{#if form?.error}
			<div
				class="border-scitech-error/50 bg-scitech-error/10 flex items-center gap-3 rounded-2xl border p-4 text-red-400"
			>
				<AlertCircle class="h-5 w-5 shrink-0" />
				<p class="text-sm font-medium">{form.error}</p>
			</div>
		{/if}

		<!-- Card Form Tambah User -->
		<div class="bg-scitech-slate rounded-3xl border border-white/10 p-6 shadow-2xl md:p-8">
			<form
				method="POST"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
				class="space-y-8"
			>
				<div class="space-y-4">
					<h3
						class="border-b border-white/10 pb-2 text-sm font-semibold tracking-wider text-slate-400 uppercase"
					>
						Informasi Kredensial
					</h3>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div class="space-y-1.5">
							<label for="name" class="text-xs font-medium text-slate-300">Nama Lengkap</label>
							<div class="relative">
								<User class="absolute top-3.5 left-3.5 h-4 w-4 text-slate-500" />
								<input
									type="text"
									id="name"
									name="name"
									required
									placeholder="Contoh: Ahmad Subagja"
									value={form?.values?.name ?? ''}
									class="bg-scitech-navy focus:border-scitech-mint focus:ring-scitech-mint w-full rounded-xl border border-white/10 py-3 pr-4 pl-10 text-xs text-text-main placeholder-slate-500 transition-all focus:ring-1 focus:outline-none"
								/>
							</div>
						</div>

						<!-- Username -->
						<div class="space-y-1.5">
							<label for="username" class="text-xs font-medium text-slate-300">Username</label>
							<div class="relative">
								<AtSign class="absolute top-3.5 left-3.5 h-4 w-4 text-slate-500" />
								<input
									type="text"
									id="username"
									name="username"
									required
									placeholder="ahmad_subagja"
									value={form?.values?.username ?? ''}
									class="bg-scitech-navy focus:border-scitech-mint focus:ring-scitech-mint w-full rounded-xl border border-white/10 py-3 pr-4 pl-10 text-xs text-text-main placeholder-slate-500 transition-all focus:ring-1 focus:outline-none"
								/>
							</div>
						</div>

						<div class="space-y-1.5">
							<label for="email" class="text-xs font-medium text-slate-300">Email Utama</label>
							<div class="relative">
								<Mail class="absolute top-3.5 left-3.5 h-4 w-4 text-slate-500" />
								<input
									type="email"
									id="email"
									name="email"
									required
									placeholder="ahmad@uin.ac.id"
									value={form?.values?.email ?? ''}
									class="bg-scitech-navy focus:border-scitech-mint focus:ring-scitech-mint w-full rounded-xl border border-white/10 py-3 pr-4 pl-10 text-xs text-text-main placeholder-slate-500 transition-all focus:ring-1 focus:outline-none"
								/>
							</div>
						</div>

						<!-- Password -->
						<div class="space-y-1.5">
							<label for="password" class="text-xs font-medium text-slate-300">Kata Sandi</label>
							<div class="relative">
								<Lock class="absolute top-3.5 left-3.5 h-4 w-4 text-slate-500" />
								<input
									type="password"
									id="password"
									name="password"
									required
									placeholder="••••••••"
									class="bg-scitech-navy focus:border-scitech-mint focus:ring-scitech-mint w-full rounded-xl border border-white/10 py-3 pr-4 pl-10 text-xs text-text-main placeholder-slate-500 transition-all focus:ring-1 focus:outline-none"
								/>
							</div>
						</div>
					</div>
				</div>

				<!-- Pemilihan Peran (Role) -->
				<div class="space-y-4">
					<h3
						class="border-b border-white/10 pb-2 text-sm font-semibold tracking-wider text-slate-400 uppercase"
					>
						Hak Akses / Peran (Role)
					</h3>

					<input type="hidden" name="role" value={selectedRole} />

					<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
						{#each roleOptions as opt}
							{@const IconComponent = opt.icon}
							<button
								type="button"
								onclick={() => (selectedRole = opt.id)}
								class="relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200 {selectedRole ===
								opt.id
									? 'border-scitech-mint bg-scitech-navy/80 ring-scitech-mint shadow-lg ring-1'
									: 'bg-scitech-navy/40 hover:bg-scitech-navy/60 border-white/5 hover:border-white/20'}"
							>
								<div>
									<div class="mb-3 flex items-center justify-between">
										<div
											class="flex h-9 w-9 items-center justify-center rounded-xl border p-2 {opt.badgeBg}"
										>
											<IconComponent class="h-4 w-4" />
										</div>
										{#if selectedRole === opt.id}
											<div
												class="bg-scitech-mint text-scitech-navy flex h-5 w-5 items-center justify-center rounded-full"
											>
												<Check class="h-3 w-3 stroke-[3]" />
											</div>
										{/if}
									</div>
									<h4 class="text-xs font-bold text-text-main">{opt.label}</h4>
									<p class="mt-1 text-[11px] leading-relaxed text-slate-400">{opt.desc}</p>
								</div>
							</button>
						{/each}
					</div>
				</div>

				<!-- Status Akun -->
				<div class="space-y-4">
					<h3
						class="border-b border-white/10 pb-2 text-sm font-semibold tracking-wider text-slate-400 uppercase"
					>
						Status Keaktifan
					</h3>

					<input type="hidden" name="status" value={selectedStatus} />

					<div class="flex gap-4">
						<label
							class="flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all {selectedStatus ===
							'Active'
								? 'border-scitech-mint bg-scitech-navy/80 text-text-main'
								: 'bg-scitech-navy/30 border-white/5 text-slate-400'}"
						>
							<input
								type="radio"
								name="status_radio"
								value="Active"
								checked={selectedStatus === 'Active'}
								onChange={() => (selectedStatus = 'Active')}
								class="hidden"
							/>
							<div class="h-2.5 w-2.5 rounded-full bg-emerald-400"></div>
							<span class="text-xs font-semibold">Active (Aktif)</span>
						</label>

						<label
							class="flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all {selectedStatus ===
							'Inactive'
								? 'border-scitech-mint bg-scitech-navy/80 text-text-main'
								: 'bg-scitech-navy/30 border-white/5 text-slate-400'}"
						>
							<input
								type="radio"
								name="status_radio"
								value="Inactive"
								checked={selectedStatus === 'Inactive'}
								onChange={() => (selectedStatus = 'Inactive')}
								class="hidden"
							/>
							<div class="h-2.5 w-2.5 rounded-full bg-red-400"></div>
							<span class="text-xs font-semibold">Inactive (Non-Aktif)</span>
						</label>
					</div>
				</div>

				<!-- Action Submit -->
				<div class="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
					<button
						onclick={() => history.back()}
						class="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/5"
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint/90 flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold transition-all active:scale-95 disabled:opacity-60"
					>
						{#if isSubmitting}
							<div
								class="border-scitech-navy h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
							></div>
							<span>Menyimpan...</span>
						{:else}
							<UserPlus class="h-4 w-4" />
							<span>Simpan User Baru</span>
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
