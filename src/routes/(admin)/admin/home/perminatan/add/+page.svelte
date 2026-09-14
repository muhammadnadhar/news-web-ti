<script lang="ts">
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { ArrowLeft, Save, BookOpen, AlertCircle } from 'lucide-svelte';

	let { form } = $props();

	// Local states untuk UI
	let loading = $state(false);
	let title = $state('');
	let description = $state('');
</script>

<div class="mx-auto max-w-3xl space-y-6">
	<!-- Back Button & Header -->
	<div class="flex items-center gap-4">
		<button
			type="button"
			onclick={() => history.back()}
			class="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-bg-secondary/60 text-white transition-all hover:bg-white/10"
		>
			<ArrowLeft class="h-5 w-5" />
		</button>
		<div>
			<h1 class="text-pure-white text-xl font-bold md:text-2xl">Tambah Peminatan Baru</h1>
			<p class="text-sm text-text-muted">
				Tambahkan fokus / konsentrasi keahlian untuk Teknik Informatika.
			</p>
		</div>
	</div>

	<!-- Error Alert jika validasi server gagal -->
	{#if form?.error}
		<div
			class="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300"
		>
			<AlertCircle class="h-5 w-5 shrink-0 text-rose-400" />
			<p class="text-sm">{form.error}</p>
		</div>
	{/if}

	<!-- Form Tambah -->
	<form
		method="POST"
		action="?/create"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				loading = false;
				await update();
			};
		}}
		class="space-y-6 rounded-2xl border border-white/10 bg-bg-secondary/40 p-6 backdrop-blur-md md:p-8"
	>
		<div class="space-y-2">
			<label for="title" class="text-pure-white block text-sm font-semibold">
				Judul Peminatan <span class="text-amber-500">*</span>
			</label>
			<input
				type="text"
				id="title"
				name="title"
				bind:value={title}
				maxlength="150"
				required
				placeholder="Contoh: Kecerdasan Buatan (AI) & Data Science"
				class="w-full rounded-xl border border-white/10 bg-bg-primary/60 px-4 py-3 text-sm text-white placeholder-text-muted/50 transition-all outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
			/>
			<div class="flex justify-between text-xs text-text-muted">
				<span>Maksimal 150 karakter</span>
				<span>{title.length}/150</span>
			</div>
		</div>

		<!-- Input Description (TEXT) -->
		<div class="space-y-2">
			<label for="description" class="text-pure-white block text-sm font-semibold">
				Deskripsi Lengkap <span class="text-amber-500">*</span>
			</label>
			<textarea
				id="description"
				name="description"
				bind:value={description}
				rows="5"
				required
				placeholder="Jelaskan cakupan topik, mata kuliah fokus, atau prospek karir dari peminatan ini..."
				class="w-full rounded-xl border border-white/10 bg-bg-primary/60 px-4 py-3 text-sm text-white placeholder-text-muted/50 transition-all outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
			></textarea>
		</div>

		<!-- Actions Button -->
		<div class="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
			<button
				type="button"
				onclick={() => history.back()}
				class="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-text-muted transition-all hover:bg-white/5 hover:text-white"
			>
				Batal
			</button>

			<button
				type="submit"
				disabled={loading}
				class="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] hover:bg-amber-400 active:scale-[0.98] disabled:opacity-50"
			>
				{#if loading}
					<span
						class="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent"
					></span>
					<span>Menyimpan...</span>
				{:else}
					<Save class="h-4 w-4" />
					<span>Simpan Peminatan</span>
				{/if}
			</button>
		</div>
	</form>
</div>
