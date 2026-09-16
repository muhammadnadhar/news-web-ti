<script lang="ts">
	import { enhance } from '$app/forms';
	import Message, { type MessageStatus } from '$lib/components/admin/message.svelte';
	import {
		Award,
		User,
		GraduationCap,
		Calendar,
		BookOpen,
		ArrowLeft,
		Save,
		Loader2,
		Sparkles
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
					href="/admin/mahasiswa/prestasi"
					class="mb-1 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-800"
				>
					<ArrowLeft class="h-4 w-4" />
					Kembali ke Daftar Prestasi
				</a>
			</div>
			<h1 class="flex items-center gap-2 text-2xl font-bold text-slate-800">
				<Award class="h-7 w-7 text-indigo-600" />
				Tambah Prestasi Mahasiswa
			</h1>
			<p class="text-sm text-slate-500">
				Isi formulir berikut untuk menambahkan riwayat prestasi akademik atau non-akademik
				mahasiswa.
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
							class="block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-800 transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
						/>
					</div>
				</div>

				<!-- Nama Prestasi -->
				<div class="space-y-2 md:col-span-2">
					<label for="achievement_name" class="block text-sm font-semibold text-slate-700">
						Nama / Judul Prestasi <span class="text-rose-500">*</span>
					</label>
					<div class="relative rounded-lg shadow-sm">
						<div class="pointer-events-none absolute top-3 left-3 flex items-center text-slate-400">
							<Sparkles class="h-5 w-5" />
						</div>
						<textarea
							id="achievement_name"
							name="achievement_name"
							rows="3"
							placeholder="Contoh: Juara 1 Lomba Karya Tulis Ilmiah Nasional (LKTIN) 2026"
							required
							disabled={isSubmitting}
							class="block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-800 transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
							>{form?.values?.achievementName || ''}</textarea
						>
					</div>
				</div>

				<!-- Jenis Prestasi (Kategori) -->
				<div class="space-y-2 md:col-span-2">
					<label class="block text-sm font-semibold text-slate-700">
						Kategori Prestasi <span class="text-rose-500">*</span>
					</label>
					<div class="grid grid-cols-2 gap-4">
						<label
							class="flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition-all hover:bg-slate-50 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50/60 has-[:checked]:ring-1 has-[:checked]:ring-indigo-500"
						>
							<div class="flex items-center gap-3">
								<BookOpen class="h-5 w-5 text-indigo-600" />
								<div>
									<div class="text-sm font-medium text-slate-800">Akademik</div>
									<div class="text-xs text-slate-500">Lomba Ilmiah, Olimipade, dll.</div>
								</div>
							</div>
							<input
								type="radio"
								name="is_academic"
								value="y"
								checked={(form?.values?.isAcademic ?? 'y') === 'y'}
								disabled={isSubmitting}
								class="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
							/>
						</label>

						<label
							class="flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition-all hover:bg-slate-50 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50/60 has-[:checked]:ring-1 has-[:checked]:ring-indigo-500"
						>
							<div class="flex items-center gap-3">
								<Award class="h-5 w-5 text-amber-600" />
								<div>
									<div class="text-sm font-medium text-slate-800">Non-Akademik</div>
									<div class="text-xs text-slate-500">Seni, Olahraga, Organisasi, dll.</div>
								</div>
							</div>
							<input
								type="radio"
								name="is_academic"
								value="n"
								checked={form?.values?.isAcademic === 'n'}
								disabled={isSubmitting}
								class="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
							/>
						</label>
					</div>
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
							class="block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-800 transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
						/>
					</div>
				</div>

				<!-- Semester -->
				<div class="space-y-2">
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
							placeholder="Contoh: Semester Ganjil 2025/2026"
							required
							disabled={isSubmitting}
							class="block w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pr-4 pl-10 text-sm text-slate-800 transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
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
					class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-text-main shadow-sm transition-all hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none disabled:opacity-50"
				>
					{#if isSubmitting}
						<Loader2 class="h-4 w-4 animate-spin" />
						<span>Menyimpan...</span>
					{:else}
						<Save class="h-4 w-4" />
						<span>Simpan Prestasi</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
