<script lang="ts">
	import {
		UserPlus,
		Search,
		ArrowUpDown,
		Edit3,
		Trash2,
		ShieldCheck,
		UserCheck,
		X,
		Check,
		Sparkles,
		ChevronLeft,
		ChevronRight,
		Users
	} from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// State Management Svelte 5 Runes
	let searchQuery = $state('');
	let entriesPerPage = $state(10);
	let currentPage = $state(1);
	let sortColumn = $state<'name' | 'username' | 'role'>('name');
	let sortDirection = $state<'asc' | 'desc'>('asc');

	// Modal State
	let isAddModalOpen = $state(false);
	let selectedUserForDelete = $state<string | null>(null);

	// Form Fields State
	let newName = $state('');
	let newUsername = $state('');
	let newRole = $state<'Administrator' | 'Dosen' | 'Operator' | 'Mahasiswa'>('Administrator');

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

	function getRoleBadgeStyle(role: string) {
		switch (role) {
			case 'Administrator':
				return 'bg-scitech-mint/15 text-scitech-mint border-scitech-mint/40 shadow-sm shadow-scitech-mint/10';
			case 'Dosen':
				return 'bg-scitech-cyan/15 text-scitech-cyan border-scitech-cyan/40';
			case 'Operator':
				return 'bg-amber-500/15 text-amber-400 border-amber-500/40';
			default:
				return 'bg-white/10 text-white/80 border-white/20';
		}
	}
</script>

