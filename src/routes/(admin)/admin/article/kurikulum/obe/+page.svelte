<script lang="ts">
	import { enhance } from '$app/forms';
	import { Sparkles, Send } from 'lucide-svelte';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import type { MessageStatus, ResponseMessage } from '$lib/types/message.js';
	import Message from '$lib/components/admin/message.svelte';

	let { data } = $props();

	let descriptionContent = $state(data.obeData?.description || '');
	let isSaving = $state(false);
	let isSubmitting = $state(false);
	let showMessage = $state(false);
	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	let formElement = $state<HTMLFormElement | null>(null);

	function handleParentSubmit(editorData: string) {
		descriptionContent = editorData; // Sinkronisasi ulang (opsional karena sudah bind:value)

		// Trigger pengiriman form parent ke SvelteKit Form Action
		if (formElement) {
			formElement.requestSubmit();
		}
	}
	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}

</script>


	<!-- Alert / Toast Notification -->
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

<div class="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
	<div class="border-b border-white/10 pb-6">

		<h1 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">Kurikulum OBE</h1>
	</div>

	<!-- Container Form Ubah Data Kurikulum OBE -->
	<div
		class="bg-scitech-slate/60 space-y-6 rounded-3xl border border-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
	>
		<div class="border-b border-white/10 pb-4">
			<h2 class="text-scitech-mint text-sm font-bold sm:text-base">
				Form Ubah Data Kurikulum OBE
			</h2>
		</div>

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
			<div class="space-y-2">
			
				
				<!-- Component FormEditor -->
				<FormEditor label={"isi description Kurikulum Obe"} bind:value={descriptionContent} onSave={handleParentSubmit} />
				
				<!-- Hidden Input untuk dikirim via FormData -->
				<input type="hidden" name="description" value={descriptionContent} />
			</div>

		</form>
	</div>
</div>
