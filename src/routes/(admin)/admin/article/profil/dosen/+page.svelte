<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import TableContent from '$lib/components/admin/tableContent.svelte';
	import { Plus, Edit, Trash2 } from 'lucide-svelte';

	let { data } = $props();

	// State untuk Search dan Pagination
	let searchQuery = $state('');
	let entriesPerPage = $state(10);
	let currentPage = $state(1);

	// Filter data berdasarkan query pencarian
	let filteredData = $derived(
		(data.lecturerStaffList || []).filter((item) => {
			const query = searchQuery.toLowerCase();
			return (
				item.name.toLowerCase().includes(query) ||
				(item.nidn && item.nidn.toLowerCase().includes(query)) ||
				item.expertise.toLowerCase().includes(query)
			);
		})
	);

	const addUrl = $derived.by(() => {
		const currentPath = page.url.pathname;
		// Jika sudah di halaman /add, tetap di halaman itu. Jika belum, tambahkan /add
		return currentPath.endsWith('/add') ? currentPath : `${currentPath}/add`;
	});

	// Pagination Math
	let totalEntries = $derived(filteredData.length);
	let totalPages = $derived(Math.ceil(totalEntries / entriesPerPage) || 1);
	let startIndex = $derived((currentPage - 1) * entriesPerPage);
	let paginatedData = $derived(filteredData.slice(startIndex, startIndex + entriesPerPage));
</script>

<div class="space-y-6 p-6 lg:p-10">
	<!-- HEADER BAR -->
	<div class="border-scitech-slate/20 border-b pb-4">
		<h1 class="text-2xl font-bold tracking-tight text-text-main">Dosen & Staff</h1>
	</div>

	<div
		class="border-scitech-slate/20 bg-scitech-navy-glare space-y-4 rounded-2xl border p-6 shadow-xl"
	>
		<div class="border-scitech-slate/10 flex items-center justify-between border-b pb-4">
			<h2 class="text-scitech-cyan text-sm font-semibold">Data Dosen & Staff</h2>
			<button
				type="button"
				class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-text-main shadow-md transition-all hover:bg-indigo-700 active:scale-95"
				onclick={() => goto(addUrl)}
			>
				<Plus class="h-4 w-4" />
				<span>+ Dosen & Staff</span>
			</button>
		</div>

		<!-- CONTROLS: ENTRIES & SEARCH -->
		<div
			class="flex flex-col gap-4 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between"
		>
			<div class="flex items-center gap-2">
				<span>Show</span>
				<select
					bind:value={entriesPerPage}
					class="bg-scitech-navy border-scitech-slate/30 rounded-lg border px-2 py-1 text-text-main focus:outline-none"
				>
					<option value={10}>10</option>
					<option value={25}>25</option>
					<option value={50}>50</option>
				</select>
				<span>entries</span>
			</div>

			<div class="flex items-center gap-2">
				<span>Search:</span>
				<input
					type="text"
					bind:value={searchQuery}
					class="bg-scitech-navy border-scitech-slate/30 focus:border-scitech-mint rounded-lg border px-3 py-1 text-text-main focus:outline-none"
				/>
			</div>
		</div>

		<!-- TABLE CONTENT -->
		<TableContent>
			{#snippet header()}
				<tr>
					<th class="p-3 text-left font-semibold">Nama</th>
					<th class="p-3 text-left font-semibold">NIDN</th>
					<th class="p-3 text-left font-semibold">Bidang</th>
					<th class="w-24 p-3 text-center font-semibold">Menu</th>
				</tr>
			{/snippet}

			{#snippet body()}
				{#if paginatedData.length === 0}
					<tr>
						<td colspan="4" class="p-6 text-center text-text-muted">
							Tidak ada data dosen atau staff ditemukan.
						</td>
					</tr>
				{:else}
					{#each paginatedData as item}
						<tr class="border-scitech-slate/10 border-b transition-colors hover:bg-white/5">
							<td class="p-3 font-medium text-text-main">{item.name}</td>
							<td class="p-3 text-text-muted">{item.nidn || '-'}</td>
							<td class="p-3 text-text-muted">{item.expertise}</td>
							<td class="p-3 text-center">
								<div class="flex items-center justify-center gap-1">
									<!-- BUTTON EDIT -->
									<button
										type="button"
										class="rounded bg-cyan-500 p-1.5 text-text-main transition-all hover:bg-cyan-600"
										title="Edit Data"
									>
										<Edit class="h-3.5 w-3.5" />
									</button>

									<!-- BUTTON DELETE -->
									<form method="POST" action="?/delete" use:enhance class="inline">
										<input type="hidden" name="id" value={item.id} />
										<button
											type="submit"
											class="rounded bg-rose-500 p-1.5 text-text-main transition-all hover:bg-rose-600"
											title="Hapus Data"
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
					<th class="p-3 text-left font-semibold">Nama</th>
					<th class="p-3 text-left font-semibold">NIDN</th>
					<th class="p-3 text-left font-semibold">Bidang</th>
					<th class="p-3 text-center font-semibold">Menu</th>
				</tr>
			{/snippet}
		</TableContent>

		<!-- PAGINATION FOOTER -->
		<!-- <div -->
		<!-- 	class="flex flex-col gap-4 pt-2 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between" -->
		<!-- > -->
		<!-- 	<div> -->
		<!-- 		Showing {totalEntries === 0 ? 0 : startIndex + 1} to {Math.min( -->
		<!-- 			startIndex + entriesPerPage, -->
		<!-- 			totalEntries -->
		<!-- 		)} of {totalEntries} entries -->
		<!-- 	</div> -->
		<!---->
		<!-- 	<div class="flex items-center gap-1"> -->
		<!-- 		<button -->
		<!-- 			type="button" -->
		<!-- 			disabled={currentPage === 1} -->
		<!-- 			onclick={() => currentPage--} -->
		<!-- 			class="border-scitech-slate/30 rounded border px-3 py-1.5 hover:bg-white/5 disabled:opacity-40" -->
		<!-- 		> -->
		<!-- 			Previous -->
		<!-- 		</button> -->
		<!---->
		<!-- 		{#each Array(totalPages) as _, i} -->
		<!-- 			<button -->
		<!-- 				type="button" -->
		<!-- 				onclick={() => (currentPage = i + 1)} -->
		<!-- 				class="border-scitech-slate/30 rounded border px-3 py-1.5 {currentPage === i + 1 -->
		<!-- 					? 'border-indigo-600 bg-indigo-600 text-text-main' -->
		<!-- 					: 'hover:bg-white/5'}" -->
		<!-- 			> -->
		<!-- 				{i + 1} -->
		<!-- 			</button> -->
		<!-- 		{/each} -->
		<!---->
		<!-- 		<button -->
		<!-- 			type="button" -->
		<!-- 			disabled={currentPage === totalPages} -->
		<!-- 			onclick={() => currentPage++} -->
		<!-- 			class="border-scitech-slate/30 rounded border px-3 py-1.5 hover:bg-white/5 disabled:opacity-40" -->
		<!-- 		> -->
		<!-- 			Next -->
		<!-- 		</button> -->
		<!-- 	</div> -->
		<!-- </div> -->
	</div>
</div>
