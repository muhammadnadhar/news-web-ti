<script lang="ts">
	import { enhance } from '$app/forms';
	import Message, { type MessageStatus } from '$lib/components/admin/message.svelte';
	import type { SemesterDTO } from '$lib/dto/admin/dataset';
	import type { ResponseMessage } from '$lib/types/message';
	import type { SemesterFormValues } from '$lib/types/values/admin/dataset';
	import { ArrowLeft, BookOpen, Calendar, CheckCircle2, Loader2, Save } from 'lucide-svelte';

	interface Props {
		valuesData?: SemesterFormValues | null;
		initialData?: SemesterDTO | null;
		isEdit?: boolean;
		title?: string;
		backUrl?: string;
	}

	let {
		valuesData,
		initialData = null,
		isEdit = false,
		title = isEdit ? 'Edit Semester' : 'Tambah Semester Baru',
		backUrl = '/admin/akademik/semester'
	}: Props = $props();

	// State internal form
	let isActive = $state(initialData?.is_active ?? valuesData?.isActive ?? false);
	let isSubmitting = $state(false);
	let showMessage = $state(false);

	let messageConfig = $state<ResponseMessage>({
		status: 'info',
		title: '',
		message: ''
	});

	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}

	// Re-sync status checkbox jika data awal berubah
	$effect(() => {
		if (initialData) {
			isActive = initialData.is_active ?? false;
		}
	});
</script>

<div class="mx-auto max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
	<header class="space-y-2">
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-extrabold tracking-tight text-slate-900">
				{title}
			</h1>
		</div>
		<p class="text-sm text-text-main">
			{isEdit
				? 'Ubah informasi detail periode akademik semester.'
				: 'Lengkapi detail berikut untuk menambahkan periode akademik baru.'}
		</p>
	</header>

	<!-- Notifikasi Pesan -->
	{#if showMessage}
		<div class="transition-all duration-300">
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

	<!-- Card Utama Form -->
	<div
		class="borderborder-border-color rounded-2xl bg-bg-secondary p-6 shadow-[0_4px_25px_rgba(0,0,0,0.04)] sm:p-8"
	>
		<form
			method="POST"
			class="space-y-6"
			use:enhance={() => {
				isSubmitting = true;
				showMessage = false;

				return async ({ result, update }) => {
					isSubmitting = false;

					if (result.type === 'success') {
						triggerMessage(
							'success',
							(result?.data.title as string) || 'Berhasil',
							(result?.data.message as string) ||
								(isEdit ? 'Data semester berhasil diperbarui!' : 'Data semester berhasil disimpan!')
						);

						if (!isEdit) {
							isActive = false;
							await update({ reset: true });
						} else {
							await update({ reset: false });
						}
					} else if (result.type === 'failure' && result.data) {
						triggerMessage(
							'error',
							(result.data.title as string) || 'Gagal',
							(result.data.message as string) || 'Terjadi kesalahan saat memproses data.'
						);
						await update({ reset: false });
					} else {
						triggerMessage('error', 'Error', 'Terjadi kesalahan sistem saat memproses data.');
						await update();
					}
				};
			}}
		>
			<!-- Field: Nama Semester -->
			<div class="space-y-2">
				<label for="name" class="block text-xs font-bold tracking-wider text-text-main uppercase">
					Nama Semester <span class="text-rose-500">*</span>
				</label>
				<div class="relative">
					<div
						class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400"
					>
						<BookOpen class="h-4 w-4" />
					</div>
					<input
						type="text"
						id="name"
						name="name"
						value={valuesData?.name ?? initialData?.name ?? ''}
						placeholder="Contoh: Semester Ganjil 2026/2027"
						required
						disabled={isSubmitting}
						class="borderborder-border-color w-full rounded-xl bg-bg-primary/60 py-3 pr-4 pl-10 text-sm font-medium text-slate-800 transition-all placeholder:font-normal placeholder:text-slate-400 focus:border-slate-900 focus:bg-bg-secondary focus:ring-2 focus:ring-slate-900 focus:outline-none disabled:opacity-50"
					/>
				</div>
			</div>

			<!-- Field: Tahun Ajaran -->
			<div class="space-y-2">
				<label
					for="academic_year"
					class="block text-xs font-bold tracking-wider text-text-main uppercase"
				>
					Tahun Ajaran <span class="text-rose-500">*</span>
				</label>
				<div class="relative">
					<div
						class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400"
					>
						<Calendar class="h-4 w-4" />
					</div>
					<input
						type="text"
						id="academic_year"
						name="academic_year"
						value={valuesData?.academicYear ?? initialData?.academic_year ?? ''}
						placeholder="Contoh: 2026/2027 atau ganjil26-27"
						required
						disabled={isSubmitting}
						class="borderborder-border-color w-full rounded-xl bg-bg-primary/60 py-3 pr-4 pl-10 text-sm font-medium text-slate-800 transition-all placeholder:font-normal placeholder:text-slate-400 focus:border-slate-900 focus:bg-bg-secondary focus:ring-2 focus:ring-slate-900 focus:outline-none disabled:opacity-50"
					/>
				</div>
				<p class="text-xs text-slate-400">Format standar penulisan tahun ajaran akademik.</p>
			</div>

			<!-- Field: Status Aktif (Desain Switch Card) -->
			<div class="pt-2">
				<label
					for="is_active"
					class={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all ${
						isActive
							? 'border-slate-900/20 bg-bg-primary/5'
							: 'border-border-color bg-bg-primary/50 hover:border-border-color'
					}`}
				>
					<div class="mt-0.5 flex h-6 items-center">
						<input
							type="checkbox"
							id="is_active"
							name="is_active"
							bind:checked={isActive}
							disabled={isSubmitting}
							class="roundedborder-border-color h-4 w-4 text-slate-900 transition focus:ring-slate-900"
						/>
					</div>
					<div class="space-y-0.5">
						<div class="flex items-center gap-2">
							<span class="text-sm font-bold text-slate-800">Set sebagai Semester Aktif</span>
							{#if isActive}
								<span
									class="inline-flex items-center gap-1 rounded-full bg-emerald-100/70 px-2 py-0.5 text-[11px] font-semibold text-emerald-700"
								>
									<CheckCircle2 class="h-3 w-3" /> Aktif
								</span>
							{/if}
						</div>
						<p class="text-xs text-text-main">
							Jika diaktifkan, semester ini akan dijadikan patokan utama perkuliahan saat ini.
						</p>
					</div>
				</label>
			</div>

			<div class="border-tborder-border-color flex items-center justify-end gap-3 pt-6">
				<button
					type="button"
					onclick={() => history.back()}
					disabled={isSubmitting}
					class="rounded-xl bg-bg-secondary px-5 py-2.5 text-xs font-bold tracking-wider text-text-main uppercase transition-all hover:bg-bg-secondary disabled:opacity-50"
				>
					Batal
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					class="inline-flex items-center gap-2 rounded-xl bg-bg-primary px-6 py-2.5 text-xs font-bold tracking-wider text-text-main uppercase shadow-sm transition-all hover:bg-slate-800 disabled:opacity-50"
				>
					{#if isSubmitting}
						<Loader2 class="h-4 w-4 animate-spin" />
						<span>{isEdit ? 'Memperbarui...' : 'Menyimpan...'}</span>
					{:else}
						<Save class="h-4 w-4" />
						<span>{isEdit ? 'Perbarui Data Semester' : 'Simpan Data Semester'}</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
