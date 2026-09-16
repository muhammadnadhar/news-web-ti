<script lang="ts">
	import { enhance } from '$app/forms';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import { Building2, UploadCloud, X, Handshake, ArrowLeft, Send } from 'lucide-svelte';
	import type { ActionData } from './$types';
	import {
		folder_cloudinary_admin_article_kerjasama,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';

	interface Props {
		form?: ActionData;
	}

	let { form }: Props = $props();

	let institutionName = $state(form?.values?.institutionName ?? '');
	let logoUrl = $state(form?.values?.logoUrl ?? '');
	let isSubmitting = $state(false);

	function handleUpload(result: any) {
		if (result?.event === 'success') {
			logoUrl = result.info.secure_url;
		}
	}

	function removeLogo() {
		logoUrl = '';
	}
</script>

<svelte:head>
	<title>Tambah Kerjasama - Admin Portal</title>
</svelte:head>

<div class="min-h-screen bg-[var(--color-bg-primary)] p-4 text-[var(--color-text-main)] md:p-8">
	<div class="mx-auto max-w-3xl space-y-6">
		<!-- Tombol Kembali -->
		<div class="flex items-center justify-between">
			<a
				href="/admin/kerjasama"
				class="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] px-3 py-2 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-main)]"
			>
				<ArrowLeft class="h-4 w-4" />
				<span>Kembali ke Daftar</span>
			</a>
		</div>

		<!-- Card Form -->
		<div
			class="overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] shadow-xl"
		>
			<!-- Header Card -->
			<div
				class="border-b border-[var(--color-border-light)] bg-[var(--color-bg-primary-glare)] px-6 py-4"
			>
				<h2
					class="flex items-center gap-2 text-base font-semibold text-[var(--color-accent-primary)]"
				>
					<Handshake class="h-5 w-5" />
					<span>Form Tambah Data Kerjasama Instansi</span>
				</h2>
			</div>

			<form
				method="POST"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						await update();
					};
				}}
				class="space-y-6 p-6"
			>
				{#if form?.error}
					<div
						class="rounded-lg border border-[var(--color-status-error)]/40 bg-[var(--color-status-error)]/20 p-3.5 text-xs font-medium text-[var(--color-status-error)]"
					>
						{form.error}
					</div>
				{/if}

				<!-- Hidden input URL Logo untuk backend -->
				<input type="hidden" name="logo_url" value={logoUrl} />

				<!-- Nama Instansi / Mitra -->
				<div class="space-y-1.5">
					<label for="institution_name" class="block text-xs font-medium text-text-muted">
						Nama Instansi / Mitra Kerjasama <span class="text-[var(--color-status-error)]">*</span>
					</label>
					<div class="relative">
						<input
							type="text"
							id="institution_name"
							name="institution_name"
							bind:value={institutionName}
							required
							placeholder="Contoh: Bank Indonesia / Forum Konservasi Leuser"
							class="w-full rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] py-2.5 pr-3 pl-10 text-xs text-[var(--color-text-main)] transition-colors focus:border-[var(--color-accent-primary)] focus:outline-none"
						/>
						<Building2 class="absolute top-3 left-3 h-4 w-4 text-[var(--color-text-muted)]" />
					</div>
				</div>

				<!-- Upload Logo Mitra (Cloudinary Widget) -->
				<div class="space-y-2">
					<label class="block text-xs font-medium text-[var(--color-text-muted)]">
						Logo Instansi / Mitra
					</label>

					<div
						class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border-light)] bg-[var(--color-bg-primary)] p-6 text-center"
					>
						{#if logoUrl}
							<div
								class="relative flex h-32 w-48 items-center justify-center overflow-hidden rounded-xl border border-[var(--color-border-light)] bg-white/5 p-2 shadow-md"
							>
								<img
									src={logoUrl}
									alt="Preview Logo Instansi"
									class="max-h-full max-w-full object-contain"
								/>
								<button
									type="button"
									onclick={removeLogo}
									class="absolute top-1 right-1 rounded-full bg-[var(--color-status-error)] p-1.5 text-white shadow transition-transform hover:scale-110"
									title="Hapus Logo"
								>
									<X class="h-3.5 w-3.5" />
								</button>
							</div>
							<p class="mt-3 max-w-[250px] truncate text-[11px] text-[var(--color-text-muted)]">
								{logoUrl}
							</p>
						{:else}
							<!-- Placeholder Lucide Icon & Widget CldUploadWidget -->
							<div
								class="mb-3 flex h-20 w-20 items-center justify-center rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]"
							>
								<Building2 class="h-10 w-10 opacity-40" />
							</div>

							<CldUploadWidget
								config={getUploadConfig()}
								options={getUploadOptions(folder_cloudinary_admin_article_kerjasama)}
								uploadPreset={upload_cloudinary_preset}
								onUpload={handleUpload}
								let:open
							>
								<button
									type="button"
									onclick={() => open()}
									class="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] px-4 py-2.5 text-xs font-semibold text-[var(--color-accent-primary)] shadow-sm transition-all hover:bg-[var(--color-border-light)]"
								>
									<UploadCloud class="h-4 w-4" />
									<span>Pilih & Unggah Logo</span>
								</button>
							</CldUploadWidget>
						{/if}
					</div>
				</div>

				<!-- Tombol Submit -->
				<div class="flex justify-end border-t border-[var(--color-border-light)] pt-4">
					<button
						type="submit"
						disabled={isSubmitting}
						class="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent-primary)] px-5 py-2.5 text-xs font-bold text-[var(--color-text-dark)] shadow-md transition-all hover:opacity-90 disabled:opacity-50"
					>
						{#if isSubmitting}
							<span>Memproses...</span>
						{:else}
							<Send class="h-4 w-4" />
							<span>Simpan Data</span>
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
