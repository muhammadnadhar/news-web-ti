<script lang="ts">
	import { enhance } from '$app/forms';
	import FormEditor from '$lib/components/admin/formEditor.svelte';
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import { UploadCloud, Plus, Edit, Trash2, Save } from 'lucide-svelte';

	let { data } = $props();

	// State Form Kiri (Konten Sejarah)
	let contentId = $state(data.historyContent?.id ?? crypto.randomUUID());
	let title = $state(data.historyContent?.title ?? 'Sejarah');
	let description = $state(data.historyContent?.description ?? '');
	let imageUrl = $state(data.historyContent?.image_url ?? null);
	let selectedFile = $state<File | null>(null);
	let previewUrl = $state<string | null>(data.historyContent?.image_url ?? null);

	// State Form Kanan (Pimpinan Jurusan)
	let searchQuery = $state('');
	let entriesPerPage = $state(10);
	let currentPage = $state(1);

	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			selectedFile = target.files[0];
			previewUrl = URL.createObjectURL(target.files[0]);
		}
	}

	// Filter & Pagination Periode Pimpinan
	let filteredLeaders = $derived(
		(data.historyLeaders || []).filter((item) =>
			item.period.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);
	let totalEntries = $derived(filteredLeaders.length);
	let totalPages = $derived(Math.ceil(totalEntries / entriesPerPage) || 1);
	let startIndex = $derived((currentPage - 1) * entriesPerPage);
	let paginatedLeaders = $derived(filteredLeaders.slice(startIndex, startIndex + entriesPerPage));
</script>

<div class="space-y-6 p-6 lg:p-10">
	<!-- HEADER TITLE -->
	<div class="border-scitech-slate/20 border-b pb-4">
		<h1 class="text-2xl font-bold tracking-tight text-white">Sejarah</h1>
	</div>

	<!-- GRID 2 KOLOM (KIRI: KONTEN SEJARAH, KANAN: PIMPINAN JURUSAN) -->
	<div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
		<!-- ================= BAGIAN KIRI: FORM UBAH DATA SEJARAH ================= -->
		<div
			class="border-scitech-slate/20 bg-scitech-navy-glare space-y-6 rounded-2xl border p-6 shadow-xl lg:col-span-6"
		>
			<h2 class="text-scitech-mint text-sm font-semibold">Form Ubah Data Sejarah</h2>

			<form
				method="POST"
				action="?/saveContent"
				enctype="multipart/form-data"
				use:enhance
				class="space-y-6"
			>
				<input type="hidden" name="id" value={contentId} />
				<input type="hidden" name="existing_image_url" value={imageUrl ?? ''} />

				<!-- JUDUL & FOTO ROW -->
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="space-y-2">
						<label for="title" class="text-xs font-medium text-text-main">
							Judul Sejarah<span class="text-scitech-error">*</span>
						</label>
						<input
							id="title"
							name="title"
							type="text"
							bind:value={title}
							required
							class="border-scitech-slate/30 bg-scitech-navy focus:border-scitech-mint w-full rounded-xl border px-3 py-2 text-xs text-text-main focus:outline-none"
						/>
					</div>

					<div class="space-y-2">
						<label for="image" class="text-xs font-medium text-text-main">Foto</label>
						<div class="flex items-center gap-2">
							<label
								for="image"
								class="bg-scitech-slate hover:bg-scitech-slate/80 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-text-main"
							>
								<UploadCloud class="text-scitech-cyan h-3.5 w-3.5" />
								<span>Browse...</span>
							</label>
							<input
								id="image"
								name="image"
								type="file"
								accept="image/*"
								onchange={handleFileSelect}
								class="hidden"
							/>
							<span class="truncate text-[11px] text-text-muted"
								>{selectedFile ? selectedFile.name : 'No file selected.'}</span
							>
						</div>
					</div>
				</div>

				<!-- PREVIEW FOTO -->
				{#if previewUrl}
					<div
						class="border-scitech-slate/30 bg-scitech-navy relative overflow-hidden rounded-xl border p-2"
					>
						<img
							src={previewUrl}
							alt="Foto Sejarah"
							class="max-h-48 w-full rounded-lg object-cover"
						/>
					</div>
				{/if}

				<!-- ISI SEJARAH (FORM EDITOR) -->
				<div class="space-y-2">
					<label for="description" class="text-xs font-medium text-text-main">
						Isi Sejarah<span class="text-scitech-error">*</span>
					</label>
					<FormEditor bind:value={description} />
					<textarea name="description" class="hidden" bind:value={description}></textarea>
				</div>

				<button
					type="submit"
					class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all active:scale-95"
				>
					<Save class="h-4 w-4" />
					<span>Simpan Sejarah</span>
				</button>
			</form>
		</div>

		<!-- ================= BAGIAN KANAN: DATA SEJARAH PIMPINAN JURUSAN ================= -->
		<div
			class="border-scitech-slate/20 bg-scitech-navy-glare space-y-4 rounded-2xl border p-6 shadow-xl lg:col-span-6"
		>
			<div class="border-scitech-slate/10 flex items-center justify-between border-b pb-4">
				<h2 class="text-scitech-mint text-sm font-semibold">Data Sejarah Pimpinan Jurusan</h2>
				<button
					type="button"
					class="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white shadow-md transition-all hover:bg-emerald-600 active:scale-95"
				>
					<Plus class="h-3.5 w-3.5" />
					<span>+ Periode</span>
				</button>
			</div>

			<!-- SEARCH & SHOW ENTRIES -->
			<div
				class="flex flex-col gap-4 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between"
			>
				<div class="flex items-center gap-2">
					<span>Show</span>
					<select
						bind:value={entriesPerPage}
						class="bg-scitech-navy border-scitech-slate/30 rounded-lg border px-2 py-1 text-text-main"
					>
						<option value={10}>10</option>
						<option value={25}>25</option>
					</select>
					<span>entries</span>
				</div>

				<div class="flex items-center gap-2">
					<span>Search:</span>
					<input
						type="text"
						bind:value={searchQuery}
						class="bg-scitech-navy border-scitech-slate/30 rounded-lg border px-3 py-1 text-text-main focus:outline-none"
					/>
				</div>
			</div>

			<!-- TABLE CONTENT -->
			<TableContent>
				{#snippet header()}
					<tr>
						<th class="p-3 text-left font-semibold">Periode</th>
						<th class="w-24 p-3 text-center font-semibold">Menu</th>
					</tr>
				{/snippet}

				{#snippet body()}
					{#if paginatedLeaders.length === 0}
						<tr>
							<td colspan="2" class="p-6 text-center text-text-muted">
								Tidak ada data periode ditemukan.
							</td>
						</tr>
					{:else}
						{#each paginatedLeaders as leader}
							<tr class="border-scitech-slate/10 border-b transition-colors hover:bg-white/5">
								<td class="p-3 font-medium text-text-main">{leader.period}</td>
								<td class="p-3 text-center">
									<div class="flex items-center justify-center gap-1">
										<button
											type="button"
											class="rounded bg-cyan-500 p-1.5 text-white hover:bg-cyan-600"
										>
											<Edit class="h-3.5 w-3.5" />
										</button>

										<form method="POST" action="?/deleteLeader" use:enhance class="inline">
											<input type="hidden" name="id" value={leader.id} />
											<button
												type="submit"
												class="rounded bg-rose-500 p-1.5 text-white hover:bg-rose-600"
											>
												<Trash2 class="h-3.5 w-3.5" />
											</button>
										</form>
									</div>
								</td>
							</tr>
						{/each}
					{/if}
				{/snippet}

				{#snippet footer()}
					<tr>
						<th class="p-3 text-left font-semibold">Periode</th>
						<th class="p-3 text-center font-semibold">Menu</th>
					</tr>
				{/snippet}
			</TableContent>

			<!-- PAGINATION FOOTER -->
			<div
				class="flex flex-col gap-4 pt-2 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between"
			>
				<div>
					Showing {totalEntries === 0 ? 0 : startIndex + 1} to {Math.min(
						startIndex + entriesPerPage,
						totalEntries
					)} of {totalEntries} entries
				</div>

				<div class="flex items-center gap-1">
					<button
						type="button"
						disabled={currentPage === 1}
						onclick={() => currentPage--}
						class="border-scitech-slate/30 rounded border px-3 py-1.5 disabled:opacity-40"
					>
						Previous
					</button>

					<button
						type="button"
						class="rounded border border-indigo-600 bg-indigo-600 px-3 py-1.5 font-medium text-white"
					>
						{currentPage}
					</button>

					<button
						type="button"
						disabled={currentPage === totalPages}
						onclick={() => currentPage++}
						class="border-scitech-slate/30 rounded border px-3 py-1.5 disabled:opacity-40"
					>
						Next
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
