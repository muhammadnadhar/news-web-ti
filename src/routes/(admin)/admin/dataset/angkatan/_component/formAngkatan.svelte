<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Message from '$lib/components/admin/message.svelte';
	import type { ResponseMessage } from '$lib/types/message';
	import { ArrowLeft, Save, Loader2Icon, Calendar } from 'lucide-svelte';

	let {
		title = 'Tambah Angkatan Baru',
		actionUrl = '',
		form = null,
		initialData = null, // Prop baru untuk menampung data lama
		onSuccess,
		onError
	}: {
		title?: string;
		actionUrl?: string;
		form?: any;
		initialData?: { id?: string; year?: number | string } | null;
		onSuccess?: (res: ResponseMessage) => void;
		onError?: (res: ResponseMessage) => void;
	} = $props();

	const currentYear = new Date().getFullYear();
	let isSubmitting = $state(false);
	let showMessage = $state(false);
	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	function triggerMessage(status: ResponseMessage['status'], title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}
</script>

<div class="mx-auto max-w-3xl space-y-6">
	<!-- Header & Navigation Bar -->
	<div class="flex items-center justify-between border-b border-white/10 pb-4">
		<div class="flex items-center gap-3">
					<div>
				<h1 class="text-scitech-mint text-lg font-bold tracking-wide sm:text-xl">{title}</h1>
				<p class="text-xs text-text-muted">
					Isi formulir di bawah ini untuk mengelola data angkatan.
				</p>
			</div>
		</div>
	</div>

	<!-- Alert Message Component -->
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

	<div
		class="bg-scitech-slate/50 rounded-2xl border border-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
	>
		<form
			method="POST"
			action={actionUrl}
			use:enhance={() => {
				isSubmitting = true;
				showMessage = false;

				return async ({ result, update }) => {
					isSubmitting = false;

					if (result.type === 'success') {
						const resData = (result.data as ResponseMessage) ?? {
							status: 'success',
							title: 'Berhasil',
							message: 'Data angkatan berhasil disimpan.'
						};
						triggerMessage(resData.status, resData.title, resData.message);
						onSuccess?.(resData);
						await update({ reset: true });
					} else if (result.type === 'failure') {
						const resData = (result.data as ResponseMessage) ?? {
							status: 'error',
							title: 'Gagal',
							message: 'Gagal menyimpan data angkatan.'
						};
						triggerMessage(resData.status, resData.title, resData.message);
						onError?.(resData);
						await update();
					} else {
						const resData: ResponseMessage = {
							status: 'error',
							title: 'Kesalahan Sistem',
							message: 'Terjadi kesalahan sistem yang tidak diketahui.'
						};
						triggerMessage(resData.status, resData.title, resData.message);
						onError?.(resData);
						await update();
					}
				};
			}}
			class="space-y-6"
		>
			<div class="space-y-2">
				<label for="year" class="flex items-center gap-2 text-xs font-semibold text-text-main">
					<Calendar class="text-scitech-cyan h-4 w-4" />
					<span>Tahun Angkatan</span>
					<span class="text-red-400">*</span>
				</label>

				<div class="relative">
					<input
						type="number"
						id="year"
						name="year"
						value={form?.values?.year ?? initialData?.year ?? ''}
						placeholder={`Contoh: ${currentYear}`}
						min="1990"
						max={currentYear + 10}
						step="1"
						required
						disabled={isSubmitting}
						class="bg-scitech-navy focus:border-scitech-mint focus:ring-scitech-mint/20 w-full rounded-xl border border-white/10 px-4 py-3 text-xs text-text-main placeholder-text-muted transition-all focus:ring-2 focus:outline-none disabled:opacity-50"
					/>
				</div>

				<p class="text-[11px] text-text-muted">
					Masukkan 4 digit angka tahun angkatan mahasiswa (contoh: {currentYear}).
				</p>
			</div>

			<!-- Form Action Buttons -->
			<div class="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
				<button
					type="button"
					onclick={() => history.back()}
					disabled={isSubmitting}
					class="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-text-muted transition-all hover:bg-white/10 hover:text-white active:scale-95 disabled:opacity-50"
				>
					Batal
				</button>

				<button
					type="submit"
					disabled={isSubmitting}
					class="bg-scitech-mint text-scitech-navy shadow-scitech-mint/10 hover:bg-scitech-mint-hover inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
				>
					{#if isSubmitting}
						<Loader2Icon class="h-4 w-4 animate-spin" />
						<span>Menyimpan...</span>
					{:else}
						<Save class="h-4 w-4" />
						<span>Simpan Data Angkatan</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
