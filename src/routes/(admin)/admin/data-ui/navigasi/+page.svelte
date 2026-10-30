<script lang="ts">
	import { enhance } from '$app/forms';
	import { Plus, Trash2, Save, ArrowLeft, Loader2, Check } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';
	import type { NavMenuItemType } from '$lib/types/navbar';
	import Message from '$lib/components/notif/message.svelte';
	import { type ResponseMessage, type MessageStatus } from '$lib/types/message';
	import { availableIcons } from '$lib/data/icon';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let navMenus = $state<NavMenuItemType[]>(form?.values?.navMenus || data?.navMenus || []);
	let isSubmitting = $state(false);

	// Fungsi untuk menambah menu utama baru
	function addMenu() {
		navMenus.push({
			id: 'menu-' + Date.now(),
			label: '',
			iconName: 'Home',
			bgClass: 'bg-accent-primary/10 text-accent-primary',
			badge: null,
			href: '',
			subMenu: []
		});
	}

	// Fungsi untuk menghapus menu utama
	function removeMenu(index: number) {
		navMenus.splice(index, 1);
	}

	// Fungsi untuk menambah submenu
	function addSubMenu(menuIndex: number) {
		if (!navMenus[menuIndex].subMenu) {
			navMenus[menuIndex].subMenu = [];
		}
		navMenus[menuIndex].subMenu.push({
			id: 'sub-' + Date.now(),
			label: '',
			href: ''
		});
	}

	// Fungsi untuk menghapus submenu
	function removeSubMenu(menuIndex: number, subIndex: number) {
		navMenus[menuIndex].subMenu.splice(subIndex, 1);
	}

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

	$effect(() => {
		if (form?.message) {
			triggerMessage(form.status, form.title, form.message);
		}
	});
</script>

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

