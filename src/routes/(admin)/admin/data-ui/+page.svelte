<script lang="ts">
	import {
		BookOpen,
		GraduationCap,
		Building2,
		Home,
		Laptop,
		Library,
		ArrowUpRight,
		Loader2,
		Trash,
		Trash2
	} from 'lucide-svelte';
	import type { PageData } from './$types';
	import Spin from '$lib/components/loading/spin.svelte';
	import { mergeNewPath } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { navMenuItems } from '$lib/data/navbar';
	import { enhance } from '$app/forms';
	import Message from '$lib/components/admin/message.svelte';
	import type { ResponseMessage } from '$lib/types/message';
	import { actionDashboardLinks } from '$lib/data/dashboard';
	import { classShadowDown } from '$lib/constants';

	let { data }: { data: PageData } = $props();

	// Peta pencocokan string nama ikon dari JSON ke komponen Lucide
	const iconMap: Record<string, any> = {
		Home,
		BookOpen,
		GraduationCap,
		Building2,
		Laptop,
		Library
	};
	// State untuk Pesan/Notifikasi
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
	const protectedNavbarIds = navMenuItems.map((item) => item.id);
	const protectedDasboardLinkIds = actionDashboardLinks.map((item) => item.id);
</script>

{#if showMessage}
	<div class="mb-6">
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

<div
	class="flex min-h-screen flex-col gap-3.5 bg-bg-primary p-6 text-text-main transition-colors duration-300 lg:p-10"
>
	<section class="space-y-6">
		<div class="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
			<div class="space-y-1">
				<h1 class="text-xl font-bold tracking-tight text-text-main sm:text-2xl">
					Dashboard Action UI
				</h1>
				<p class="text-xs text-text-muted">
					Data yang diupdate di sini akan ditulis di halaman utama sebagai link penghubung antar
					file.
				</p>
			</div>
			<button
				type="button"
				onclick={() => goto(mergeNewPath('dashboard-action'))}
				class="inline-flex shrink-0 items-center justify-center gap-2 border border-border-color bg-bg-secondary px-4 py-2 text-xs font-semibold text-text-main shadow-sm transition-all hover:bg-bg-secondary-hover active:scale-95"
			>
				<span>+ Add Navigasi</span>
			</button>
		</div>

		{#await data.actionLinks}
			<div class="flex items-center gap-2 py-6 text-xs text-text-muted">
				<Spin />
				<span>Memuat action links...</span>
			</div>
		{:then actionLinks}
			<div class="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
				<!-- Tombol Utama Statis -->
				<a
					href="#main"
					class="inline-flex w-full items-center justify-center gap-2 bg-accent-primary px-5 py-2.5 text-sm font-semibold text-text-dark shadow-sm transition-all hover:bg-accent-primary-hover active:scale-95 sm:w-auto"
				>
					<span>Get Started</span>
					<ArrowUpRight class="h-4 w-4 stroke-[2.5]" />
				</a>

				<div class="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
					{#each actionLinks as link (link.id)}
						{@const IconComponent = iconMap[link.icon as string] || BookOpen}

						<div class="group relative inline-flex w-full sm:w-auto">
							<a
								href={link.href}
								target={link.external ? '_blank' : '_self'}
								rel={link.external ? 'noopener noreferrer' : undefined}
								class={` ${classShadowDown} inline-flex w-full items-center justify-center gap-2 border border-border-color bg-bg-secondary px-3.5 py-2.5 pr-9 text-xs font-medium text-text-main sm:w-auto sm:px-4 sm:text-sm`}
							>
								<IconComponent class={`h-4 w-4 shrink-0 ${link.iconColorClass}`} />
								<span class="truncate">{link.label}</span>
							</a>

							{#if !protectedDasboardLinkIds.includes(link.id)}
								<form
									method="POST"
									action="?/deleteActionLink"
									use:enhance={() => {
										return async ({ result, update }) => {
											if (result.type === 'success') {
												const resData = (result.data as ResponseMessage) ?? {
													status: 'success',
													title: 'Berhasil',
													message: ' Data aberita berhasil diperbarui'
												};
												triggerMessage(resData.status, resData.title, resData.message);
												await update();
											} else if (result.type === 'failure') {
												const resData = (result.data as ResponseMessage) ?? {
													status: 'error',
													title: 'Gagal',
													message: (result.data?.message as string) || 'Gagal memproses data.'
												};
												triggerMessage(resData.status, resData.title, resData.message);
												await update();
											} else {
												triggerMessage(
													'error',
													'Error',
													'Terjadi kesalahan sistem yang tidak diketahui.'
												);
												await update();
											}
										};
									}}
									class="absolute -top-1.5 -right-1.5 z-10"
								>
									<input type="hidden" name="id" value={link.id} />
									<button
										type="submit"
										title="Hapus Action Link"
										class="flex h-6 w-6 items-center justify-center rounded-lg bg-status-error/10 text-status-error opacity-70 transition-opacity hover:bg-status-error/20 hover:opacity-100"
									>
										<Trash2 class="h-3 w-3" />
									</button>
								</form>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{:catch}
			<p class="text-xs text-status-error">Gagal memuat data action links.</p>
		{/await}
	</section>

	<!-- ==================== section 2: navbar / menu navigasi dinamis ==================== -->
	<section class="space-y-6">
		<div class="flex items-center justify-between">
			<div class="flex flex-col gap-2">
				<h2 class="text-xl font-bold tracking-tight text-text-main">Menu Navigasi</h2>
				<p class="text-xs text-text-muted">
					Struktur menu navigasi yang dimuat dari file JSON server.
				</p>
			</div>
			<button
				type="button"
				onclick={() => goto(mergeNewPath('navigasi'))}
				class="inline-flex items-center gap-2 border border-border-color bg-bg-secondary px-4 py-2 text-xs font-semibold text-text-main shadow-sm transition-all hover:bg-bg-secondary-hover active:scale-95"
			>
				<span>add Navigasi</span>
			</button>
		</div>

		{#await data.navMenus}
			<div class="flex items-center gap-2 py-6 text-xs text-text-muted">
				<Spin />
			</div>
		{:then navMenus}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each navMenus as menu (menu.id)}
					{@const IconComp = iconMap[menu.icon] || Home}
					<div
						class={` ${classShadowDown} space-y-4  border border-border-color bg-bg-secondary p-5 hover:border-accent-primary`}
					>
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<div
									class={`flex h-10 w-10 items-center justify-center rounded-xl ${menu.bgClass}`}
								>
									<IconComp class="h-5 w-5" />
								</div>
								<span class="text-sm font-bold text-text-main">{menu.label}</span>
							</div>
							{#if menu.badge}
								<span
									class="rounded-full bg-accent-yellow-dim px-2.5 py-0.5 text-[10px] font-bold text-accent-yellow"
								>
									{menu.badge}
								</span>
							{/if}

							<div class="flex items-center gap-2">
								{#if !protectedNavbarIds.includes(menu.id)}
									<form
										method="POST"
										action="?/deleteNavbarItem"
										use:enhance={() => {
											return async ({ result, update }) => {
												if (result.type === 'success') {
													const resData = (result.data as ResponseMessage) ?? {
														status: 'success',
														title: 'Berhasil',
														message: ' Data aberita berhasil diperbarui'
													};
													triggerMessage(resData.status, resData.title, resData.message);
													await update();
												} else if (result.type === 'failure') {
													const resData = (result.data as ResponseMessage) ?? {
														status: 'error',
														title: 'Gagal',
														message: (result.data?.message as string) || 'Gagal memproses data.'
													};
													triggerMessage(resData.status, resData.title, resData.message);
													await update();
												} else {
													triggerMessage(
														'error',
														'Error',
														'Terjadi kesalahan sistem yang tidak diketahui.'
													);
													await update();
												}
											};
										}}
									>
										<input type="hidden" name="id" value={menu.id} />
										<button
											type="submit"
											title="Hapus Menu"
											class="rounded-xl border border-border-color/10 bg-status-error/10 p-2.5 text-status-error transition-colors hover:bg-status-error/20 active:scale-95"
										>
											<Trash class="h-4 w-4" />
										</button>
									</form>
								{:else}
									<span class="px-2 text-[10px] text-text-muted/60 italic">Sistem Utama</span>
								{/if}
							</div>
						</div>

						{#if menu.subMenu && menu.subMenu.length > 0}
							<div class="space-y-2 border-t border-border-color pt-3">
								{#each menu.subMenu as sub}
									<a
										href={sub.href}
										class="block rounded-lg px-3 py-1.5 text-xs text-text-muted transition-colors hover:bg-bg-primary-glare hover:text-text-main"
									>
										• {sub.label}
									</a>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{:catch}
			<p class="text-xs text-status-error">Gagal memuat data menu navigasi.</p>
		{/await}
	</section>
</div>
