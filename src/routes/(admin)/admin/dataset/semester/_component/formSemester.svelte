<script lang="ts">
	import { enhance } from '$app/forms';
	import Message, { type MessageStatus } from '$lib/components/admin/message.svelte';
	import type { ResponseMessage } from '$lib/types/message';
	import { ArrowLeft, BookOpen, Calendar, CheckCircle2, Loader2, Save } from 'lucide-svelte';

	interface Props {
		form?: any;
		initialData?: {
			name?: string;
			academicYear?: string;
			isActive?: boolean;
		} | null;
		isEdit?: boolean;
		title?: string;
		backUrl?: string;
	}

	let {
		form = null,
		initialData = null,
		isEdit = false,
		title = isEdit ? 'Edit Semester' : 'Tambah Semester Baru',
		backUrl = '/admin/akademik/semester'
	}: Props = $props();

	// State internal form
	let isActive = $state(initialData?.isActive ?? form?.values?.isActive ?? false);
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
			isActive = initialData.isActive ?? false;
		}
	});
</script>

<div class="mx-auto max-w-3xl space-y-6 p-4 sm:p-6 lg:p-8">
	<!-- Header -->
	<header class="space-y-2">
		<a
			href={backUrl}
			class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
		>
			<ArrowLeft class="h-4 w-4" />
			Kembali ke Daftar Semester
		</a>

		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-extrabold tracking-tight text-slate-900">
				{title}
			</h1>
		</div>
		<p class="text-sm text-slate-500">
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
		class="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.04)] sm:p-8"
	>
		<form
			method="POST"
			class="space-y-6"
			use:enhance={() => {
				isSubmitting = true;
				showMessage = false;

				return async ({ result, update }) => {
					isSubmitting = false;

					if (result.type === 'success' && result.data?.success) {
						triggerMessage(
							'success',
							(result.data.title as string) || 'Berhasil',
							(result.data.message as string) ||
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
						await update({ reset: false });
					}
				};
			}}
		>
			<!-- Field: Nama Semester -->
			<div class="space-y-2">
				<label for="name" class="block text-xs font-bold tracking-wider text-slate-600 uppercase">
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
						value={form?.values?.name ?? initialData?.name ?? ''}
						placeholder="Contoh: Semester Ganjil 2026/2027"
						required
						disabled={isSubmitting}
						class="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pr-4 pl-10 text-sm font-medium text-slate-800 transition-all placeholder:font-normal placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none disabled:opacity-50"
					/>
				</div>
			</div>

			<!-- Field: Tahun Ajaran -->
			<div class="space-y-2">
				<label
					for="academic_year"
					class="block text-xs font-bold tracking-wider text-slate-600 uppercase"
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
						value={form?.values?.academicYear ?? initialData?.academicYear ?? ''}
						placeholder="Contoh: 2026/2027 atau ganjil26-27"
						required
						disabled={isSubmitting}
						class="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pr-4 pl-10 text-sm font-medium text-slate-800 transition-all placeholder:font-normal placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900 focus:outline-none disabled:opacity-50"
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
							? 'border-slate-900/20 bg-slate-900/5'
							: 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
					}`}
				>
					<div class="mt-0.5 flex h-6 items-center">
						<input
							type="checkbox"
							id="is_active"
							name="is_active"
							bind:checked={isActive}
							disabled={isSubmitting}
							class="h-4 w-4 rounded border-slate-300 text-slate-900 transition focus:ring-slate-900"
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
						<p class="text-xs text-slate-500">
							Jika diaktifkan, semester ini akan dijadikan patokan utama perkuliahan saat ini.
						</p>
					</div>
				</label>
			</div>

			<!-- Action Buttons -->
			<div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
				<button
					type="button"
					onclick={() => history.back()}
					disabled={isSubmitting}
					class="rounded-xl bg-slate-100 px-5 py-2.5 text-xs font-bold tracking-wider text-slate-600 uppercase transition-all hover:bg-slate-200 disabled:opacity-50"
				>
					Batal
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold tracking-wider text-text-main uppercase shadow-sm transition-all hover:bg-slate-800 disabled:opacity-50"
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