<div class="mx-auto max-w-7xl space-y-8 p-6 sm:p-10">
	<!-- Header Section -->
	<div
		class="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center"
	>
		<div>
			<span
				class="text-scitech-mint mb-1 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
			>
				<Sparkles class="text-scitech-mint h-4 w-4" /> Manajemen Pengguna
			</span>
			<h1 class="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Semua User</h1>
		</div>

		<!-- Quick Stat Card -->
		<div
			class="bg-scitech-slate/80 flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-2.5 backdrop-blur-md"
		>
			<div class="bg-scitech-mint/10 text-scitech-mint rounded-xl p-2">
				<Users class="h-5 w-5" />
			</div>
			<div>
				<span class="text-text-muted block text-xs">Total Pengguna</span>
				<span class="font-mono text-base font-bold text-white">{data.totalCount} Terdaftar</span>
			</div>
		</div>
	</div>

	<!-- Main Card Container -->
	<div
		class="bg-scitech-slate/60 space-y-6 rounded-3xl border border-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
	>
		<!-- Card Action Header -->
		<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div class="flex items-center gap-2">
				<div class="bg-scitech-mint h-6 w-2 rounded-full"></div>
				<h2 class="text-lg font-bold tracking-wide text-white">Data User System</h2>
			</div>

			<button
				onclick={() => (isAddModalOpen = true)}
				class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover shadow-scitech-mint/20 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-lg transition-all duration-200 active:scale-95 sm:text-sm"
			>
				<UserPlus class="h-4 w-4" />
				<span>+ Tambah User</span>
			</button>
		</div>

		<!-- Controls Bar: Search & Page Entries -->
		<div class="flex flex-col justify-between gap-4 pt-2 md:flex-row md:items-center">
			<!-- Show Entries Dropdown -->
			<div class="text-text-muted flex items-center gap-2 text-xs font-medium">
				<span>Tampilkan</span>
				<select
					bind:value={entriesPerPage}
					class="bg-scitech-navy focus:border-scitech-mint cursor-pointer rounded-xl border border-white/15 px-3 py-1.5 text-white transition-colors focus:outline-none"
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
				<Search class="text-text-muted absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
				<input
					type="text"
					placeholder="Cari nama, username..."
					bind:value={searchQuery}
					class="bg-scitech-navy/80 placeholder:text-text-muted focus:border-scitech-mint/80 focus:ring-scitech-mint/80 w-full rounded-xl border border-white/15 py-2.5 pr-4 pl-10 text-xs text-white transition-all focus:ring-1 focus:outline-none"
				/>
			</div>
		</div>

		<!-- DATA TABLE SECTION -->
		<div class="bg-scitech-navy/40 overflow-x-auto rounded-2xl border border-white/10 shadow-inner">
			<table class="w-full border-collapse text-left">
				<thead>
					<tr
						class="bg-scitech-navy/90 text-text-muted border-b border-white/10 font-mono text-[11px] tracking-wider uppercase"
					>
						<th
							class="cursor-pointer p-4 transition-colors hover:text-white"
							onclick={() => toggleSort('name')}
						>
							<div class="flex items-center gap-2">
								<span>Nama</span>
								<ArrowUpDown class="text-scitech-cyan h-3 w-3" />
							</div>
						</th>
						<th
							class="cursor-pointer p-4 transition-colors hover:text-white"
							onclick={() => toggleSort('username')}
						>
							<div class="flex items-center gap-2">
								<span>Username</span>
								<ArrowUpDown class="text-scitech-cyan h-3 w-3" />
							</div>
						</th>
						<th
							class="cursor-pointer p-4 transition-colors hover:text-white"
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
							<td colspan="4" class="text-text-muted py-12 text-center font-mono">
								Tidak ada data user yang ditemukan.
							</td>
						</tr>
					{:else}
						{#each paginatedUsers as user (user.id)}
							<tr class="group transition-colors hover:bg-white/[0.03]">
								<!-- Column Nama -->
								<td
									class="group-hover:text-scitech-mint p-4 font-semibold text-white transition-colors"
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

								<td class="text-text-muted p-4 font-mono">
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
									<div class="flex items-center justify-center gap-2">
										<button
											title="Edit User"
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
			<span class="text-text-muted font-mono text-xs">
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
					class="bg-scitech-navy text-text-muted rounded-xl border border-white/10 p-2 transition-all hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
				>
					<ChevronLeft class="h-4 w-4" />
				</button>

				{#each Array(totalPages) as _, i}
					<button
						onclick={() => (currentPage = i + 1)}
						class="rounded-xl border px-3 py-1.5 font-mono text-xs font-bold transition-all {currentPage ===
						i + 1
							? 'bg-scitech-mint text-scitech-navy border-scitech-mint shadow-md'
							: 'bg-scitech-navy text-text-muted border-white/10 hover:text-white'}"
					>
						{i + 1}
					</button>
				{/each}

				<button
					onclick={() => (currentPage = Math.min(totalPages, currentPage + 1))}
					disabled={currentPage === totalPages}
					class="bg-scitech-navy text-text-muted rounded-xl border border-white/10 p-2 transition-all hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
				>
					<ChevronRight class="h-4 w-4" />
				</button>
			</div>
		</div>
	</div>
</div>

<!-- MODAL TAMBAH USER -->
{#if isAddModalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
		<div
			class="bg-scitech-navy relative w-full max-w-md space-y-6 rounded-3xl border border-white/15 p-6 shadow-2xl sm:p-8"
		>
			<div class="flex items-center justify-between border-b border-white/10 pb-4">
				<h3 class="flex items-center gap-2 text-base font-bold text-white">
					<UserPlus class="text-scitech-mint h-4 w-4" /> Tambah User Baru
				</h3>
				<button onclick={() => (isAddModalOpen = false)} class="text-text-muted hover:text-white">
					<X class="h-5 w-5" />
				</button>
			</div>

			<form method="POST" action="?/addUser" class="space-y-4">
				<div>
					<label class="text-text-muted mb-1 block text-xs font-medium" for="name"
						>Nama Lengkap</label
					>
					<input
						id="name"
						name="name"
						type="text"
						required
						bind:value={newName}
						placeholder="Masukkan nama lengkap..."
						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none"
					/>
				</div>

				<div>
					<label class="text-text-muted mb-1 block text-xs font-medium" for="username"
						>Username</label
					>
					<input
						id="username"
						name="username"
						type="text"
						required
						bind:value={newUsername}
						placeholder="Masukkan username unik..."
						class="bg-scitech-slate focus:border-scitech-mint w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none"
					/>
				</div>

				<div>
					<label class="text-text-muted mb-1 block text-xs font-medium" for="role"
						>Hak Akses / Role</label
					>
					<select
						id="role"
						name="role"
						bind:value={newRole}
						class="bg-scitech-slate focus:border-scitech-mint w-full cursor-pointer rounded-xl border border-white/15 px-4 py-2.5 text-xs text-white focus:outline-none"
					>
						<option value="Administrator">Administrator</option>
						<option value="Dosen">Dosen</option>
						<option value="Operator">Operator</option>
						<option value="Mahasiswa">Mahasiswa</option>
					</select>
				</div>

				<div class="flex items-center justify-end gap-3 pt-4">
					<button
						type="button"
						onclick={() => (isAddModalOpen = false)}
						class="text-text-muted rounded-xl bg-white/5 px-4 py-2 text-xs font-semibold transition-all hover:bg-white/10 hover:text-white"
					>
						Batal
					</button>
					<button
						type="submit"
						class="text-scitech-navy bg-scitech-mint hover:bg-scitech-mint-hover rounded-xl px-5 py-2 text-xs font-bold transition-all"
					>
						Simpan User
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- MODAL KONFIRMASI HAPUS -->
{#if selectedUserForDelete}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
		<div
			class="bg-scitech-navy w-full max-w-sm space-y-5 rounded-3xl border border-white/15 p-6 text-center shadow-2xl"
		>
			<div
				class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400"
			>
				<Trash2 class="h-6 w-6" />
			</div>

			<div>
				<h3 class="text-sm font-bold text-white">Hapus Data User?</h3>
				<p class="text-text-muted mt-1 text-xs leading-relaxed">
					Tindakan ini tidak dapat dibatalkan. User akan dihapus dari sistem secara permanen.
				</p>
			</div>

			<form method="POST" action="?/deleteUser" class="flex items-center justify-center gap-3">
				<input type="hidden" name="id" value={selectedUserForDelete} />
				<button
					type="button"
					onclick={() => (selectedUserForDelete = null)}
					class="text-text-muted rounded-xl bg-white/5 px-4 py-2 text-xs font-semibold transition-all hover:bg-white/10"
				>
					Batal
				</button>
				<button
					type="submit"
					class="rounded-xl bg-red-500 px-5 py-2 text-xs font-bold text-white transition-all hover:bg-red-600"
				>
					Ya, Hapus
				</button>
			</form>
		</div>
	</div>
{/if}
