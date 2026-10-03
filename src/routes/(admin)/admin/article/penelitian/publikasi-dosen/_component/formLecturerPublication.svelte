<script lang="ts">
	import { enhance } from '$app/forms';
	import Message from '$lib/components/admin/message.svelte';
	import type { ResponseMessage } from '$lib/types/message';
	import {
		ArrowLeft,
		GraduationCap,
		User,
		Link as LinkIcon,
		Save,
		Loader2Icon,
		BookOpen
	} from 'lucide-svelte';
	import type {
		LecturerPublicationDTO,
		LecturerResearchDTO
	} from '$lib/dto/admin/article/penelitian';
	import type { LecturerPublicationFormValues } from '$lib/types/values/admin/article';
	import type { LecturerStaffItemDTO } from '$lib/dto/admin/article/profile';

	let {
		valueData,
		initialData = null,
		lecturers = [],
		isEdit = false
	}: {
		initialData?: LecturerPublicationDTO | null;
		lecturers?: LecturerStaffItemDTO[];
		isEdit?: boolean;
		valueData?: LecturerPublicationFormValues;
	} = $props();

	let isSubmitting = $state(false);
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

<!-- Alert / Toast Notification -->
{#if showMessage}
	<Message
		status={showMessage ? messageConfig.status : 'error'}
		title={showMessage ? messageConfig.title : 'Gagal'}
		message={messageConfig.message}
		dismissible={true}
		timeout={4000}
		onclose={() => (showMessage = false)}
	/>
{/if}

<div class="mx-auto max-w-3xl space-y-6">
	<div class="flex items-center justify-between border-b border-border-color/10 pb-4">
		<div>
			<div class="flex items-center gap-2">
				<GraduationCap class="text-scitech-mint h-5 w-5" />
				<h1 class="text-scitech-mint text-lg font-bold tracking-wide sm:text-xl">
					{isEdit ? 'Edit Publikasi Dosen' : 'Tambah Publikasi Dosen'}
				</h1>
			</div>
			<p class="text-xs text-text-muted">
				{isEdit
					? 'Perbarui informasi profil dosen dan tautan portal publikasi.'
					: 'Pilih dosen beserta tautan portal publikasi SINTA dan Google Scholar.'}
			</p>
		</div>
	</div>
	<!-- Glassmorphism Form Card -->
	<div
		class="rounded-2xl border border-border-color/10 bg-bg-secondary/50 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
	>
		<form
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				showMessage = false;

				return async ({ result, update }) => {
					isSubmitting = false;

					if (result.type === 'success') {
						const resData =
							result.type === 'success' || result.type === 'failure'
								? (result.data as ResponseMessage | undefined)
								: undefined;
						triggerMessage(resData.status, resData.title, resData.message);
						await update({ reset: !isEdit });
					} else if (result.type === 'failure') {
						const resData = (result.data as ResponseMessage) ?? {
							status: 'error',
							title: 'Gagal',
							message: (result.data?.message as string) || 'Gagal memproses data.'
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
				<label
					for="lecturer_id"
					class="flex items-center gap-2 text-xs font-semibold text-text-main"
				>
					<User class="text-scitech-cyan h-4 w-4" />
					<span>Pilih Dosen</span>
					<span class="text-red-400">*</span>
				</label>

				<select
					id="lecturer_id"
					name="lecturer_id"
					required
					disabled={isSubmitting}
					class="bg-scitech-navy focus:border-scitech-mint focus:ring-scitech-mint/20 w-full rounded-xl border border-border-color/10 px-4 py-3 text-xs text-text-main placeholder-text-muted transition-all focus:ring-2 focus:outline-none disabled:opacity-50"
				>
					<option
						value=""
						disabled
						selected={!(valueData?.lecturer_id ?? initialData?.lecturer_id)}
					>
						-- Pilih Dosen --
					</option>

					{#each lecturers as lecturer (lecturer.id)}
						<option
							value={lecturer.id}
							selected={(valueData?.lecturer_id ?? initialData?.lecturer_id) === lecturer.id}
						>
							{lecturer.name}
							{lecturer.nidn ? `(NIDN: ${lecturer.nidn})` : ''}
						</option>
					{/each}
				</select>
			</div>

			<!-- Field 2: SINTA Link (Optional) -->
			<div class="space-y-2">
				<label
					for="sinta_link"
					class="flex items-center gap-2 text-xs font-semibold text-text-main"
				>
					<LinkIcon class="text-scitech-cyan h-4 w-4" />
					<span>URL Profil SINTA</span>
				</label>

				<input
					type="url"
					id="sinta_link"
					name="sinta_link"
					value={valueData?.sinta_link ?? initialData?.sinta_link ?? ''}
					placeholder="Contoh: https://sinta.kemdikbud.go.id/authors/detail?id=XXXXXX"
					disabled={isSubmitting}
					class="bg-scitech-navy focus:border-scitech-mint focus:ring-scitech-mint/20 w-full rounded-xl border border-border-color/10 px-4 py-3 text-xs text-text-main placeholder-text-muted transition-all focus:ring-2 focus:outline-none disabled:opacity-50"
				/>
			</div>

			<!-- Field 3: Scholar Link (Optional) -->
			<div class="space-y-2">
				<label
					for="scholar_link"
					class="flex items-center gap-2 text-xs font-semibold text-text-main"
				>
					<BookOpen class="text-scitech-cyan h-4 w-4" />
					<span>URL Profil Google Scholar</span>
				</label>

				<input
					type="url"
					id="scholar_link"
					name="scholar_link"
					value={valueData?.scholar_link ?? initialData?.scholar_link ?? ''}
					placeholder="Contoh: https://scholar.google.com/citations?user=XXXXXX"
					disabled={isSubmitting}
					class="bg-scitech-navy focus:border-scitech-mint focus:ring-scitech-mint/20 w-full rounded-xl border border-border-color/10 px-4 py-3 text-xs text-text-main placeholder-text-muted transition-all focus:ring-2 focus:outline-none disabled:opacity-50"
				/>
			</div>

			<!-- Action Buttons -->
			<div class="flex items-center justify-end gap-3 border-t border-border-color/10 pt-6">
				<button
					type="button"
					onclick={() => history.back()}
					disabled={isSubmitting}
					class="bg-bg-primary/5 hover:bg-bg-primary/10 rounded-xl border border-border-color/10 px-5 py-2.5 text-xs font-semibold text-text-muted transition-all hover:text-text-main active:scale-95 disabled:opacity-50"
				>
					Batal
				</button>

				<button
					type="submit"
					disabled={isSubmitting}
					class="bg-scitech-mint text-scitech-navy shadow-scitech-mint/10 hover:bg-scitech-mint-hover inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
				>
					{#if isSubmitting}
						<Loader2Icon class="h-4 w-4 animate-spin" />
						<span>{isEdit ? 'Memperbarui...' : 'Menyimpan...'}</span>
					{:else}
						<Save class="h-4 w-4" />
						<span>{isEdit ? 'Update Data Dosen' : 'Simpan Data Dosen'}</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
