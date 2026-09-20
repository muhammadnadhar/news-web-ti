<script lang="ts">
	import { enhance } from '$app/forms';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import Message from '$lib/components/admin/message.svelte';
	import type { MessageStatus, ResponseMessage } from '$lib/types/message.js';

	// Props dari SvelteKit PageData
	let { data, form } = $props();
	let formElement = $state<HTMLFormElement | null>(null);

	// Local state terhubung dengan data dari server
	let id = $state(data?.visiMisi?.id ?? crypto.randomUUID());
	let content = $state(data?.visiMisi?.content ?? '');
	let isSubmitting = $state(false);

	function handleParentSubmit(editorData: string) {
		content = editorData; // Sinkronisasi ulang (opsional karena sudah bind:value)

		// Trigger pengiriman form parent ke SvelteKit Form Action
		if (formElement) {
			formElement.requestSubmit();
		}
	}

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

<div class="space-y-6 p-6 lg:p-10">
	<div class="border-scitech-slate/20 pb-4">
		<h1 class="text-2xl font-bold tracking-tight text-text-main">Visi Misi</h1>
	</div>

	<div class="border-scitech-slate/20 bg-scitech-navy-glare rounded-2xl border p-6 shadow-xl">
		<h2 class="text-scitech-mint mb-6 text-sm font-semibold">Form Ubah Data Visi Misi</h2>

		<form
			bind:this={formElement}
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ result, update }) => {
					isSubmitting = false;

					if (result.type === 'success') {
						triggerMessage('success', 'Berhasil', 'Data Visi Misi berhasil disimpan!');
					} else if (result.type === 'failure') {
						triggerMessage(
							'error',
							'Gagal',
							(result.data?.message as string) || 'Gagal menyimpan data.'
						);
					}

					await update({ reset: false });
				};
			}}
			class="space-y-6"
		>
			<!-- Hidden Input ID -->
			<input type="hidden" name="id" value={id} />
			<input type="hidden" name="content" value={content} />

			<div class="space-y-2">
				<label for="content" class="text-xs font-medium text-text-main">
					Isi Visi Misi<span class="text-scitech-error">*</span>
				</label>

				<!-- Component Editor -->
				<FormEditor bind:value={content} onSave={handleParentSubmit} />
			</div>

			<!-- {#if form?.message} -->
			<!-- 	<p class="text-xs {form?.success ? 'text-scitech-mint' : 'text-scitech-error'}"> -->
			<!-- 		{form.message} -->
			<!-- 	</p> -->
			<!-- {/if} -->
			<!---->
			<!-- <div class="pt-2"> -->
			<!-- 	<button -->
			<!-- 		type="submit" -->
			<!-- 		disabled={isSubmitting} -->
			<!-- 		class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover inline-flex items-center justify-center rounded-xl p-3 text-sm font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50" -->
			<!-- 		title="Simpan Visi Misi" -->
			<!-- 	> -->
			<!-- 		<Send class="h-5 w-5" /> -->
			<!-- 	</button> -->
			<!-- </div> -->
		</form>
	</div>
</div>
