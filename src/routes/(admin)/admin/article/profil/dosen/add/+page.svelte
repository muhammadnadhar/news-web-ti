<script lang="ts">
	import { enhance } from '$app/forms';
	import { CldUploadWidget } from 'svelte-cloudinary';
	import {
		User,
		CreditCard,
		BookOpen,
		Link as LinkIcon,
		UploadCloud,
		X,
		UserCheck,
		ArrowLeft,
		Send,
		BriefcaseIcon,
		ChevronDownCircle,
		ChevronDownIcon,
		LoaderCircleIcon
	} from 'lucide-svelte';
	import type { ActionData } from './$types';
	import {
		folder_cloudinary_admin_article_profil,
		getUploadConfig,
		getUploadOptions,
		upload_cloudinary_preset
	} from '$lib/cloudinary/client';
	import Message from '$lib/components/admin/message.svelte';

	interface Props {
		form?: ActionData;
	}

	let { form }: Props = $props();

	let name = $state(form?.values?.name ?? '');
	let nidn = $state(form?.values?.nidn ?? '');
	let expertise = $state(form?.values?.expertise ?? '');
	let pddiktiUrl = $state(form?.values?.pddiktiUrl ?? '');
	let photoUrl = $state(form?.values?.photoUrl ?? '');
	let publicId = $state(''); // State untuk menyimpan public_id dari Cloudinary
	let isSubmitting = $state(false);
	let isDeletingPhoto = $state(false); // State loading hapus foto
	let category = $state('dosen');

	function handleUpload(result: any) {
		if (result?.event === 'success') {
			photoUrl = result.info.secure_url;
		}
	}

	async function removePhoto() {
		if (!publicId) {
			photoUrl = '';
			return;
		}

		isDeletingPhoto = true;
		const formData = new FormData();
		formData.append('public_id', publicId);

		const res = await fetch('?/deletePhoto', {
			method: 'POST',
			body: formData
		});

		if (res.ok) {
			photoUrl = '';
			publicId = '';
		} else {
			alert('Gagal menghapus foto dari Cloudinary');
		}
		isDeletingPhoto = false;
	}
</script>

<svelte:head>
	<title>Tambah Dosen & Staff - Admin Portal</title>
</svelte:head>

