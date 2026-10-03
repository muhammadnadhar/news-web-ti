<script lang="ts">
	import { Edit, Trash2, LayoutGrid, Image as ImageIcon } from 'lucide-svelte';
	import type { ProfilProdiItemDTO } from '$lib/dto/admin/home';
	import { classShadowDown } from '$lib/constants';

	let {
		listProfil = [],
		pageUrlPathname,
		onDelete
	}: {
		listProfil: ProfilProdiItemDTO[];
		pageUrlPathname: string;
		onDelete: (id: string) => void;
	} = $props();

	function stripHtml(html: string = ''): string {
		return html.replace(/<[^>]*>?/gm, '').trim();
	}
</script>

<div
	class={` ${classShadowDown} w-full overflow-hidden border border-bg-secondary-hover bg-bg-secondary`}
>
	<div class="overflow-x-auto">
		<table class="w-full text-left text-xs text-text-main">
			<thead
				class="border-b border-bg-secondary-hover bg-bg-primary-glare text-[11px] font-bold tracking-wider text-text-muted uppercase"
			>
				<tr>
					<th scope="col" class="px-4 py-3.5">No</th>
					<th scope="col" class="px-4 py-3.5">Judul & Layout</th>
					<th scope="col" class="px-4 py-3.5">Daftar Gambar & Caption</th>
					<th scope="col" class="px-4 py-3.5">Deskripsi</th>
					<th scope="col" class="px-4 py-3.5 text-right">Aksi</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-bg-secondary-hover">
				{#each listProfil as profil, index (profil.id)}
					{@const images = profil.images ?? []}
					<tr class="transition-colors hover:bg-bg-primary/50">
						<!-- Nomor -->
						<td class="px-4 py-4 font-semibold text-text-muted">
							{index + 1}
						</td>

						<!-- Judul & Tipe Layout -->
						<td class="max-w-[200px] px-4 py-4">
							<p class="line-clamp-2 font-bold text-text-main">{profil.title}</p>
							<span
								class="mt-1 inline-flex items-center gap-1 border border-accent-primary/20 bg-accent-primary-dim px-2 py-0.5 text-[10px] font-medium text-accent-primary"
							>
								<LayoutGrid class="h-3 w-3" />
								{profil.display_instruction || 'FLEX_CENTER'}
							</span>
						</td>

						<!-- Loop Gambar & Caption -->
						<td class="max-w-[320px] px-4 py-4">
							{#if images.length > 0}
								<div class="flex flex-wrap gap-2">
									{#each images as img, i}
										<div
											class="group relative flex w-20 flex-col border border-bg-secondary-hover bg-bg-primary p-1"
										>
											<img
												src={img.url}
												alt={img.caption || `Gambar ${i + 1}`}
												class="h-14 w-full object-cover"
											/>
											{#if img.caption}
												<span
													class="mt-1 truncate text-[9px] text-text-muted italic"
													title={img.caption}
												>
													{img.caption}
												</span>
											{/if}
										</div>
									{/each}
								</div>
							{:else}
								<span class="text-[11px] text-text-muted">Tanpa gambar</span>
							{/if}
						</td>

						<!-- Deskripsi Ringkas -->
						<td class="max-w-[280px] px-4 py-4">
							<p class="line-clamp-3 leading-relaxed text-text-muted">
								{stripHtml(profil.description) || '-'}
							</p>
						</td>

						<!-- Aksi -->
						<td class="px-4 py-4 text-right">
							<div class="inline-flex items-center gap-2">
								<a
									href={`${pageUrlPathname}/profil-prodi/edit/${profil.id}`}
									class="border border-bg-secondary-hover bg-bg-primary p-2 text-text-main transition-all hover:border-accent-primary/50 hover:bg-accent-primary/20 hover:text-accent-primary active:scale-95"
									title="Edit Profil"
								>
									<Edit class="h-4 w-4" />
								</a>
								<button
									type="button"
									onclick={() => onDelete(profil.id)}
									class="border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition-all hover:bg-red-500/20 active:scale-95"
									title="Hapus Profil"
								>
									<Trash2 class="h-4 w-4" />
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
