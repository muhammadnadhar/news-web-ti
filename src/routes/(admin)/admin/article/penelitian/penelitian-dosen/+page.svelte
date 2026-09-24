<script lang="ts">
	import { enhance } from '$app/forms';
	import { Send } from 'lucide-svelte';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import Message from '$lib/components/admin/message.svelte';
	import type { ResponseMessage } from '$lib/types/message';
	import type { PageData, ActionData } from './$types';

	interface Props {
		data: PageData;
		form?: ActionData;
	}

	let { data, form }: Props = $props();

	// State Management
	let titleInput = $state('Penelitian Dosen Prodi TI');
	let descriptionContent = $state(data.researchData?.description || '');
	let isSaving = $state(false);

	// Message / Toast State
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

<svelte:head>
	<title>Penelitian Dosen - Admin Portal</title>
</svelte:head>

<!-- Komponen Message Response -->
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

<div class="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
	<div class="border-b border-white/10 pb-6">
		<h1 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">
			Penelitian Dosen Prodi TI
		</h1>
	</div>

	<div
		class="bg-scitech-slate/60 space-y-6 rounded-3xl border border-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
	>
		<div class="border-b border-white/10 pb-4">
			<h2 class="text-scitech-mint text-sm font-bold sm:text-base">
				Form Ubah Data Penelitian Dosen Prodi TI
			</h2>
		</div>

		<form
			method="POST"
			action="?/save"
			use:enhance={() => {
				isSaving = true;
				showMessage = false;

				return async ({ result, update }) => {
					isSaving = false;

					if (result.type === 'success') {
						const resData = (result.data as ResponseMessage) ?? {
							status: 'success',
							title: 'Berhasil',
							message: 'Data Penelitian Dosen berhasil disimpan.'
						};
						triggerMessage(resData.status, resData.title, resData.message);
						await update({ reset: false });
					} else if (result.type === 'failure') {
						const resData = (result.data as ResponseMessage) ?? {
							status: 'error',
							title: 'Gagal',
							message: (result.data?.message as string) || 'Gagal menyimpan data.'
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
			<div class="space-y-2">
				<label for="title" class="block text-xs font-medium text-text-main">
					Judul<span class="text-rose-400">*</span>
				</label>
				<input
					id="title"
					type="text"
					bind:value={titleInput}
					readonly
					class="bg-scitech-navy/50 w-full cursor-not-allowed rounded-xl border border-white/10 px-4 py-2.5 text-xs text-text-muted focus:outline-none"
				/>
			</div>

			<div class="space-y-2">
				<label for="description" class="block text-xs font-medium text-text-main">
					Isi Deskripsi / Rekapitulasi<span class="text-rose-400">*</span>
				</label>

				<!-- Component FormEditor -->
				<FormEditor
					showSaveButton={false}
					title={'Penelitian Dosen'}
					bind:value={descriptionContent}
				/>

				<input type="hidden" name="description" value={descriptionContent} />
			</div>

			<div class="pt-2">
				<button
					type="submit"
					disabled={isSaving}
					class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
				>
					<Send class="h-4 w-4" />
					<span>{isSaving ? 'Menyimpan...' : 'Simpan Data'}</span>
				</button>
			</div>
		</form>
	</div>
</div>
