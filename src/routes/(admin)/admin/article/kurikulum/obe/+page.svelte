<script lang="ts">
	import { enhance } from '$app/forms';
	import { Sparkles, Send } from 'lucide-svelte';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import type { ResponseMessage } from '$lib/types/message.js';
	import Message from '$lib/components/admin/message.svelte';

	let { data } = $props();

	let descriptionContent = $state(data.obeData?.description || '');
	let isSaving = $state(false);


	let showMessage = $state(false);
	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});


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
		<span
			class="text-scitech-mint mb-1 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
		>
			<Sparkles class="text-scitech-mint h-4 w-4" /> Artikel Akademik
		</span>
		<h1 class="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Kurikulum OBE</h1>
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
			method="POST"
			action="?/save"
			use:enhance={() => {
				isSaving = true;
				return async ({ update }) => {
					await update();
					isSaving = false;
				};
			}}
			class="space-y-6"
		>
			<div class="space-y-2">
				<label for="description" class="block text-xs font-medium text-white">
					Isi Description<span class="text-rose-400">*</span>
				</label>
				
				<!-- Component FormEditor -->
				<FormEditor bind:value={descriptionContent} />
				
				<!-- Hidden Input untuk dikirim via FormData -->
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
