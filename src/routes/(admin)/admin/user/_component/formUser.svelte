<script lang="ts">
	import { enhance } from '$app/forms';
	import Message from '$lib/components/admin/message.svelte';
	import type { UserAdminDTO } from '$lib/dto/admin/userAdmin';
	import type { MessageStatus, ResponseMessage } from '$lib/types/message';
	import {
		AlertCircle,
		AtSign,
		Check,
		Lock,
		Mail,
		Save,
		ShieldCheck,
		User,
		UserCog,
		UserPlus
	} from 'lucide-svelte';

	interface Props {
		initialData?: Partial<UserAdminDTO> | null;
		formError?: string | null;
		isEditMode?: boolean;
		submitLabel?: string;
		onCancel?: () => void;
	}

	let {
		initialData = null,
		formError = null,
		isEditMode = false,
		submitLabel,
		onCancel
	}: Props = $props();

	// State reaktif
	let selectedRole = $state<UserAdminDTO['role']>(initialData?.role ?? 'Administrator');
	let selectedStatus = $state<UserAdminDTO['status']>(initialData?.status ?? 'Active');
	let isSubmitting = $state(false);

	// Pilihan Role
	const roleOptions: {
		id: UserAdminDTO['role'];
		label: string;
		desc: string;
		icon: any;
		badgeBg: string;
	}[] = [
		{
			id: 'Administrator',
			label: 'Administrator',
			desc: 'Memiliki akses untuk membuat, mengedit, dan mengelola draf berita/konten.',
			icon: ShieldCheck,
			badgeBg: 'bg-scitech-mint/10 text-scitech-mint border-scitech-mint/30'
		},
		{
			id: 'Supervisor',
			label: 'Supervisor',
			desc: 'Akses pengawasan dan verifikasi konten.',
			icon: UserCog,
			badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
		}
	];

	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});
	let showMessage = $state(false);

	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}
</script>

