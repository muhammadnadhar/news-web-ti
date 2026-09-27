<script lang="ts">
	//
	// Di sini data user menggunaka Tbale Manula bukan Component TableContent
	//

	import {
		UserPlus,
		Search,
		ArrowUpDown,
		Edit3,
		Trash2,
		ShieldCheck,
		ChevronLeft,
		ChevronRight,
		Users,
		AlertTriangle
	} from 'lucide-svelte';
	import type { PageData } from './$types';
	import { gotoEdit, mergeNewPath } from '$lib/utils';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { Author } from '$lib/constants';
	import Message from '$lib/components/admin/message.svelte';
	import type { ResponseMessage } from '$lib/types/message';

	let { data }: { data: PageData } = $props();

	// State Management Svelte 5 Runes
	let searchQuery = $state('');
	let entriesPerPage = $state(10);
	let currentPage = $state(1);
	let sortColumn = $state<'name' | 'username' | 'role'>('name');
	let sortDirection = $state<'asc' | 'desc'>('asc');

	// Modal & Delete State
	let selectedUserForDelete = $state<string | null>(null);
	let isDeleting = $state(false);

	// User yang dipilih untuk dihapus (Derived State)
	let userToDelete = $derived(data.users.find((user) => user.id === selectedUserForDelete));

	// Computed / Derived State untuk Filter & Sorting
	let filteredUsers = $derived(
		data.users.filter((user) => {
			const q = searchQuery.toLowerCase();
			return (
				user.name.toLowerCase().includes(q) ||
				user.username.toLowerCase().includes(q) ||
				user.role.toLowerCase().includes(q)
			);
		})
	);

	let sortedUsers = $derived(
		[...filteredUsers].sort((a, b) => {
			const fieldA = a[sortColumn].toLowerCase();
			const fieldB = b[sortColumn].toLowerCase();
			if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
			if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
			return 0;
		})
	);

	// Pagination Calculated State
	let totalPages = $derived(Math.ceil(sortedUsers.length / entriesPerPage) || 1);
	let paginatedUsers = $derived(
		sortedUsers.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)
	);

	function toggleSort(column: 'name' | 'username' | 'role') {
		if (sortColumn === column) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortColumn = column;
			sortDirection = 'asc';
		}
	}

	// Message / Toast Notification State
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

	// Eksekusi Hapus User
	async function confirmDelete() {
		if (!selectedUserForDelete) return;

		isDeleting = true;
		const formData = new FormData();
		formData.append('id', selectedUserForDelete);

		try {
			// Sesuaikan endpoint API hapus user Anda
			const res = await fetch('?/deleteUser', {
				method: 'POST',
				body: formData
			});

			if (res.ok) {
				triggerMessage('success', 'Berhasil', 'User berhasil dihapus dari sistem.');
				await invalidateAll(); // Refresh data dari server
			} else {
				const errData = await res.json().catch(() => ({}));
				triggerMessage('error', 'Gagal Hapus', errData.message || 'Gagal menghapus user.');
			}
		} catch (error) {
			triggerMessage('error', 'Kesalahan Sistem', 'Terjadi kesalahan koneksi saat menghapus user.');
		} finally {
			isDeleting = false;
			selectedUserForDelete = null;
		}
	}

	function getRoleBadgeStyle(role: string) {
		switch (role) {
			case 'Administrator':
				return 'bg-scitech-mint/15 text-scitech-mint border-scitech-mint/40 shadow-sm shadow-scitech-mint/10';
			case 'Dosen':
				return 'bg-scitech-cyan/15 text-scitech-cyan border-scitech-cyan/40';
			case 'Operator':
				return 'bg-amber-500/15 text-amber-400 border-amber-500/40';
			default:
				return 'bg-white/10 text-text-main/80 border-white/20';
		}
	}
</script>

<!-- Alert / Toast Notification -->
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

