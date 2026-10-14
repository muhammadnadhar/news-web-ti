<script lang="ts">
	import { enhance } from '$app/forms';
	import { Plus, Trash2, Save, ArrowLeft, Loader2, CheckIcon } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';
	import type { DashboardActionLink } from '$lib/types/dashboard';
	import Message from '$lib/components/admin/message.svelte';
	import { type ResponseMessage, type MessageStatus } from '$lib/types/message';
	import { availableIcons, availableIconColors } from '$lib/data/icon';
	import { randomUUID } from '$lib/crypto';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// State lokal untuk menampung action links
	let actionLinks = $state<DashboardActionLink[]>([]);
	let isSubmitting = $state(false);

	// Sinkronisasi data dari server (mendukung Promise streaming maupun Array langsung)
	$effect(() => {
		// Jika form error/validasi, utamakan form values
		if (form?.values?.actionLinks) {
			actionLinks = form.values.actionLinks;
			return;
		}

		// Tangani jika data.actionLinks berupa Promise (streamed) atau Array biasa
		const rawData = data?.actionLinks;
		if (rawData) {
			if (typeof (rawData as any).then === 'function') {
				(rawData as Promise<DashboardActionLink[]>).then((resolved) => {
					actionLinks = resolved || [];
				});
			} else {
				actionLinks = rawData as DashboardActionLink[];
			}
		}
	});

	// Fungsi untuk menambah action link baru
	function addActionLink() {
		// Menggunakan array mutation langsung (didukung reaktifitas Svelte 5)
		actionLinks.push({
			id: randomUUID(),
			href: 'https://',
			label: '',
			icon: 'BookOpen',
			external: true,
			iconColorClass: 'text-accent-cyan'
		});
	}

	// Fungsi untuk menghapus action link
	function removeActionLink(index: number) {
		actionLinks.splice(index, 1);
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
			triggerMessage(form.message.status, form.message.title, form.message.message);
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
				<h1 class="text-2xl font-bold tracking-tight text-text-main">
					Kelola Dashboard Action Links
				</h1>
				<p class="text-xs text-text-muted">
					Atur tautan cepat portal eksternal, ikon visual, dan warnanya.
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

		<form
			method="POST"
			action="?/updateActionLinks"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ result, update }) => {
					isSubmitting = false;
					if (result.type === 'success') {
						const resData = (result.data as ResponseMessage) ?? {
							status: 'success',
							title: 'Berhasil',
							message: 'Action links berhasil diperbarui!'
						};
						triggerMessage(resData.status, resData.title, resData.text || resData.message);
						await update({ reset: false });
					} else if (result.type === 'failure') {
						const resData = (result.data as any)?.message ?? {
							status: 'error',
							title: 'Gagal',
							message: 'Gagal menyimpan action links.'
						};
						triggerMessage(resData.status, resData.title, resData.text || resData.message);
						await update();
					} else {
						triggerMessage('error', 'Kesalahan Sistem', 'Terjadi kesalahan sistem.');
						await update();
					}
				};
			}}
			class="space-y-6"
		>
			<input type="hidden" name="actionLinksData" value={JSON.stringify(actionLinks)} />

			<div class="space-y-6">
				{#if actionLinks.length === 0}
					<div
						class=" border border-dashed border-border-color p-8 text-center text-xs text-text-muted"
					>
						Belum ada action links. Klik tombol di bawah untuk menambah.
					</div>
				{/if}

				{#each actionLinks as link, index (link.id || index)}
					<div
						class="space-y-5 rounded-2xl border border-border-color bg-bg-secondary p-6 shadow-sm"
					>
						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<label class="mb-1 block text-[11px] font-semibold text-text-muted uppercase"
									>ID Unik</label
								>
								<input
									type="text"
									bind:value={link.id}
									placeholder="siakad / uin"
									required
									class="w-full rounded-xl border border-border-color bg-bg-primary px-3.5 py-2.5 text-xs text-text-main focus:border-accent-primary focus:outline-none"
								/>
							</div>
							<div>
								<label class="mb-1 block text-[11px] font-semibold text-text-muted uppercase"
									>Label Tautan</label
								>
								<input
									type="text"
									bind:value={link.label}
									placeholder="Portal SIAKAD"
									required
									class="w-full rounded-xl border border-border-color bg-bg-primary px-3.5 py-2.5 text-xs text-text-main focus:border-accent-primary focus:outline-none"
								/>
							</div>
						</div>

						<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
							<div class="sm:col-span-2">
								<label class="mb-1 block text-[11px] font-semibold text-text-muted uppercase"
									>URL / Href Tujuan</label
								>
								<input
									type="url"
									bind:value={link.href}
									placeholder="https://..."
									required
									class="w-full rounded-xl border border-border-color bg-bg-primary px-3.5 py-2.5 text-xs text-text-main focus:border-accent-primary focus:outline-none"
								/>
							</div>
							<div class="flex items-end justify-between">
								<label class="flex cursor-pointer items-center gap-2 pb-2.5">
									<input
										type="checkbox"
										bind:checked={link.external}
										class="h-4 w-4 rounded border-border-color text-accent-primary focus:ring-accent-primary"
									/>
									<span class="text-xs font-semibold text-text-main">Tab Baru (External)</span>
								</label>
								<button
									type="button"
									onclick={() => removeActionLink(index)}
									title="Hapus Link"
									class="mb-1 rounded-xl border border-border-color/10 bg-status-error/10 p-2.5 text-status-error transition-colors hover:bg-status-error/20"
								>
									<Trash2 class="h-4 w-4" />
								</button>
							</div>
						</div>

						<!-- Grid Pilihan Ikon Secara Visual -->
						<div class="space-y-2">
							<label class="block text-[11px] font-semibold text-text-muted uppercase">
								Pilih Ikon Aksi
							</label>
							<div class="grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-10">
								{#each availableIcons as iconOpt}
									{@const IconComponent = iconOpt.component}
									{@const isSelected = link.icon === iconOpt.name}
									<button
										type="button"
										onclick={() => (link.icon = iconOpt.name)}
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
												<CheckIcon />
											</span>
										{/if}
									</button>
								{/each}
							</div>
						</div>

						<!-- Pilihan Warna Ikon -->
						<div class="space-y-2">
							<label class="block text-[11px] font-semibold text-text-muted uppercase">
								Warna Aksen Ikon
							</label>
							<div class="flex flex-wrap gap-2">
								{#each availableIconColors as colorOpt}
									{@const isColorSelected = link.iconColorClass === colorOpt.classValue}
									<button
										type="button"
										onclick={() => (link.iconColorClass = colorOpt.classValue)}
										class={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
											isColorSelected
												? `${colorOpt.bgClass} border-accent-primary ring-1 ring-accent-primary`
												: 'border-border-color bg-bg-primary text-text-muted hover:text-text-main'
										}`}
									>
										<span class={colorOpt.classValue}>●</span>
										{colorOpt.label}
									</button>
								{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Tombol Aksi Bawah -->
			<div class="flex items-center justify-between pt-5">
				<button
					type="button"
					onclick={addActionLink}
					class="inline-flex items-center gap-2 rounded-xl border border-border-color bg-bg-secondary px-4 py-2.5 text-xs font-semibold text-text-main shadow-sm transition-all hover:bg-bg-secondary-hover active:scale-95"
				>
					<Plus class="h-4 w-4" />
					<span>Tambah Action Link</span>
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
						<span>Simpan Perubahan Action Links</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
