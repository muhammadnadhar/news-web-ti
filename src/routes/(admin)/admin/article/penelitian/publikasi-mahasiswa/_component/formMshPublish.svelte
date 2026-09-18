<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Message from '$lib/components/admin/message.svelte';
	import { removeLastPath } from '$lib/utils';
	import type { ResponseMessage } from '$lib/types/message';
	import { ArrowLeft, GraduationCap, User, BookOpen, Save, Loader2Icon } from 'lucide-svelte';
	import type { StudentPublicationDTO } from '$lib/types/admin/article/penelitian';
	import FormEditor from '$lib/components/admin/formEditor.svelte';

	let {
		form,
		initialData = null,
		isEdit = false
	}: {
		form: any;
		initialData?: StudentPublicationDTO | null;
		isEdit?: boolean;
	} = $props();

	let isSubmitting = $state(false);
	let showMessage = $state(false);
	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	// State listener for FormEditor (HTML/LONGTEXT string)
	let journalListContent = $state(form?.values?.journal_list ?? initialData?.journal_list ?? '');

	function triggerMessage(status: ResponseMessage['status'], title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}
</script>

<div class="mx-auto max-w-3xl space-y-6">
	<!-- Header Navigation -->
	<div class="flex items-center justify-between border-b border-white/10 pb-4">
		<div class="flex items-center gap-3">
			<button
				type="button"
				onclick={() => goto(removeLastPath())}
				class="rounded-xl border border-white/10 p-2.5 text-text-muted transition-all hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95"
				title="Kembali"
			>
				<ArrowLeft class="h-5 w-5" />
			</button>
			<div>
				<div class="flex items-center gap-2">
					<GraduationCap class="text-scitech-mint h-5 w-5" />
					<h1 class="text-scitech-mint text-lg font-bold tracking-wide sm:text-xl">
						{isEdit ? 'Edit Publikasi Mahasiswa' : 'Tambah Publikasi Mahasiswa'}
					</h1>
				</div>
				<p class="text-xs text-text-muted">
					{isEdit
						? 'Perbarui profil mahasiswa dan daftar jurnal publikasinya.'
						: 'Isi nama mahasiswa beserta daftar publikasi jurnal terkait.'}
				</p>
			</div>
		</div>
	</div>

	<!-- Alert / Toast Notification -->
	{#if showMessage || form?.message}
		<Message
			status={showMessage ? messageConfig.status : 'error'}
			title={showMessage ? messageConfig.title : 'Gagal'}
			message={showMessage ? messageConfig.message : form?.message || ''}
			dismissible={true}
			timeout={4000}
			onclose={() => (showMessage = false)}
		/>
	{/if}

	<!-- Glassmorphism Form Card -->
	<div
		class="bg-scitech-slate/50 rounded-2xl border border-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
	>
		<form
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				showMessage = false;

				return async ({ result, update }) => {
					isSubmitting = false;

					if (result.type === 'success') {
						const resData = (result.data as ResponseMessage) ?? {
							status: 'success',
							title: 'Berhasil',
							message: isEdit
								? 'Data publikasi mahasiswa berhasil diperbarui.'
								: 'Data publikasi mahasiswa berhasil disimpan.'
						};
						triggerMessage(resData.status, resData.title, resData.message);
						if (!isEdit) journalListContent = '';
						await update({ reset: !isEdit });
					} else if (result.type === 'failure') {
						const resData = (result.data as ResponseMessage) ?? {
							status: 'error',
							title: 'Gagal',
							message: (result.data?.message as string) || 'Gagal memproses data.'
						};
						triggerMessage(resData.status, resData.title, resData.message);
						await update();
					} else {
						triggerMessage('error', 'Error', 'Terjadi kesalahan sistem yang tidak diketahui.');
						await update();
					}
				};
			}}
			class="space-y-6"
		>
			<!-- Hidden input to guarantee HTML content payload in standard formData -->
			<textarea name="journal_list" class="hidden" bind:value={journalListContent}></textarea>

			<!-- Field 1: Nama Mahasiswa -->
			<div class="space-y-2">
				<label
					for="student_name"
					class="flex items-center gap-2 text-xs font-semibold text-text-main"
				>
					<User class="text-scitech-cyan h-4 w-4" />
					<span>Nama Lengkap Mahasiswa</span>
					<span class="text-red-400">*</span>
				</label>

				<input
					type="text"
					id="student_name"
					name="student_name"
					value={form?.values?.student_name ?? initialData?.student_name ?? ''}
					placeholder="Contoh: Aulia Sabri"
					required
					disabled={isSubmitting}
					class="bg-scitech-navy focus:border-scitech-mint focus:ring-scitech-mint/20 w-full rounded-xl border border-white/10 px-4 py-3 text-xs text-text-main placeholder-text-muted transition-all focus:ring-2 focus:outline-none disabled:opacity-50"
				/>
			</div>

			<!-- Field 2: Daftar Jurnal (Rich Text Editor) -->
			<div class="space-y-2">
				<label
					for="journal_list"
					class="flex items-center gap-2 text-xs font-semibold text-text-main"
				>
					<BookOpen class="text-scitech-cyan h-4 w-4" />
					<span>Daftar Jurnal & Publikasi</span>
					<span class="text-red-400">*</span>
				</label>

				<div class="bg-scitech-navy overflow-hidden rounded-xl border border-white/10">
					<FormEditor showSaveButton={false} bind:value={journalListContent} />
				</div>
			</div>

			<!-- Action Buttons -->
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
						<span>{isEdit ? 'Memperbarui...' : 'Menyimpan...'}</span>
					{:else}
						<Save class="h-4 w-4" />
						<span>{isEdit ? 'Update Data Mahasiswa' : 'Simpan Data Mahasiswa'}</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