<div class="min-h-screen bg-[var(--color-bg-primary)] p-4 text-[var(--color-text-main)] md:p-8">
	<div class="mx-auto max-w-4xl space-y-6">
		<!-- Top Bar / Back Button -->

		<!-- Card Form -->
		<div
			class="overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] shadow-xl"
		>
			<div
				class="border-b border-[var(--color-border-light)] bg-[var(--color-bg-primary-glare)] px-6 py-4"
			>
				<h2
					class="flex items-center gap-2 text-base font-semibold text-[var(--color-accent-primary)]"
				>
					<UserCheck class="h-5 w-5" />
					<span>Form Tambah Data Dosen & Staff</span>
				</h2>
			</div>

			<form
				method="POST"
				action="?/create"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						await update();
					};
				}}
				class="space-y-6 p-6"
			>
				<!-- {#if form?.error} -->
				<!-- 	<div -->
				<!-- 		class="rounded-lg border border-[var(--color-status-error)]/40 bg-[var(--color-status-error)]/20 p-3.5 text-xs font-medium text-[var(--color-status-error)]" -->
				<!-- 	> -->
				<!-- 		{form.error} -->
				<!-- 	</div> -->
				<!-- {/if} -->
				{#if form?.message}
					<Message type={form.message.type} text={form.message.text} />
				{/if}

				<!-- Hidden input URL foto untuk backend -->
				<input type="hidden" name="photo_url" value={photoUrl} />
				<input type="hidden" name="public_id" value={publicId} />

				<!-- Grid Utama: Foto Profil & Detail Dosen -->
				<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
					<!-- Kolom Upload Foto -->
					<div class="space-y-2 md:col-span-1">
						<label
							class="block text-xs font-bold tracking-wider text-[var(--color-text-muted)] uppercase"
						>
							Foto Profil
						</label>

						<div
							class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border-light)] bg-[var(--color-bg-primary)] p-4 text-center"
						>
							{#if photoUrl}
								<div
									class="relative h-40 w-40 overflow-hidden rounded-full border-2 border-[var(--color-accent-primary)] shadow-md"
								>
									<img
										src={photoUrl}
										alt="Preview Foto Profil"
										class="h-full w-full object-cover"
									/>
									<button
										type="button"
										onclick={removePhoto}
										disabled={isDeletingPhoto}
										class="absolute top-1 right-1 rounded-full bg-[var(--color-status-error)] p-1.5 text-text-main shadow transition-transform hover:scale-110"
										title="Hapus Foto"
									>
										{#if isDeletingPhoto}
											<LoaderCircleIcon class="h-3.5 w-3.5 animate-spin" />
										{:else}
											<X class="h-3.5 w-3.5" />
										{/if}
									</button>
								</div>
								<p class="mt-3 max-w-[180px] truncate text-[11px] text-text-muted">
									{photoUrl}
								</p>
							{:else}
								<!-- Placeholder Lucide Icon & Widget CldUploadWidget -->
								<div
									class="mb-3 flex h-32 w-32 items-center justify-center rounded-full border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]"
								>
									<User class="h-16 w-16 opacity-40" />
								</div>

								<CldUploadWidget
									config={getUploadConfig()}
									uploadPreset={upload_cloudinary_preset}
									options={getUploadOptions(folder_cloudinary_admin_article_profil)}
									onUpload={handleUpload}
									let:open
									let:isLoading
								>
									<button
										type="button"
										onclick={() => open()}
										class="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-secondary)] px-3 py-2 text-xs font-semibold text-[var(--color-accent-primary)] shadow-sm transition-all hover:bg-[var(--color-border-light)]"
									>
										<UploadCloud class="h-4 w-4" />
										<span>Unggah Foto</span>
									</button>
								</CldUploadWidget>
							{/if}
						</div>
					</div>

					<!-- Kolom Form Isian -->
					<div class="space-y-4 md:col-span-2">
						<!-- Nama Lengkap beserta Gelar -->
						<div class="space-y-1.5">
							<label for="name" class="block text-xs font-medium text-[var(--color-text-muted)]">
								Nama Lengkap & Gelar <span class="text-[var(--color-status-error)]">*</span>
							</label>
							<div class="relative">
								<input
									type="text"
									id="name"
									name="name"
									bind:value={name}
									required
									placeholder="Contoh: Aulia Syarif Aziz, S.Kom., M.Sc"
									class="w-full rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] py-2.5 pr-3 pl-10 text-xs text-[var(--color-text-main)] transition-colors focus:border-[var(--color-accent-primary)] focus:outline-none"
								/>
								<User class="absolute top-3 left-3 h-4 w-4 text-[var(--color-text-muted)]" />
							</div>
						</div>

						<!-- NIDN / NIP -->
						<div class="space-y-1.5">
							<label for="nidn" class="block text-xs font-medium text-[var(--color-text-muted)]">
								NIDN / NIP <span class="text-[10px] text-[var(--color-text-muted)]"
									>(Kosongkan / "-" jika Staff Administrasi)</span
								>
							</label>
							<div class="relative">
								<input
									type="text"
									id="nidn"
									name="nidn"
									bind:value={nidn}
									placeholder="Contoh: 0415088901"
									class="w-full rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] py-2.5 pr-3 pl-10 text-xs text-[var(--color-text-main)] transition-colors focus:border-[var(--color-accent-primary)] focus:outline-none"
								/>
								<CreditCard class="absolute top-3 left-3 h-4 w-4 text-[var(--color-text-muted)]" />
							</div>
						</div>

						<!-- Bidang Keahlian / Tugas -->
						<div class="space-y-1.5">
							<label
								for="expertise"
								class="block text-xs font-medium text-[var(--color-text-muted)]"
							>
								Bidang Keahlian / Tugas <span class="text-[var(--color-status-error)]">*</span>
							</label>
							<div class="relative">
								<input
									type="text"
									id="expertise"
									name="expertise"
									bind:value={expertise}
									required
									placeholder="Contoh: Keamanan Siber / Staff Administrasi"
									class="w-full rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] py-2.5 pr-3 pl-10 text-xs text-[var(--color-text-main)] transition-colors focus:border-[var(--color-accent-primary)] focus:outline-none"
								/>
								<BookOpen class="absolute top-3 left-3 h-4 w-4 text-[var(--color-text-muted)]" />
							</div>
						</div>

						<!-- Link PDDikti / DDT -->
						<div class="space-y-1.5">
							<label
								for="pddikti_url"
								class="block text-xs font-medium text-[var(--color-text-muted)]"
							>
								Link PDDikti / DDT <span class="text-[10px] text-[var(--color-text-muted)]"
									>(Opsional)</span
								>
							</label>
							<div class="relative">
								<input
									type="url"
									id="pddikti_url"
									name="pddikti_url"
									bind:value={pddiktiUrl}
									placeholder="https://pddikti.kemdiktisaintek.go.id/data_dosen/..."
									class="w-full rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] py-2.5 pr-3 pl-10 text-xs text-[var(--color-text-main)] transition-colors focus:border-[var(--color-accent-primary)] focus:outline-none"
								/>
								<LinkIcon class="absolute top-3 left-3 h-4 w-4 text-[var(--color-text-muted)]" />
							</div>
						</div>
					</div>
				</div>

				<!-- Pilihan Kategori (Dosen / Staff) -->
				<div class="space-y-1.5">
					<label for="category" class="block text-xs font-medium text-[var(--color-text-muted)]">
						Kategori Kepegawaian <span class="text-[var(--color-status-error)]">*</span>
					</label>
					<div class="relative">
						<select
							id="category"
							name="category"
							bind:value={category}
							required
							class="w-full appearance-none rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-primary)] py-2.5 pr-10 pl-10 text-xs text-[var(--color-text-main)] transition-colors focus:border-[var(--color-accent-primary)] focus:outline-none"
						>
							<option value="dosen">Dosen</option>
							<option value="staff">Staff Administrasi / Umum</option>
						</select>
						<BriefcaseIcon class="absolute top-3 left-3 h-4 w-4 text-[var(--color-text-muted)]" />
						<!-- Custom Dropdown Arrow -->
						<div
							class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--color-text-muted)]"
						>
							<ChevronDownIcon class="h-4 w-4" />
						</div>
					</div>
				</div>

				<!-- Submit Button -->
				<div class="flex justify-end border-t border-[var(--color-border-light)] pt-4">
					<button
						type="submit"
						disabled={isSubmitting || isDeletingPhoto}
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