{#if showMessage}
	<div class="mb-6">
		<Message
			status={messageConfig.status}
			title={messageConfig.title}
			message={messageConfig.message}
			dismissible={true}
			timeout={5000}
			onclose={() => (showMessage = false)}
		/>
	</div>
{/if}

<div class="space-y-6">
	<!-- Pesan Error -->
	{#if formError}
		<div
			class="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-400"
		>
			<AlertCircle class="h-5 w-5 shrink-0" />
			<p class="text-xs font-medium">{formError}</p>
		</div>
	{/if}

	<div
		class="border-scitech-slate/20 bg-scitech-navy-glare rounded-3xl border p-6 shadow-2xl md:p-8"
	>
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
			<!-- KREDENSIAL UTAMA -->
			<div class="space-y-4">
				<h3
					class="border-scitech-slate/20 border-b pb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase"
				>
					Informasi Kredensial
				</h3>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div class="space-y-1.5">
						<label for="name" class="text-xs font-medium text-text-main">Nama Lengkap</label>
						<div class="relative">
							<User class="absolute top-3.5 left-3.5 h-4 w-4 text-slate-500" />
							<input
								type="text"
								id="name"
								name="name"
								required
								placeholder="Contoh: Ahmad Subagja"
								defaultValue={initialData?.name ?? ''}
								class="border-scitech-slate/30 bg-scitech-navy focus:border-scitech-mint w-full rounded-xl border py-3 pr-4 pl-10 text-xs text-text-main placeholder-slate-500 transition-all focus:outline-none"
							/>
						</div>
					</div>

					<!-- Username -->
					<div class="space-y-1.5">
						<label for="username" class="text-xs font-medium text-text-main">Username</label>
						<div class="relative">
							<AtSign class="absolute top-3.5 left-3.5 h-4 w-4 text-slate-500" />
							<input
								type="text"
								id="username"
								name="username"
								required
								placeholder="ahmad_subagja"
								defaultValue={initialData?.username ?? ''}
								class="border-scitech-slate/30 bg-scitech-navy focus:border-scitech-mint w-full rounded-xl border py-3 pr-4 pl-10 text-xs text-text-main placeholder-slate-500 transition-all focus:outline-none"
							/>
						</div>
					</div>

					<!-- Email -->
					<div class="space-y-1.5">
						<label for="email" class="text-xs font-medium text-text-main">Email Utama</label>
						<div class="relative">
							<Mail class="absolute top-3.5 left-3.5 h-4 w-4 text-slate-500" />
							<input
								type="email"
								id="email"
								name="email"
								required
								placeholder="ahmad@uin.ac.id"
								defaultValue={initialData?.email ?? ''}
								class="border-scitech-slate/30 bg-scitech-navy focus:border-scitech-mint w-full rounded-xl border py-3 pr-4 pl-10 text-xs text-text-main placeholder-slate-500 transition-all focus:outline-none"
							/>
						</div>
					</div>

					<div class="space-y-1.5">
						<label for="password" class="text-xs font-medium text-text-main">
							Kata Sandi {#if isEditMode}<span class="font-normal text-slate-400">(Opsional)</span
								>{/if}
						</label>
						<div class="relative">
							<Lock class="absolute top-3.5 left-3.5 h-4 w-4 text-slate-500" />
							<input
								type="password"
								id="password"
								name="password"
								required={!isEditMode}
								placeholder={isEditMode ? 'Kosongkan jika tidak diubah' : '••••••••'}
								class="border-scitech-slate/30 bg-scitech-navy focus:border-scitech-mint w-full rounded-xl border py-3 pr-4 pl-10 text-xs text-text-main placeholder-slate-500 transition-all focus:outline-none"
							/>
						</div>
					</div>
				</div>
			</div>

			<!-- PERAN / ROLE -->
			<div class="space-y-4">
				<h3
					class="border-scitech-slate/20 border-b pb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase"
				>
					Hak Akses / Peran (Role)
				</h3>

				<input type="hidden" name="role" value={selectedRole} />

				<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
					{#each roleOptions as opt}
						{@const IconComponent = opt.icon}
						<button
							type="button"
							onclick={() => (selectedRole = opt.id)}
							class="relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200 {selectedRole ===
							opt.id
								? 'border-scitech-mint bg-scitech-navy/80 ring-scitech-mint shadow-lg ring-1'
								: 'border-scitech-slate/20 bg-scitech-navy/40 hover:border-scitech-slate/40 hover:bg-scitech-navy/60'}"
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
								<p class="mt-1 text-xs leading-relaxed text-slate-400">{opt.desc}</p>
							</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- STATUS AKUN -->
			<div class="space-y-4">
				<h3
					class="border-scitech-slate/20 border-b pb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase"
				>
					Status Keaktifan
				</h3>

				<input type="hidden" name="status" value={selectedStatus} />

				<div class="flex gap-4">
					<label
						class="flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all {selectedStatus ===
						'Active'
							? 'border-scitech-mint bg-scitech-navy/80 text-text-main'
							: 'border-scitech-slate/20 bg-scitech-navy/30 text-slate-400'}"
					>
						<input
							type="radio"
							name="status_radio"
							value="Active"
							checked={selectedStatus === 'Active'}
							onchange={() => (selectedStatus = 'Active')}
							class="hidden"
						/>
						<div class="h-2.5 w-2.5 rounded-full bg-emerald-400"></div>
						<span class="text-xs font-semibold">Active (Aktif)</span>
					</label>

					<label
						class="flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all {selectedStatus ===
						'Inactive'
							? 'border-scitech-mint bg-scitech-navy/80 text-text-main'
							: 'border-scitech-slate/20 bg-scitech-navy/30 text-slate-400'}"
					>
						<input
							type="radio"
							name="status_radio"
							value="Inactive"
							checked={selectedStatus === 'Inactive'}
							onchange={() => (selectedStatus = 'Inactive')}
							class="hidden"
						/>
						<div class="h-2.5 w-2.5 rounded-full bg-red-400"></div>
						<span class="text-xs font-semibold">Inactive (Non-Aktif)</span>
					</label>
				</div>
			</div>

			<!-- TOMBOL ACTION -->
			<div class="border-scitech-slate/20 flex items-center justify-end gap-3 border-t pt-6">
				{#if onCancel}
					<button
						type="button"
						onclick={onCancel}
						class="border-scitech-slate/30 hover:bg-scitech-slate/20 rounded-xl border px-5 py-2.5 text-xs font-semibold text-slate-300 transition-colors"
					>
						Batal
					</button>
				{/if}

				<button
					type="submit"
					disabled={isSubmitting}
					class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold transition-all active:scale-95 disabled:opacity-60"
				>
					{#if isSubmitting}
						<div
							class="border-scitech-navy h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
						></div>
						<span>Menyimpan...</span>
					{:else if isEditMode}
						<Save class="h-4 w-4" />
						<span>{submitLabel ?? 'Simpan Perubahan'}</span>
					{:else}
						<UserPlus class="h-4 w-4" />
						<span>{submitLabel ?? 'Simpan User Baru'}</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
