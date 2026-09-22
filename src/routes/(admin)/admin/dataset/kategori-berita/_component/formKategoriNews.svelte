<script lang="ts">
	import { enhance } from '$app/forms';
	import { ArrowLeft, Tag, Link as LinkIcon, Save, Loader2Icon } from 'lucide-svelte';

	import Message from '$lib/components/admin/message.svelte';
	import type { MessageStatus } from '$lib/types/message';

	// Props / State
	let { data, form , actionUrl } = $props();

	let isEdit = $derived(!!data?.kategori?.id);


	let title = $derived(isEdit ? 'Edit Kategori Berita' : 'Tambah Kategori Berita');
//	let actionUrl = $derived(isEdit ? `${page.url.pathname}/${data.kategori.id}` : '${page.url.pathname}/add');

	let isSubmitting = $state(false);
	let showMessage = $state(false);
	let messageConfig = $state({
		status: 'info',
		title: '',
		message: ''
	});

	// Field state || sekaligus default data jika di edit
	let name = $state(form?.values?.name ?? data?.kategori?.name ?? '');
	let slug = $state(form?.values?.slug ?? data?.kategori?.slug ?? '');

	// Utility Helper untuk Trigger Message
	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}

	// Auto-generate Slug saat nama kategori diketik (jika tidak diisi manual)
	function handleNameInput(e: Event) {
		const target = e.target as HTMLInputElement;
		name = target.value;
		if (!isEdit) {
			slug = name
				.toLowerCase()
				.replace(/[^a-z0-9 -]/g, '')
				.replace(/\s+/g, '-')
				.replace(/-+/g, '-');
		}
	}

	function handleSlugInput(e: Event) {
		const target = e.target as HTMLInputElement;
		slug = target.value;
	}
</script>

<div class="mx-auto max-w-3xl space-y-6">
	<!-- Header & Navigation Bar -->
	<div class="flex items-center justify-between border-b border-white/10 pb-4">
		<div class="flex items-center gap-3">
			<!-- <button -->
			<!-- 	type="button" -->
			<!-- 	onclick={() => history.back()} -->
			<!-- 	class="rounded-xl border border-white/10 p-2.5 text-text-muted transition-all hover:border-white/20 hover:bg-white/10 hover:text-text-main active:scale-95" -->
			<!-- 	title="Kembali" -->
			<!-- > -->
			<!-- 	<ArrowLeft class="h-5 w-5" /> -->
			<!-- </button> -->
			<div>
				<h1 class="text-lg font-bold tracking-wide text-scitech-mint sm:text-xl">{title}</h1>
				<p class="text-xs text-text-muted">
					{isEdit
						? 'Perbarui informasi kategori berita di bawah ini.'
						: 'Isi formulir di bawah ini untuk menambahkan kategori berita baru.'}
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

	<!-- Form Card Container -->
	<div
		class="rounded-2xl border border-white/10 bg-scitech-slate/50 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
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
						const resData = (result.data as any) ?? {
							status: 'success',
							title: 'Berhasil',
							message: isEdit
								? 'Kategori berita berhasil diperbarui.'
								: 'Kategori berita berhasil ditambahkan.'
						};
						triggerMessage(resData.status, resData.title, resData.message);
						await update({ reset: !isEdit });
					} else if (result.type === "error") {
						const resData = (result.data as any) ?? {
							status: 'error',
							title: 'Gagal',
							message: 'Gagal menyimpan kategori berita.'
						};
						triggerMessage(resData.status, resData.title, resData.message);
						await update();
					} else {
						const resData = {
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
			<!-- Field Input: Nama Kategori -->
			<div class="space-y-2">
				<label for="name" class="flex items-center gap-2 text-xs font-semibold text-text-main">
					<Tag class="h-4 w-4 text-scitech-cyan" />
					<span>Nama Kategori</span>
					<span class="text-red-400">*</span>
				</label>

				<div class="relative">
					<input
						type="text"
						id="name"
						name="name"
						value={name}
						oninput={handleNameInput}
						placeholder="Contoh: Pengumuman, Seminar, Prestasi"
						required
						disabled={isSubmitting}
						class="w-full rounded-xl border border-white/10 bg-scitech-navy px-4 py-3 text-xs text-text-main placeholder-text-muted transition-all focus:border-scitech-mint focus:outline-none focus:ring-2 focus:ring-scitech-mint/20 disabled:opacity-50"
					/>
				</div>

				<p class="text-[11px] text-text-muted">
					Masukkan nama kategori berita yang akan ditampilkan pada sistem.
				</p>
			</div>

			<div class="space-y-2">
				<label for="slug" class="flex items-center gap-2 text-xs font-semibold text-text-main">
					<LinkIcon class="h-4 w-4 text-scitech-cyan" />
					<span>Slug URL</span>
				</label>

				<div class="relative">
					<input
						type="text"
						id="slug"
						name="slug"
						value={slug}
						oninput={handleSlugInput}
						placeholder="contoh: pengumuman-seminar"
						disabled={isSubmitting}
						class="w-full rounded-xl border border-white/10 bg-scitech-navy px-4 py-3 text-xs text-text-main placeholder-text-muted transition-all focus:border-scitech-mint focus:outline-none focus:ring-2 focus:ring-scitech-mint/20 disabled:opacity-50"
					/>
				</div>

				<p class="text-[11px] text-text-muted">
					Slug digunakan untuk Spesifik Kategory Berita  (contoh: <span class="font-mono text-scitech-mint"
						>/berita/kategori/{slug || 'nama-kategori'}</span
					>).
				</p>
			</div>

			<div class="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
				<button
					type="button"
					onclick={() => history.back() }
					disabled={isSubmitting}
					class="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-text-muted transition-all hover:bg-white/10 hover:text-text-main active:scale-95 disabled:opacity-50"
				>
					Batal
				</button>

				<button
					type="submit"
					disabled={isSubmitting}
					class="inline-flex items-center gap-2 rounded-xl bg-scitech-mint px-6 py-2.5 text-xs font-bold text-scitech-navy shadow-md shadow-scitech-mint/10 transition-all hover:bg-scitech-mint-hover active:scale-95 disabled:opacity-50"
				>
					{#if isSubmitting}
						<Loader2Icon class="h-4 w-4 animate-spin" />
						<span>Menyimpan...</span>
					{:else}
						<Save class="h-4 w-4" />
						<span>{isEdit ? 'Simpan Perubahan' : 'Simpan Kategori'}</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
