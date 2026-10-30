<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import {
		AlertTriangle,
		AlertCircle,
		CheckCircle2,
		Info,
		X,
		Trash2,
		Loader2,
		ArrowRight
	} from 'lucide-svelte';

	// Definisi Props menggunakan Svelte 5 Runes ($props)
	let {
		isOpen = false, // Status buka/tutup modal
		title = 'Konfirmasi', // Judul modal
		subtitle = 'Silakan verifikasi tindakan Anda', // Subtitle modal
		message = '', // Pesan teks / deskripsi biasa (untuk mode alert)

		itemToDelete = null, // Objek data yang mau dihapus (jika ada)
		nameItemToDelete = null, // name pada item yang akan di kirim ke server

		itemTitle = '', // Nama/Judul target data yang dihapus
		deleteAction = '', // URL / Action endpoint untuk hapus data
		isDeleteAction = false, // Flag penentu apakah ini aksi delete form atau link redirect/alert biasa
		confirmLink = '', // URL tujuan jika modal berfungsi sebagai tombol konfirmasi link biasa
		variant = 'error', // Jenis warna: 'error' | 'warning' | 'success' | 'info' | 'primary'
		confirmText = 'Konfirmasi', // Label tombol konfirmasi
		cancelText = 'Batal', // Label tombol batal
		onClose, // Callback saat modal ditutup
		onSuccess, // Callback sukses aksi
		onError // Callback error aksi
	}: {
		isOpen: boolean;
		title?: string;
		subtitle?: string;
		message?: string;

		itemToDelete?: any | null;
		nameItemToDelete?: string | null;

		itemTitle?: string;
		deleteAction?: string;
		isDeleteAction?: boolean;
		confirmLink?: string;
		variant?: 'error' | 'warning' | 'success' | 'info' | 'primary';
		confirmText?: string;
		cancelText?: string;
		onClose?: () => void;
		onSuccess?: (res?: any) => void;
		onError?: (res?: any) => void;
	} = $props();

	let isSubmitting = $state(false);

	// Pemetaan warna berdasarkan props 'variant' yang terhubung ke tema CSS Tailwind v4 Anda
	const variantStyles = $derived(() => {
		switch (variant) {
			case 'warning':
				return {
					borderGlow: 'bg-accent-yellow/10',
					badgeBorder: 'border-accent-yellow/20',
					badgeBg: 'bg-accent-yellow/10',
					badgeText: 'text-accent-yellow',
					icon: AlertTriangle,
					btnBg:
						'bg-accent-yellow text-text-dark hover:bg-accent-yellow-hover shadow-accent-yellow/20'
				};
			case 'success':
				return {
					borderGlow: 'bg-status-success/10',
					badgeBorder: 'border-status-success/20',
					badgeBg: 'bg-status-success/10',
					badgeText: 'text-status-success',
					icon: CheckCircle2,
					btnBg: 'bg-status-success text-text-main hover:opacity-90 shadow-status-success/20'
				};
			case 'info':
				return {
					borderGlow: 'bg-accent-cyan/10',
					badgeBorder: 'border-accent-cyan/20',
					badgeBg: 'bg-accent-cyan/10',
					badgeText: 'text-accent-cyan',
					icon: Info,
					btnBg: 'bg-accent-cyan text-text-dark hover:opacity-90 shadow-accent-cyan/20'
				};
			case 'primary':
				return {
					borderGlow: 'bg-accent-primary/10',
					badgeBorder: 'border-accent-primary/20',
					badgeBg: 'bg-accent-primary/10',
					badgeText: 'text-accent-primary',
					icon: AlertCircle,
					btnBg:
						'bg-accent-primary text-text-dark hover:bg-accent-primary-hover shadow-accent-primary/20'
				};
			case 'error':
			default:
				return {
					borderGlow: 'bg-status-error/10',
					badgeBorder: 'border-status-error/20',
					badgeBg: 'bg-status-error/10',
					badgeText: 'text-status-error',
					icon: AlertTriangle,
					btnBg: 'bg-status-error text-text-main hover:opacity-90 shadow-status-error/20'
				};
		}
	});

	const currentStyle = $derived(variantStyles());
	const IconComponent = $derived(currentStyle.icon);

	function handleClose() {
		if (isSubmitting) return;
		isOpen = false;
		onClose?.();
	}

	function handleConfirmLink() {
		if (confirmLink) {
			window.location.href = confirmLink;
		}
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md transition-opacity"
	>
		<div
			class="relative w-full max-w-md overflow-hidden rounded-3xl border border-border-light bg-bg-secondary p-6 text-text-main shadow-2xl transition-all sm:p-7"
		>
			<div
				class="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full {currentStyle.borderGlow} blur-2xl"
			></div>

			<div class="flex items-start justify-between gap-4">
				<div class="flex items-center gap-3.5">
					<div
						class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border {currentStyle.badgeBorder} {currentStyle.badgeBg} {currentStyle.badgeText} shadow-sm"
					>
						<IconComponent class="h-5 w-5" />
					</div>
					<div>
						<h3 class="text-base font-bold text-text-main sm:text-lg">{title}</h3>
						<p class="text-xs text-text-muted">{subtitle}</p>
					</div>
				</div>

				<button
					type="button"
					onclick={handleClose}
					disabled={isSubmitting}
					class="flex h-8 w-8 items-center justify-center rounded-full border border-border-color bg-bg-primary text-text-muted transition-colors hover:bg-bg-secondary-hover hover:text-text-main disabled:opacity-50"
					aria-label="Tutup modal"
				>
					<X class="h-4 w-4" />
				</button>
			</div>

			<!-- KONDISI 1: JIKA MODAL BERFUNGSI SEBAGAI DELETE ACTION (SVELTEKIT FORM ENHANCE) -->
			{#if isDeleteAction}
				<form
					method="POST"
					action={deleteAction}
					use:enhance={() => {
						isSubmitting = true;
						return async ({ result }) => {
							if (result.type === 'success') {
								await invalidateAll();
								isSubmitting = false;
								onSuccess?.(result.data);
								handleClose();
							} else if (result.type === 'failure') {
								isSubmitting = false;
								onError?.(result.data);
								handleClose();
							} else {
								isSubmitting = false;
								onError?.({
									status: 'error',
									title: 'Kesalahan Sistem',
									message: 'Terjadi kesalahan sistem.'
								});
								handleClose();
							}
						};
					}}
					class="mt-5 space-y-5"
				>
					{#if itemToDelete && nameItemToDelete}
						<input type="hidden" name={nameItemToDelete} value={itemToDelete} />
					{/if}

					<div class="space-y-3">
						<p class="text-xs leading-relaxed text-text-muted sm:text-sm">
							{message || 'Apakah Anda yakin ingin menghapus data berikut?'}
						</p>

						{#if itemTitle}
							<div class="rounded-2xl border border-border-color bg-bg-primary p-3.5">
								<span
									class="block text-[10px] font-semibold tracking-wider text-text-muted uppercase"
								>
									Target Data
								</span>
								<span class="text-sm font-semibold break-all text-text-main">{itemTitle}</span>
							</div>
						{/if}

						<div
							class="flex items-start gap-2.5 rounded-xl border {currentStyle.badgeBorder} {currentStyle.badgeBg} p-3 text-xs leading-relaxed {currentStyle.badgeText}"
						>
							<AlertTriangle class="mt-0.5 h-4 w-4 shrink-0" />
							<span>Tindakan ini permanen dan tidak dapat dibatalkan.</span>
						</div>
					</div>

					<div class="flex items-center justify-end gap-3 border-border-color pt-4">
						<button
							type="button"
							onclick={handleClose}
							disabled={isSubmitting}
							class="rounded-xl border border-border-color bg-bg-primary px-4 py-2.5 text-xs font-semibold text-text-muted transition-all hover:bg-bg-secondary-hover hover:text-text-main active:scale-95 disabled:opacity-50"
						>
							{cancelText}
						</button>

						<button
							type="submit"
							disabled={isSubmitting}
							class="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-lg transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 {currentStyle.btnBg}"
						>
							{#if isSubmitting}
								<Loader2 class="h-4 w-4 animate-spin" />
								<span>Memproses...</span>
							{:else}
								<Trash2 class="h-4 w-4" />
								<span>{confirmText}</span>
							{/if}
						</button>
					</div>
				</form>

				<!-- KONDISI 2: JIKA MODAL BERFUNGSI SEBAGAI LINK REDIRECT / AKSI NAVIGASI -->
			{:else if confirmLink}
				<div class="mt-5 space-y-5">
					<p class="text-xs leading-relaxed text-text-muted sm:text-sm">
						{message}
					</p>

					<div class="flex items-center justify-end gap-3 pt-4">
						<button
							type="button"
							onclick={handleClose}
							class="rounded-xl border border-border-color bg-bg-primary px-4 py-2.5 text-xs font-semibold text-text-muted transition-all hover:bg-bg-secondary-hover hover:text-text-main active:scale-95"
						>
							{cancelText}
						</button>

						<button
							type="button"
							onclick={handleConfirmLink}
							class="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-lg transition-all active:scale-95 {currentStyle.btnBg}"
						>
							<span>{confirmText}</span>
							<ArrowRight class="h-4 w-4" />
						</button>
					</div>
				</div>

				<!-- KONDISI 3: JIKA MODAL ALERT STANDAR (OK / BATAL) -->
			{:else}
				<div class="mt-5 space-y-5">
					<p class="text-xs leading-relaxed text-text-muted sm:text-sm">
						{message}
					</p>

					<div class="flex items-center justify-end gap-3 pt-4">
						<button
							type="button"
							onclick={handleClose}
							class="rounded-xl border border-border-color bg-bg-primary px-4 py-2.5 text-xs font-semibold text-text-muted transition-all hover:bg-bg-secondary-hover hover:text-text-main active:scale-95"
						>
							{cancelText}
						</button>

						<button
							type="button"
							onclick={() => {
								onSuccess?.();
								handleClose();
							}}
							class="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-lg transition-all active:scale-95 {currentStyle.btnBg}"
						>
							<span>{confirmText}</span>
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<!-- contoh pengunaaan  -->
<!-- <script lang="ts"> -->
<!--     import Modal from '$lib/components/Modal.svelte'; -->
<!---->
<!--     let isDeleteOpen = $state(false); -->
<!--     let targetItem = $state<any>(null); -->
<!---->
<!--     // Contoh buka modal hapus dengan tema 'error' -->
<!--     function openDeleteModal(item: any) { -->
<!--         targetItem = item; -->
<!--         isDeleteOpen = true; -->
<!--     } -->
<!-- </script> -->
<!---->
<!-- <!-- Contoh Pemanggilan untuk Hapus Data (Delete Action) -->
<!-- <Modal -->
<!--     bind:isOpen={isDeleteOpen} -->
<!--     title="Konfirmasi Hapus" -->
<!--     subtitle="Tindakan ini memerlukan verifikasi Anda" -->
<!--     itemToDelete={targetItem} -->
<!--     itemTitle={targetItem?.title} -->
<!--     deleteAction="?/deleteActionName" -->
<!--     isDeleteAction={true} -->
<!--     variant="error" -->
<!--     confirmText="Hapus Data" -->
<!-- /> -->