<div class="min-h-screen bg-bg-primary p-6 text-text-main transition-colors duration-300 lg:p-10">
	<div class="mx-auto max-w-4xl space-y-8">
		<div class="flex items-center justify-between pb-5">
			<div>
				<h1 class="text-2xl font-bold tracking-tight text-text-main">Kelola Menu Navigasi</h1>
				<p class="text-xs text-text-muted">
					Tambah atau ubah struktur menu navbar dan pilih ikon secara visual.
				</p>
			</div>
			<a
				href="./"
				class="inline-flex items-center gap-2 border border-border-color bg-bg-secondary px-4 py-2 text-xs font-semibold text-text-main transition-all hover:bg-bg-secondary-hover active:scale-95"
			>
				<ArrowLeft class="h-4 w-4" />
				<span>Kembali</span>
			</a>
		</div>

		<!-- Form Utama ke Action updateNavbar -->
		<form
			method="POST"
			action="?/updateNavbar"
			use:enhance={() => {
				isSubmitting = true;

				return async ({ result, update }) => {
					isSubmitting = false;

					// Pengelolaan resData yang disamakan polanya
					const resData =
						result.type === 'success' || result.type === 'failure'
							? (result.data as ResponseMessage | undefined)
							: undefined;

					if (result.type === 'success' || resData?.status === 'success') {
						triggerMessage(
							resData?.status || 'success',
							resData?.title || 'Berhasil',
							resData?.message || resData?.text || 'Navbar menu berhasil diperbarui!'
						);
						await update({ reset: false });
					} else if (resData?.status === 'error' || result.type === 'failure') {
						triggerMessage(
							resData?.status || 'error',
							resData?.title || 'Gagal',
							resData?.message || resData?.text || 'Gagal menyimpan data navbar.'
						);
						await update();
					} else {
						triggerMessage(
							'error',
							'Kesalahan Sistem',
							'Terjadi kesalahan sistem yang tidak diketahui.'
						);
						await update();
					}
				};
			}}
			class="space-y-6"
		>
			<input type="hidden" name="navbarData" value={JSON.stringify(navMenus)} />

			<div class="space-y-6">
				{#if navMenus.length === 0}
					<div
						class="rounded-2xl border border-dashed border-border-color p-8 text-center text-xs text-text-muted"
					>
						Belum ada menu navigasi. Klik tombol di bawah untuk menambah.
					</div>
				{/if}

				{#each navMenus as menu, menuIndex (menu.id || menuIndex)}
					<div
						class="space-y-5 rounded-2xl border border-border-color bg-bg-secondary p-6 shadow-sm"
					>
						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<label
									for="label"
									class="text-11 mb-1 block font-semibold text-text-muted uppercase"
									>Label Menu</label
								>
								<input
									type="text"
									id="label"
									bind:value={menu.label}
									placeholder="Contoh: Beranda"
									required
									class="w-full rounded-xl border border-border-color bg-bg-primary px-3.5 py-2.5 text-xs text-text-main focus:border-accent-primary focus:outline-none"
								/>
							</div>
							<div>
								<label
									for="link"
									class="mb-1 block text-[11px] font-semibold text-text-muted uppercase"
									>URL / Href
								</label>
								<div class="flex items-center gap-2">
									<input
										id="link"
										type="text"
										bind:value={menu.href}
										placeholder="/dashboard"
										class="w-full rounded-xl border border-border-color bg-bg-primary px-3.5 py-2.5 text-xs text-text-main focus:border-accent-primary focus:outline-none"
									/>
									<button
										type="button"
										onclick={() => removeMenu(menuIndex)}
										title="Hapus Menu"
										class="rounded-xl border border-border-color/10 bg-status-error/10 p-2.5 text-status-error transition-colors hover:bg-status-error/20"
									>
										<Trash2 class="h-4 w-4" />
									</button>
								</div>
							</div>
						</div>

						<!-- Grid Pilihan Ikon Secara Visual -->
						<div class="space-y-2">
							<label class="block text-[11px] font-semibold text-text-muted uppercase">
								Pilih Ikon Menu
							</label>
							<div class="grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-10">
								{#each availableIcons as iconOpt}
									{@const IconComponent = iconOpt.component}
									{@const isSelected = menu.iconName === iconOpt.name}
									<button
										type="button"
										onclick={() => (menu.iconName = iconOpt.name)}
										class={`relative flex flex-col items-center justify-center gap-1 rounded-xl border p-2.5 transition-all ${
											isSelected
												? 'border-accent-primary bg-accent-primary/10 text-accent-primary shadow-sm ring-1 ring-accent-primary'
												: 'border-border-color bg-bg-primary text-text-muted hover:border-border-light hover:text-text-main'
										}`}
										title={iconOpt.label}
									>
										<IconComponent class="h-5 w-5" />
										<span class="max-w-full truncate text-[9px]">{iconOpt.label}</span>
										{#if isSelected}
											<span
												class="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent-primary text-[8px] font-bold text-text-dark"
											>
												✓
											</span>
										{/if}
									</button>
								{/each}
							</div>
						</div>

						<div class="space-y-3 pt-4">
							<div class="flex items-center justify-between">
								<span class="text-xs font-bold text-text-muted uppercase">Submenu (Opsional)</span>
								<button
									type="button"
									onclick={() => addSubMenu(menuIndex)}
									class="inline-flex items-center gap-1.5 rounded-lg border border-border-color bg-bg-primary px-3 py-1.5 text-[11px] font-semibold text-text-main transition-all hover:bg-bg-secondary-hover"
								>
									<Plus class="h-3 w-3" />
									<span>Tambah Submenu</span>
								</button>
							</div>

							{#if menu.subMenu && menu.subMenu.length > 0}
								<div class="space-y-2 border-l-2 border-border-color pl-4">
									{#each menu.subMenu as sub, subIndex (sub.id || subIndex)}
										<div class="flex items-center gap-3">
											<input
												type="text"
												bind:value={sub.label}
												placeholder="Label Submenu"
												class="w-1/2 rounded-xl border border-border-color bg-bg-primary px-3 py-2 text-xs text-text-main focus:border-accent-primary focus:outline-none"
											/>
											<input
												type="text"
												bind:value={sub.href}
												placeholder="URL Path (/path)"
												class="w-1/2 rounded-xl border border-border-color bg-bg-primary px-3 py-2 text-xs text-text-main focus:border-accent-primary focus:outline-none"
											/>
											<button
												type="button"
												onclick={() => removeSubMenu(menuIndex, subIndex)}
												class="text-text-muted hover:text-status-error"
											>
												<Trash2 class="h-4 w-4" />
											</button>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			<!-- Tombol Aksi Bawah -->
			<div class="flex items-center justify-between pt-5">
				<button
					type="button"
					onclick={addMenu}
					class="inline-flex items-center gap-2 rounded-xl border border-border-color bg-bg-secondary px-4 py-2.5 text-xs font-semibold text-text-main shadow-sm transition-all hover:bg-bg-secondary-hover active:scale-95"
				>
					<Plus class="h-4 w-4" />
					<span>Tambah Menu Utama</span>
				</button>

				<button
					type="submit"
					disabled={isSubmitting}
					class="inline-flex items-center gap-2 rounded-xl bg-accent-primary px-6 py-2.5 text-xs font-bold text-text-dark shadow-sm transition-all hover:bg-accent-primary-hover active:scale-95 disabled:opacity-50"
				>
					{#if isSubmitting}
						<Loader2 class="h-4 w-4 animate-spin" />
						<span>Menyimpan...</span>
					{:else}
						<Save class="h-4 w-4" />
						<span>Simpan Perubahan Navbar</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
