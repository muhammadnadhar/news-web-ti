<script lang="ts">
	import { enhance } from '$app/forms';
	import { Save, Loader2, UserCheck } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';
	import { type MessageStatus, type ResponseMessage } from '$lib/types/message';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import Message from '$lib/components/notif/message.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// State lokal form diinisialisasi dari data server (jika ada)
	let selectedStaffId = $derived(data.sambutan?.lecturer_staff_id || '');
	let title = $derived(data.sambutan?.title || 'Sambutan Ketua Program Studi');
	let welcomeMessage = $derived(data.sambutan?.welcome_message || '');
	let isSubmitting = $state(false);

	let showMessage = $state(false);

	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});
	function triggerMessage(status: MessageStatus, titleText: string, msg: string) {
		messageConfig = { status, title: titleText, message: msg };
		showMessage = true;
	}

	$effect(() => {
		if (form?.message) {
			triggerMessage(form.message?.status, form.message.title, form.message.text);
		}
	});
</script>

{#if showMessage}
	<div class="mb-4 transition-all duration-300">
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

<div class="min-h-screen bg-bg-primary p-6 text-text-main transition-colors duration-300 lg:p-10">
	<div class="mx-auto max-w-3xl space-y-8">
		<div class="flex items-center justify-between pb-5">
			<div>
				<h1 class="text-2xl font-bold tracking-tight text-text-main">Kelola Sambutan Pimpinan</h1>
				<p class="text-xs text-text-muted">
					Pilih dosen/pimpinan dari data master staf dan atur pesan sambutan utama halaman.
				</p>
			</div>
		</div>

		<form
			method="POST"
			action="?/saveWellcome"
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
						await update({ reset: true });
					} else if (result.type === 'failure') {
						const resData = (result.data as ResponseMessage) ?? {
							status: 'error',
							title: 'Gagal',
							message: 'Gagal menyimpan data angkatan.'
						};
						triggerMessage(resData.status, resData.title, resData.message);
						await update();
					} else {
						const resData: ResponseMessage = {
							status: 'error',
							title: 'Kesalahan Sistem',
							message: 'Terjadi kesalahan sistem yang tidak diketahui.'
						};
						triggerMessage(resData.status, resData.title, resData.message);
						await update();
					}
				};
			}}
			class="space-y-6"
		>
			<div class="space-y-5 rounded-2xl bg-bg-secondary p-6 shadow-sm">
				<div>
					<label
						class="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-text-muted uppercase"
					>
						<UserCheck class="h-3.5 w-3.5 text-accent-cyan" />
						<span>Pilih Profil Dosen / Pimpinan</span>
					</label>
					<select
						name="lecturer_staff_id"
						bind:value={selectedStaffId}
						required
						class="w-full rounded-xl border border-border-color bg-bg-primary px-3.5 py-2.5 text-xs text-text-main focus:border-accent-primary focus:outline-none"
					>
						<option value="" disabled>-- Pilih Dosen dari Master Staf --</option>
						{#each data.staffList as staff}
							<option value={staff.id}>
								{staff.name}
								{staff.nidn ? `(NIP: ${staff.nidn})` : ''}
							</option>
						{/each}
					</select>
				</div>

				<!-- Judul Sambutan -->
				<div>
					<label for="title" class="text-11p mb-1.5 block font-semibold text-text-muted uppercase">
						Judul / Sub-Judul Sambutan
					</label>
					<input
						id="title"
						type="text"
						name="title"
						bind:value={title}
						placeholder="Contoh: Sambutan Ketua Program Studi Teknologi Informasi"
						required
						class="w-full rounded-xl border border-border-color bg-bg-primary px-3.5 py-2.5 text-xs text-text-main focus:border-accent-primary focus:outline-none"
					/>
				</div>

				<div class="space-y-2">
					<input type="hidden" name="welcome_message" value={JSON.stringify(welcomeMessage)} />
					<FormEditor
						title="Isi Teks Sambutan"
						label="Deskripsi / Text Sambutan"
						bind:value={welcomeMessage}
						showSaveButton={false}
					/>
				</div>
			</div>

			<div class="flex items-center justify-end gap-3.5 pt-5">
				<button
					type="button"
					onclick={() => history.back()}
					class="border border-border-color bg-bg-primary px-5 py-2.5 text-sm font-semibold text-text-main transition-all hover:bg-bg-secondary-hover active:scale-95"
				>
					Batal
				</button>

				<button
					type="submit"
					disabled={isSubmitting}
					class="inline-flex items-center gap-2 bg-accent-primary px-6 py-2.5 text-xs font-bold text-text-dark shadow-sm transition-all hover:bg-accent-primary-hover active:scale-95 disabled:opacity-50"
				>
					{#if isSubmitting}
						<Loader2 class="h-4 w-4 animate-spin" />
						<span>Menyimpan...</span>
					{:else}
						<Save class="h-4 w-4" />
						<span>Simpan Sambutan Pimpinan</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
