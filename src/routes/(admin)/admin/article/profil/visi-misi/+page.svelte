<script lang="ts">
	import { enhance } from '$app/forms';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import { Send } from 'lucide-svelte';

	// Props dari SvelteKit PageData
	let { data, form } = $props();

	// Local state terhubung dengan data dari server
	let id = $state(data?.visiMisi?.id ?? crypto.randomUUID());
	let content = $state(data?.visiMisi?.content ?? '');
	let isSubmitting = $state(false);
</script>

<div class="space-y-6 p-6 lg:p-10">
	<div class="border-scitech-slate/20 border-b pb-4">
		<h1 class="text-2xl font-bold tracking-tight text-text-main">Visi Misi</h1>
	</div>

	<div class="border-scitech-slate/20 bg-scitech-navy-glare rounded-2xl border p-6 shadow-xl">
		<h2 class="text-scitech-mint mb-6 text-sm font-semibold">Form Ubah Data Visi Misi</h2>

		<form
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					isSubmitting = false;
					await update();
				};
			}}
			class="space-y-6"
		>
			<!-- Hidden Input ID -->
			<input type="hidden" name="id" value={id} />

			<!-- Input Editor Container -->
			<div class="space-y-2">
				<label for="content" class="text-xs font-medium text-text-main">
					Isi Visi Misi<span class="text-scitech-error">*</span>
				</label>

				<!-- Component Editor -->
				<FormEditor bind:value={content} />

				<!-- Hidden Textarea untuk Mengirimkan Nilai Rich Text ke Form POST -->
				<textarea name="content" class="hidden" bind:value={content}></textarea>
			</div>

			<!-- Tampilan Notifikasi Feedback -->
			{#if form?.message}
				<p class="text-xs {form?.success ? 'text-scitech-mint' : 'text-scitech-error'}">
					{form.message}
				</p>
			{/if}

			<!-- submit button (posisi di bawah kiri sesuai gambar) -->
			<div class="pt-2">
				<button
					type="submit"
					disabled={isSubmitting}
					class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover inline-flex items-center justify-center rounded-xl p-3 text-sm font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
					title="Simpan Visi Misi"
				>
					<Send class="h-5 w-5" />
				</button>
			</div>
		</form>
	</div>
</div>
