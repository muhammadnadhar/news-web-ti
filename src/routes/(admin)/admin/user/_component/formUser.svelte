<script lang="ts">
	import { enhance } from '$app/forms';
	import Message from '$lib/components/admin/message.svelte';
	import type { UserAdminDTO } from '$lib/dto/admin/userAdmin';
	import type { MessageStatus, ResponseMessage } from '$lib/types/message';
	import type { UserFormValues } from '$lib/types/values/admin/user';
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
		valuesData?: UserFormValues | null;
		onCancel?: () => void;
	}

	let {
		initialData = null,
		formError = null,
		isEditMode = false,
		valuesData,
		submitLabel,
		onCancel
	}: Props = $props();

	// State reaktif
	let selectedRole = $state<UserAdminDTO['role']>(
		valuesData?.role ?? initialData?.role ?? 'Administrator'
	);
	let selectedStatus = $state<UserAdminDTO['status']>(
		valuesData?.role ?? initialData?.status ?? 'Active'
	);
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
    {#if formError}
        <div
            class="flex items-center gap-3 rounded-xl border border-status-error/30 bg-status-error/10 p-4 text-status-error"
        >
            <AlertCircle class="h-5 w-5 shrink-0" />
            <p class="text-xs font-medium">{formError}</p>
        </div>
    {/if}

    <div
        class="rounded-xl border border-border-color bg-bg-secondary p-6 shadow-sm md:p-8"
    >
        <form
            method="POST"
      use:enhance={() => {
                isSubmitting = true;
                showMessage = false;

                return async ({ result, update }) => {
                    isSubmitting = false;

                    // Pengecekan jika response sukses dari server
                    if (result.type === 'success') {
                        const data = result.data;
                        // Cek apakah status 'success' atau ada fallback flag success
                        if (!data || data.status === 'success' || data.success) {
                            triggerMessage(
                                'success',
                                (data?.title as string) || 'Berhasil',
                                (data?.message as string) || 'Data berhasil disimpan!'
                            );
                            await update({ reset: true });
                        } else {
                            // Antisipasi jika HTTP 200 tapi status di response payload berupa 'error'
                            triggerMessage(
                                'error',
                                (data?.title as string) || 'Gagal Menyimpan',
                                (data?.message as string) || 'Terjadi kesalahan.'
                            );
                            await update({ reset: false });
                        }
                    }
                    else if (result.type === 'failure' && result.data) {
                        const data = result.data;
                        triggerMessage(
                            'error',
                            (data.title as string) || 'Gagal Menyimpan',
                            (data.message as string) || 'Terjadi kesalahan saat memproses data.'
                        );
                        await update({ reset: false });
                    }
                    // Kesalahan koneksi / unhandled exception
                    else {
                        triggerMessage('error', 'Error', 'Terjadi kesalahan koneksi/sistem.');
                        await update({ reset: false });
                    }
                };
            }}
            class="space-y-8"
        >
            <div class="space-y-4">
                <h3
                    class="border-b border-border-color pb-2 text-xs font-semibold tracking-wider text-text-muted uppercase"
                >
                    Informasi Kredensial
                </h3>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div class="space-y-1.5">
                        <label for="name" class="text-xs font-medium text-text-main">Nama Lengkap</label>
                        <div class="relative">
                            <User class="absolute top-3.5 left-3.5 h-4 w-4 text-text-muted" />
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                placeholder="Contoh: Ahmad Subagja"
                                defaultValue={initialData?.name ?? ''}
                                class="w-full rounded-lg border border-border-light bg-bg-primary py-3 pr-4 pl-10 text-xs text-text-main transition-all focus:border-accent-primary focus:bg-bg-secondary focus:ring-2 focus:ring-accent-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <label for="username" class="text-xs font-medium text-text-main">Username</label>
                        <div class="relative">
                            <AtSign class="absolute top-3.5 left-3.5 h-4 w-4 text-text-muted" />
                            <input
                                type="text"
                                id="username"
                                name="username"
                                required
                                placeholder="ahmad_subagja"
                                defaultValue={initialData?.username ?? ''}
                                class="w-full rounded-lg border border-border-light bg-bg-primary py-3 pr-4 pl-10 text-xs text-text-main transition-all focus:border-accent-primary focus:bg-bg-secondary focus:ring-2 focus:ring-accent-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <label for="email" class="text-xs font-medium text-text-main">Email Utama</label>
                        <div class="relative">
                            <Mail class="absolute top-3.5 left-3.5 h-4 w-4 text-text-muted" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                placeholder="ahmad@uin.ac.id"
                                defaultValue={initialData?.email ?? ''}
                                class="w-full rounded-lg border border-border-light bg-bg-primary py-3 pr-4 pl-10 text-xs text-text-main transition-all focus:border-accent-primary focus:bg-bg-secondary focus:ring-2 focus:ring-accent-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <label for="password" class="text-xs font-medium text-text-main">
                            Kata Sandi {#if isEditMode}<span class="font-normal text-text-muted">(Opsional)</span>{/if}
                        </label>
                        <div class="relative">
                            <Lock class="absolute top-3.5 left-3.5 h-4 w-4 text-text-muted" />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required={!isEditMode}
                                placeholder={isEditMode ? 'Kosongkan jika tidak diubah' : '••••••••'}
                                class="w-full rounded-lg border border-border-light bg-bg-primary py-3 pr-4 pl-10 text-xs text-text-main transition-all focus:border-accent-primary focus:bg-bg-secondary focus:ring-2 focus:ring-accent-primary focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-y-4">
                <h3
                    class="border-b border-border-color pb-2 text-xs font-semibold tracking-wider text-text-muted uppercase"
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
                            class="relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 {selectedRole === opt.id
                                ? 'border-accent-primary bg-bg-primary shadow-sm ring-1 ring-accent-primary'
                                : 'border-border-light bg-bg-primary/50 hover:bg-bg-primary-glare'}"
                        >
                            <div>
                                <div class="mb-3 flex items-center justify-between">
                                    <div
                                        class="flex h-9 w-9 items-center justify-center rounded-lg border border-border-light p-2 {opt.badgeBg}"
                                    >
                                        <IconComponent class="h-4 w-4" />
                                    </div>
                                    {#if selectedRole === opt.id}
                                        <div
                                            class="flex h-5 w-5 items-center justify-center rounded-full bg-accent-primary text-text-dark"
                                        >
                                            <Check class="h-3 w-3 stroke-[3]" />
                                        </div>
                                    {/if}
                                </div>
                                <h4 class="text-xs font-bold text-text-main">{opt.label}</h4>
                                <p class="mt-1 text-xs leading-relaxed text-text-muted">{opt.desc}</p>
                            </div>
                        </button>
                    {/each}
                </div>
            </div>

            <div class="space-y-4">
                <h3
                    class="border-b border-border-color pb-2 text-xs font-semibold tracking-wider text-text-muted uppercase"
                >
                    Status Keaktifan
                </h3>

                <input type="hidden" name="status" value={selectedStatus} />

                <div class="flex gap-4">
                    <label
                        class="flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all {selectedStatus === 'Active'
                            ? 'border-accent-primary bg-bg-primary text-text-main shadow-sm'
                            : 'border-border-light bg-bg-primary/50 text-text-muted'}"
                    >
                        <input
                            type="radio"
                            name="status_radio"
                            value="Active"
                            checked={selectedStatus === 'Active'}
                            onchange={() => (selectedStatus = 'Active')}
                            class="hidden"
                        />
                        <div class="h-2.5 w-2.5 rounded-full bg-status-success"></div>
                        <span class="text-xs font-semibold">Active (Aktif)</span>
                    </label>

                    <label
                        class="flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all {selectedStatus === 'Inactive'
                            ? 'border-accent-primary bg-bg-primary text-text-main shadow-sm'
                            : 'border-border-light bg-bg-primary/50 text-text-muted'}"
                    >
                        <input
                            type="radio"
                            name="status_radio"
                            value="Inactive"
                            checked={selectedStatus === 'Inactive'}
                            onchange={() => (selectedStatus = 'Inactive')}
                            class="hidden"
                        />
                        <div class="h-2.5 w-2.5 rounded-full bg-status-error"></div>
                        <span class="text-xs font-semibold">Inactive (Non-Aktif)</span>
                    </label>
                </div>
            </div>

            <!-- TOMBOL ACTION -->
            <div class="flex items-center justify-end gap-3 border-t border-border-color pt-6">
                {#if onCancel}
                    <button
                        type="button"
                        onclick={onCancel}
                        class="rounded-lg border border-border-light bg-bg-primary px-5 py-2.5 text-xs font-semibold text-text-main transition-all hover:bg-bg-primary-glare"
                    >
                        Batal
                    </button>
                {/if}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    class="inline-flex items-center gap-2 rounded-lg bg-accent-primary px-6 py-2.5 text-xs font-bold text-text-dark shadow-sm transition-all hover:bg-accent-primary-hover active:scale-95 disabled:opacity-60"
                >
                    {#if isSubmitting}
                        <div
                            class="h-4 w-4 animate-spin rounded-full border-2 border-text-dark border-t-transparent"
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
