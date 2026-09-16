<script lang="ts">
	import { enhance } from '$app/forms';
	import Message, { type MessageStatus } from '$lib/components/admin/message.svelte';
	import {
		TrendingUp,
		User,
		GraduationCap,
		Calendar,
		ArrowLeft,
		Save,
		Loader2,
		Award
	} from 'lucide-svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	// State Form
	let isSubmitting = $state(false);
	let showMessage = $state(false);

	let messageConfig = $state<{
		status: MessageStatus;
		title: string;
		message: string;
	}>({
		status: 'info',
		title: '',
		message: ''
	});

	function triggerMessage(status: MessageStatus, title: string, message: string) {
		messageConfig = { status, title, message };
		showMessage = true;
	}
</script>

<div class="mx-auto max-w-4xl space-y-6 p-4 md:p-6">
	<!-- Header Section -->
	<header
		class="flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between"
	>
		<div>
			<div class="flex items-center gap-2">
				<a
					href="/admin/mahasiswa/ipk-tertinggi"
					class="mb-1 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-800"
				>
					<ArrowLeft class="h-4 w-4" />
					Kembali ke Daftar IPK Tertinggi
				</a>
			</div>
			<h1 class="flex items-center gap-2 text-2xl font-bold text-slate-800">
				<TrendingUp class="h-7 w-7 text-emerald-600" />
				Tambah Mahasiswa IPK Tertinggi
			</h1>
			<p class="text-sm text-slate-500">
				Formulir pendataan mahasiswa dengan perolehan Indeks Prestasi Kumulatif (IPK) tertinggi.
			</p>
		</div>
	</header>

	<!-- Message Component Notification -->
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

	<!-- Form Card -->
	<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
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
							(result.data.message as string) || 'Data berhasil disimpan!'
						);
						await update({ reset: true });
					} else if (result.type === 'failure' && result.data) {
						triggerMessage(
							'error',
							(result.data.title as string) || 'Gagal Menyimpan',
							(result.data.message as string) || 'Terjadi kesalahan saat memproses data.'
						);
						await update({ reset: false });
					} else {
						triggerMessage('error', 'Error', 'Terjadi kesalahan koneksi/sistem.');
						await update({ reset: false });
					}
				};
			}}
		>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- Nama Mahasiswa -->
				<div class="space-y-2 md:col-span-2">
					<label for="student_name" class="block text-sm font-semibold text-slate-700">
						Nama Mahasiswa <span class="text-rose-500">*</span>
					</label>
					<div class="relative rounded-lg shadow-sm">
						<div
							class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"
						>
							<User class="h-5 w-5" />
						</div>
						<input
							type="text"
							id="student_name"
							name="student_name"
							value={form?.values?.studentName || ''}
							placeholder="Masukkan nama lengkap mahasiswa..."
							required
							disabled={isSubmitting}
							class="block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-800 transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
						/>
					</div>
				</div>

				<!-- IPK (Decimal 3,2) -->
				<div class="space-y-2">
					<label for="gpa" class="block text-sm font-semibold text-slate-700">
						Indeks Prestasi Kumulatif (IPK) <span class="text-rose-500">*</span>
					</label>
					<div class="relative rounded-lg shadow-sm">
						<div
							class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"
						>
							<Award class="h-5 w-5" />
						</div>
						<input
							type="number"
							id="gpa"
							name="gpa"
							step="0.01"
							min="0.00"
							max="4.00"
							value={form?.values?.gpa || ''}
							placeholder="Contoh: 3.95"
							required
							disabled={isSubmitting}
							class="block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-800 transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
						/>
					</div>
					<p class="text-xs text-slate-500">Gunakan titik (.) untuk desimal, maksimal 4.00</p>
				</div>

				<!-- Angkatan -->
				<div class="space-y-2">
					<label for="batch_year" class="block text-sm font-semibold text-slate-700">
						Tahun Angkatan <span class="text-rose-500">*</span>
					</label>
					<div class="relative rounded-lg shadow-sm">
						<div
							class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"
						>
							<GraduationCap class="h-5 w-5" />
						</div>
						<input
							type="text"
							id="batch_year"
							name="batch_year"
							value={form?.values?.batchYear || ''}
							placeholder="Contoh: 2024"
							required
							disabled={isSubmitting}
							class="block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-800 transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
						/>
					</div>
				</div>

				<!-- Semester -->
				<div class="space-y-2 md:col-span-2">
					<label for="semester" class="block text-sm font-semibold text-slate-700">
						Semester <span class="text-rose-500">*</span>
					</label>
					<div class="relative rounded-lg shadow-sm">
						<div
							class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"
						>
							<Calendar class="h-5 w-5" />
						</div>
						<input
							type="text"
							id="semester"
							name="semester"
							value={form?.values?.semester || ''}
							placeholder="Contoh: Semester Ganjil 2025/2026 atau 2024"
							required
							disabled={isSubmitting}
							class="block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-800 transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
						/>
					</div>
				</div>
			</div>

			<!-- Form Actions -->
			<div class="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
				<button
					type="button"
					onclick={() => history.back()}
					disabled={isSubmitting}
					class="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 focus:ring-2 focus:ring-slate-200 focus:outline-none disabled:opacity-50"
				>
					Batal
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-text-main shadow-sm transition-all hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500/50 focus:outline-none disabled:opacity-50"
				>
					{#if isSubmitting}
						<Loader2 class="h-4 w-4 animate-spin" />
						<span>Menyimpan...</span>
					{:else}
						<Save class="h-4 w-4" />
						<span>Simpan Data IPK</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
