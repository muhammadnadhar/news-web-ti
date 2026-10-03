<script lang="ts">
	import { enhance } from '$app/forms';
	import { Save, AlertCircle } from 'lucide-svelte';
	import type { MessageStatus } from '$lib/components/admin/message.svelte';
	import Message from '$lib/components/admin/message.svelte';
	import type { PerminatanTIItemDTO } from '$lib/dto/admin/home';
	import type { PeminatanFormValues } from '$lib/types/values/admin/home';

	interface Props {
		isEdit?: boolean;
		initialData?: PerminatanTIItemDTO | null;
		action?: string;
		valuesData?: PeminatanFormValues;
	}

	let { isEdit = false, initialData, action = '?/create', valuesData }: Props = $props();

	// Local states
	let title = $state(valuesData?.title ?? initialData?.title ?? '');
	let description = $state(valuesData?.description ?? initialData?.description ?? '');
	let isSubmitting = $state(false);
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
<div class="mx-auto max-w-3xl space-y-6">
	<div class="flex items-center gap-4">
		<div>
			<h1 class="text-pure-white text-xl font-bold md:text-2xl">
				{isEdit ? 'Edit Peminatan' : 'Tambah Peminatan Baru'}
			</h1>
			<p class="text-sm text-text-muted">
				{isEdit
					? 'Perbarui informasi fokus / konsentrasi keahlian Teknik Informatika.'
					: 'Tambahkan fokus / konsentrasi keahlian untuk Teknik Informatika.'}
			</p>
		</div>
	</div>

	<form
		method="POST"
		{action}
		use:enhance={() => {
			isSubmitting = true;
			showMessage = false;

			return async ({ result, update }) => {
				isSubmitting = false;

				if (result.type === 'success') {
					triggerMessage(
						'success',
						(result?.data?.title as string) || 'Berhasil',
						result?.data?.message as string
					);
					if (!isEdit) {
						await update({ reset: true });
						title = '';
						description = '';
					} else {
						await update({ reset: false });
					}
				} else if (result.type === 'failure' && result.data) {
					triggerMessage(
						'error',
						(result.data.title as string) || 'Gagal Menyimpan',
						result.data.message as string
					);
					await update();
				} else {
					triggerMessage('error', 'Error', 'Terjadi kesalahan sistem saat memproses data.');
					await update();
				}
			};
		}}
		class="space-y-6 rounded-2xl border border-white/10 bg-bg-secondary p-6 backdrop-blur-md md:p-8"
	>
		<div class="space-y-2">
			<label for="title" class="text-pure-white block text-sm font-semibold">
				Judul Peminatan <span style="color: var(--accent-yellow);">*</span>
			</label>
			<input
				type="text"
				id="title"
				name="title"
				bind:value={title}
				maxlength="150"
				required
				placeholder="Contoh: Kecerdasan Buatan (AI) & Data Science"
				class="w-full rounded-xl border border-white/10 bg-bg-primary/60 px-4 py-3 text-sm text-text-main placeholder-text-muted/50 transition-all outline-none focus:border-[var(--accent-yellow)] focus:ring-2 focus:ring-[var(--accent-yellow)]/20"
			/>
			<div class="flex justify-between text-xs text-text-muted">
				<span>Maksimal 150 karakter</span>
				<span>{title.length}/150</span>
			</div>
		</div>

		<!-- Input Deskripsi -->
		<div class="space-y-2">
			<label for="description" class="text-pure-white block text-sm font-semibold">
				Deskripsi Lengkap <span style="color: var(--accent-yellow);">*</span>
			</label>
			<textarea
				id="description"
				name="description"
				bind:value={description}
				rows="5"
				required
				placeholder="Jelaskan cakupan topik, mata kuliah fokus, atau prospek karir..."
				class="w-full rounded-xl border border-white/10 bg-bg-primary/60 px-4 py-3 text-sm text-text-main placeholder-text-muted/50 transition-all outline-none focus:border-[var(--accent-yellow)] focus:ring-2 focus:ring-[var(--accent-yellow)]/20"
			></textarea>
		</div>

		<!-- Tombol Aksi -->
		<div class="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
			<button
				type="button"
				onclick={() => history.back()}
				class="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-text-muted transition-all hover:bg-bg-secondary/5 hover:text-text-main"
			>
				Batal
			</button>

			<button
				type="submit"
				disabled={isSubmitting}
				style="background-color: var(--accent-yellow);"
				class="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-accent-yellow/20 transition-all hover:scale-[1.02] hover:bg-accent-yellow-hover active:scale-[0.98] disabled:opacity-50"
			>
				{#if isSubmitting}
					<span
						class="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent"
					></span>
					<span>Menyimpan...</span>
				{:else}
					<Save class="h-4 w-4" />
					<span>{isEdit ? 'Simpan Perubahan' : 'Simpan Peminatan'}</span>
				{/if}
			</button>
		</div>
	</form>
</div>