<div class="mx-auto max-w-7xl space-y-8 p-6 sm:p-10">
	<div
		class="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center"
	>
		<div>
			<h1 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">Semua User</h1>
		</div>

		<div
			class="bg-scitech-slate/80 flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-2.5 backdrop-blur-md"
		>
			<div class="bg-scitech-mint/10 text-scitech-mint rounded-xl p-2">
				<Users class="h-5 w-5" />
			</div>
			<div>
				<span class="block text-xs text-text-muted">Total Pengguna</span>
				<span class="font-mono text-base font-bold text-text-main">{data.totalCount} Terdaftar</span
				>
			</div>
		</div>
	</div>

	<!-- Main Card Container -->
	<div
		class="bg-scitech-slate/60 space-y-6 rounded-3xl border border-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
	>
		<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div class="flex items-center gap-2">
				<div class="bg-scitech-mint h-6 w-2 rounded-full"></div>
				<h2 class="text-lg font-bold tracking-wide text-text-main">Data User System</h2>
			</div>

			<button
				onclick={() => goto(mergeNewPath('add'))}
				class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover shadow-scitech-mint/20 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-lg transition-all duration-200 active:scale-95 sm:text-sm"
			>
				<UserPlus class="h-4 w-4" />
				<span>+ Tambah User</span>
			</button>
		</div>

		<!-- Controls Bar: Search & Page Entries -->
		<div class="flex flex-col justify-between gap-4 pt-2 md:flex-row md:items-center">
			<!-- Show Entries Dropdown -->
			<div class="flex items-center gap-2 text-xs font-medium text-text-muted">
				<span>Tampilkan</span>
				<select
					bind:value={entriesPerPage}
					class="bg-scitech-navy focus:border-scitech-mint cursor-pointer rounded-xl border border-white/15 px-3 py-1.5 text-text-main transition-colors focus:outline-none"
				>
					<option value={5}>5</option>
					<option value={10}>10</option>
					<option value={25}>25</option>
					<option value={50}>50</option>
				</select>
				<span>entri</span>
			</div>

			<!-- Search Field Input -->
			<div class="relative w-full md:w-72">
				<Search class="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-text-muted" />
				<input
					type="text"
					placeholder="Cari nama, username..."
					bind:value={searchQuery}
					class="bg-scitech-navy/80 focus:border-scitech-mint/80 focus:ring-scitech-mint/80 w-full rounded-xl border border-white/15 py-2.5 pr-4 pl-10 text-xs text-text-main transition-all placeholder:text-text-muted focus:ring-1 focus:outline-none"
				/>
			</div>
		</div>

		<!-- Data Table Section -->
		<div class="bg-scitech-navy/40 overflow-x-auto rounded-2xl border border-white/10 shadow-inner">
			<table class="w-full border-collapse text-left">
				<thead>
					<tr
						class="bg-scitech-navy/90 border-b border-white/10 font-mono text-[11px] tracking-wider text-text-muted uppercase"
					>
						<th
							class="cursor-pointer p-4 transition-colors hover:text-text-main"
							onclick={() => toggleSort('name')}
						>
							<div class="flex items-center gap-2">
								<span>Nama</span>
								<ArrowUpDown class="text-scitech-cyan h-3 w-3" />
							</div>
						</th>
						<th
							class="cursor-pointer p-4 transition-colors hover:text-text-main"
							onclick={() => toggleSort('username')}
						>
							<div class="flex items-center gap-2">
								<span>Username</span>
								<ArrowUpDown class="text-scitech-cyan h-3 w-3" />
							</div>
						</th>
						<th
							class="cursor-pointer p-4 transition-colors hover:text-text-main"
							onclick={() => toggleSort('role')}
						>
							<div class="flex items-center gap-2">
								<span>Hak Akses</span>
								<ArrowUpDown class="text-scitech-cyan h-3 w-3" />
							</div>
						</th>
						<th class="p-4 text-center">Menu Akses</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-white/5 text-xs">
					{#if paginatedUsers.length === 0}
						<tr>
							<td colspan="4" class="py-12 text-center font-mono text-text-muted">
								Tidak ada data user yang ditemukan.
							</td>
						</tr>
					{:else}
						{#each paginatedUsers as user (user.id)}
							<tr class="group transition-colors hover:bg-white/[0.03]">
								<!-- Column Nama -->
								<td
									class="group-hover:text-scitech-mint p-4 font-semibold text-text-main transition-colors"
								>
									<div class="flex items-center gap-3">
										<div
											class="bg-scitech-slate text-scitech-mint flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 font-bold"
										>
											{user.name.charAt(0)}
										</div>
										<span>{user.name}</span>
									</div>
								</td>

								<td class="p-4 font-mono text-text-muted">
									@{user.username}
								</td>
								<td class="p-4">
									<span
										class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold tracking-wider uppercase {getRoleBadgeStyle(
											user.role
										)}"
									>
										<ShieldCheck class="h-3 w-3" />
										{user.role}
									</span>
								</td>

								<!-- Column Action Menu -->
								<td class="p-4">
									{#if user.name !== Author.name && user.email !== Author.email}
										<div class="flex items-center justify-center gap-2">
											<button
												title="Edit User"
												onclick={() => gotoEdit(user.id, page.url.pathname)}
												class="bg-scitech-cyan/10 hover:bg-scitech-cyan/20 text-scitech-cyan border-scitech-cyan/30 rounded-lg border p-2 transition-all active:scale-95"
											>
												<Edit3 class="h-3.5 w-3.5" />
											</button>

											<button
												title="Hapus User"
												onclick={() => (selectedUserForDelete = user.id)}
												class="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-400 transition-all hover:bg-red-500/20 active:scale-95"
											>
												<Trash2 class="h-3.5 w-3.5" />
											</button>
										</div>
									{/if}
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>

		<div
			class="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-4 sm:flex-row"
		>
			<span class="font-mono text-xs text-text-muted">
				Menampilkan {paginatedUsers.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} hingga {Math.min(
					currentPage * entriesPerPage,
					sortedUsers.length
				)} dari {sortedUsers.length} entri
			</span>

			<!-- Pagination Buttons -->
			<div class="flex items-center gap-2">
				<button
					onclick={() => (currentPage = Math.max(1, currentPage - 1))}
					disabled={currentPage === 1}
					class="bg-scitech-navy rounded-xl border border-white/10 p-2 text-text-muted transition-all hover:text-text-main disabled:cursor-not-allowed disabled:opacity-30"
				>
					<ChevronLeft class="h-4 w-4" />
				</button>

				{#each Array(totalPages) as _, i}
					<button
						onclick={() => (currentPage = i + 1)}
						class="rounded-xl border px-3 py-1.5 font-mono text-xs font-bold transition-all {currentPage ===
						i + 1
							? 'bg-scitech-mint text-scitech-navy border-scitech-mint shadow-md'
							: 'bg-scitech-navy border-white/10 text-text-muted hover:text-text-main'}"
					>
						{i + 1}
					</button>
				{/each}

				<button
					onclick={() => (currentPage = Math.min(totalPages, currentPage + 1))}
					disabled={currentPage === totalPages}
					class="bg-scitech-navy rounded-xl border border-white/10 p-2 text-text-muted transition-all hover:text-text-main disabled:cursor-not-allowed disabled:opacity-30"
				>
					<ChevronRight class="h-4 w-4" />
				</button>
			</div>
		</div>
	</div>
</div>

<!-- MODAL POPUP KONFIRMASI HAPUS               -->
{#if selectedUserForDelete}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm transition-all"
	>
		<div
			class="bg-scitech-slate w-full max-w-md space-y-5 rounded-3xl border border-white/15 p-6 shadow-2xl"
		>
			<!-- Header Modal -->
			<div class="flex items-center gap-3">
				<div class="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-red-400">
					<AlertTriangle class="h-6 w-6" />
				</div>
				<div>
					<h3 class="text-lg font-bold text-text-main">Konfirmasi Hapus User</h3>
					<p class="text-xs text-text-muted">Tindakan ini tidak dapat dibatalkan</p>
				</div>
			</div>

			<!-- Pesan Konfirmasi -->
			<p class="text-xs leading-relaxed text-text-muted sm:text-sm">
				Apakah Anda yakin ingin menghapus pengguna <span class="font-bold text-text-main"
					>{userToDelete?.name || 'ini'}</span
				>
				{#if userToDelete?.username}
					(<span class="text-scitech-mint font-mono">@{userToDelete.username}</span>)
				{/if}? Data yang dihapus tidak dapat dikembalikan.
			</p>

			<!-- Action Buttons -->
			<div class="flex items-center justify-end gap-3 pt-2">
				<button
					type="button"
					onclick={() => (selectedUserForDelete = null)}
					disabled={isDeleting}
					class="bg-scitech-navy rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-text-muted transition-all hover:bg-white/5 hover:text-text-main disabled:opacity-50"
				>
					Batal
				</button>

				<button
					type="button"
					onclick={confirmDelete}
					disabled={isDeleting}
					class="inline-flex items-center gap-2 rounded-xl border border-red-500/50 bg-red-500/80 px-4 py-2.5 text-xs font-bold text-text-main shadow-lg shadow-red-500/20 transition-all hover:bg-red-500 active:scale-95 disabled:opacity-50"
				>
					{#if isDeleting}
						<span>Menghapus...</span>
					{:else}
						<Trash2 class="h-4 w-4" />
						<span>Ya, Hapus</span>
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
