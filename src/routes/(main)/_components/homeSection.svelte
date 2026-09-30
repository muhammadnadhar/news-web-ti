<script lang="ts">
	import { goto } from '$app/navigation';
	import UserCard from '$lib/components/admin/userCard.svelte';
	import Spin from '$lib/components/loading/spin.svelte';
	import { classShadowDown } from '$lib/constants';
	import type {
		PerminatanTIItemDTO,
		PrimaryDosenDTO,
		ProfilProdiItemDTO
	} from '$lib/dto/admin/home';
	import { getContainerLayoutClass, getItemLayoutClass } from '$lib/mapper/home';
	import { stripHtml } from '$lib/utils';
	import {
		AlertCircle,
		ArrowRight,
		ArrowRightIcon,
		AwardIcon,
		BookOpenIcon,
		BuildingIcon,
		ExternalLinkIcon,
		Images,
		Inbox,
		Layers,
		UserIcon,
		UsersIcon
	} from 'lucide-svelte';

	// Props opsional dari ke-3 tabel
	let {
		listDosen,
		listPerminatan,
		listProfil
	}: {
		listDosen: Promise<PrimaryDosenDTO[]>;
		listPerminatan: Promise<PerminatanTIItemDTO[]>;
		listProfil: Promise<ProfilProdiItemDTO[]>;
	} = $props();

	// untuk sementara ini
	const headerColors = [
		'bg-accent-primary/20 border-accent-primary/50', // Mint / Hijau Utama
		'bg-accent-purple/20 border-accent-purple/50', // Ungu Kuantum
		'bg-accent-cyan/20 border-accent-cyan/50', // Cyan Tech
		'bg-accent-yellow/20 border-accent-yellow/50', // Kuning Amber
		'bg-status-error/20 border-status-error/50', // Merah Lab
		'bg-accent-blue/20 border-accent-blue/50' // Biru Elektrik (Opsi Tambahan)
	];
</script>

<!-- kategori  perminatan ti -->
<section class=" relative w-full bg-bg-primary-glare py-12 md:py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		{#await listPerminatan}
			<Spin />
		{:then list}
			{#if list && list.length > 0}
				<div class="section-group space-y-8">
					<!-- Header Section -->
					<div
						class="absolute top-0 left-1/2 z-20 flex w-max max-w-[90%] -translate-x-1/2 -translate-y-1/2 justify-center"
					>
						<div
							class="inline-flex flex-wrap items-center justify-center gap-3 border border-border-color bg-bg-secondary px-8 py-3 shadow-[0_4px_0_0_var(--border-color)]"
						>
							<h2 class="text-xl font-extrabold tracking-tight text-text-main sm:text-2xl">
								Bidang Keahlian TI
							</h2>
							<span
								class="border border-border-color bg-bg-primary px-2.5 py-0.5 text-xs font-bold text-text-muted"
							>
								{list.length} Bidang
							</span>
						</div>
					</div>

					<!-- Grid Cards -->
					<div
						class="grid w-full gap-6 {list.length === 1
							? 'mx-auto max-w-xl grid-cols-1'
							: list.length === 2
								? 'mx-auto max-w-4xl grid-cols-1 sm:grid-cols-2'
								: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}"
					>
						{#each list as perminatan (perminatan.id)}
							<article
								class="group flex flex-col justify-between border border-border-color bg-bg-secondary p-6
                   shadow-[0_4px_0_0_var(--border-color)] transition-all duration-300
                   hover:-translate-y-1 hover:scale-[1.02] hover:border-bg-secondary
                   hover:bg-bg-secondary-hover hover:shadow-[0_8px_0_0_var(--bg-secondary)]"
							>
								<div class="space-y-4">
									<!-- Icon & Title -->
									<div class="flex items-start gap-4">
										<div
											class="flex h-10 w-10 shrink-0 items-center justify-center border border-border-color bg-bg-primary text-accent-primary
                               transition-colors duration-300 group-hover:border-accent-primary group-hover:bg-accent-primary group-hover:text-text-dark"
										>
											<BookOpenIcon class="h-5 w-5" />
										</div>

										<h3
											class="text-base leading-snug font-bold text-text-main transition-colors duration-300 group-hover:text-accent-primary sm:text-lg"
										>
											{perminatan.title}
										</h3>
									</div>

									<p class="line-clamp-4 text-xs leading-relaxed text-text-muted sm:text-sm">
										{perminatan.description}
									</p>
								</div>
							</article>
						{/each}
					</div>
				</div>
			{:else}
				<!-- Empty State (Variabel Tema) -->
				<div
					class="mx-auto max-w-lg rounded-3xl border border-border-color bg-bg-secondary p-10 text-center shadow-xl backdrop-blur-xl"
				>
					<div
						class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border-color bg-bg-secondary-hover text-text-muted shadow-inner"
					>
						<BookOpenIcon class="h-8 w-8" />
					</div>
					<h3 class="mb-2 text-lg font-bold text-text-main">Belum Ada Perminatan TI</h3>
					<p class="text-xs leading-relaxed text-text-muted sm:text-sm">
						Data peminatan bidang keahlian belum ditambahkan. Silakan periksa kembali nanti.
					</p>
				</div>
			{/if}
		{:catch error}
			<!-- Error State (Status Error Tema) -->
			<div
				class="mx-auto max-w-lg rounded-3xl border border-status-error/30 bg-status-error/10 p-8 text-center shadow-xl backdrop-blur-xl"
			>
				<div
					class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-status-error/30 bg-status-error/20 text-status-error shadow-inner"
				>
					<AlertCircle class="h-7 w-7" />
				</div>
				<h3 class="mb-2 text-lg font-bold text-text-main">Gagal Memuat Data</h3>
				<p class="text-xs leading-relaxed text-status-error sm:text-sm">
					{error.message || 'Terjadi kesalahan saat mengambil data peminatan.'}
				</p>
			</div>
		{/await}
	</div>
</section>

<!-- kategori profil prodi -->
<section class=" w-full bg-bg-secondary py-12">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		{#await listProfil}
			<Spin />
		{:then items}
			{#if items && items.length > 0}
				<div class="section-group space-y-8">
					<div class="flex items-center justify-center pb-5">
						<div class="flex flex-wrap items-center gap-3">
							<h2 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">
								Informasi
							</h2>
							<span
								class="rounded-lg border border-border-color/10 bg-bg-secondary/5 px-2.5 py-1 text-xs font-semibold text-text-muted"
							>
								{items.length} Program Studi
							</span>
						</div>
					</div>

					<!-- Container Pembungkus Dinamis (Di Luar Loop) -->
					<div
						class={getContainerLayoutClass(
							items[0]?.display_instruction || 'FLEX_CENTER',
							items.length
						)}
					>
						{#each items as profil (profil.id)}
							{@const instruction = profil.display_instruction || 'FLEX_CENTER'}
							{@const isSplitLeft = instruction === 'SPLIT_IMAGE_LEFT'}
							{@const isSplitRight = instruction === 'SPLIT_IMAGE_RIGHT'}
							{@const isSplitLayout = isSplitLeft || isSplitRight}
							{@const isMergedCard = instruction === 'MERGED_CARD'}

							<!-- Ambil daftar gambar (Array images baru atau fallback ke image_url lama) -->
							{@const imageList =
								profil.images && profil.images.length > 0
									? profil.images
									: profil.image_url
										? [{ url: profil.image_url, caption: profil.title }]
										: []}
							{@const primaryImage = imageList[0]?.url || null}

							<article
								class="{getItemLayoutClass(instruction)} group relative transition-all duration-300
                {isMergedCard
									? 'w-full p-6 transition-colors hover:bg-bg-secondary-hover'
									: isSplitLayout
										? 'flex w-full flex-col gap-6 rounded-2xl border border-border-color bg-bg-secondary p-6 shadow-[0_4px_0_0_var(--border-color)] hover:-translate-y-1 hover:bg-bg-secondary-hover hover:shadow-[0_8px_0_0_var(--border-color)] lg:flex-row ' +
											(isSplitRight ? 'lg:flex-row-reverse' : '')
										: 'flex flex-col justify-between border border-border-color bg-bg-secondary p-5 text-center shadow-[0_4px_0_0_var(--border-color)] hover:-translate-y-1 hover:scale-[1.02] hover:bg-bg-secondary-hover hover:shadow-[0_8px_0_0_var(--border-color)]'}"
							>
								<!-- BAGIAN 1: FRAME GAMBAR / GALERI -->
								<div
									class="relative flex flex-col justify-center overflow-hidden
                    {isSplitLayout ? 'w-full shrink-0 lg:w-1/2' : 'w-full'}"
								>
									<div
										class="relative overflow-hidden border border-border-color bg-bg-primary transition-colors duration-300 group-hover:border-border-color
                        {isSplitLayout ? 'h-64 rounded-xl sm:h-72' : 'mb-4 h-48 w-full'}"
									>
										{#if primaryImage}
											<img
												src={primaryImage}
												alt={profil.title}
												class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
												loading="lazy"
											/>

											<!-- Badge Indikator Banyak Gambar -->
											{#if imageList.length > 1}
												<div
													class="absolute right-2.5 bottom-2.5 flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-md"
												>
													<Images class="text-scitech-mint h-3.5 w-3.5" />
													<span>+{imageList.length - 1} Foto</span>
												</div>
											{/if}
										{:else}
											<div
												class="flex h-full w-full flex-col items-center justify-center text-text-muted"
											>
												<BuildingIcon
													class="mb-2 h-10 w-10 text-text-main transition-transform duration-300 group-hover:scale-110"
												/>
												<span class="text-xs font-bold tracking-wider text-text-muted uppercase">
													Profil Program Studi
												</span>
											</div>
										{/if}
									</div>

									<!-- Mini Gallery Thumbnails (Jika Ada Lebih Dari 1 Gambar pada Split Layout) -->
									{#if isSplitLayout && imageList.length > 1}
										<div class="mt-3 flex gap-2 overflow-x-auto pb-1">
											{#each imageList.slice(0, 4) as img, idx}
												<div
													class="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-border-color/30 bg-black/20"
												>
													<img
														src={img.url}
														alt="Thumbnail {idx + 1}"
														class="h-full w-full object-cover opacity-80 transition-opacity hover:opacity-100"
													/>
												</div>
											{/each}
										</div>
									{/if}
								</div>

								<!-- bagian 2: konten / judul & deskripsi -->
								<div
									class="flex flex-col justify-between
                    {isSplitLayout ? 'w-full text-left lg:w-1/2' : 'flex-1 items-center'}"
								>
									<div class={isSplitLayout ? 'space-y-3' : 'w-full'}>
										<!-- Judul Prodi -->
										<h3
											class="mb-2 text-base font-bold text-text-main transition-colors duration-300 group-hover:text-text-muted sm:text-lg
                            {isSplitLayout ? 'line-clamp-2 text-xl sm:text-2xl' : 'line-clamp-1'}"
										>
											{profil.title}
										</h3>

										<!-- Deskripsi Ringkas -->
										<p
											class="text-xs leading-relaxed text-text-muted sm:text-sm
                            {isSplitLayout ? 'mb-4 line-clamp-6' : 'mb-5 line-clamp-3'}"
										>
											{stripHtml(profil.description)}
										</p>
									</div>

									<!-- BAGIAN 3: FOOTER ACTION LINK -->
									<div
										class="pt-4
                        {isSplitLayout
											? 'border-t border-border-color/20'
											: 'flex w-full items-center justify-center border-t border-border-color'}"
									>
										<a
											href="/profil/profil-prodi/{profil.id}"
											class="group/link inline-flex items-center justify-center gap-2 border border-border-color bg-bg-primary px-4 py-2 text-xs font-bold text-text-main transition-all duration-200 hover:border-border-color hover:bg-bg-secondary-hover hover:text-text-main
                            {isSplitLayout ? 'rounded-xl px-5 py-2.5' : ''}"
										>
											<span>Detail </span>
											<ArrowRight
												class="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-1"
											/>
										</a>
									</div>
								</div>
							</article>
						{/each}
					</div>
				</div>
			{:else}
				<!-- Modern Empty State -->
				<div
					class="mx-auto max-w-lg rounded-3xl border border-border-color/10 bg-bg-primary/20 p-10 text-center shadow-xl backdrop-blur-xl"
				>
					<div
						class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border-color/20 bg-bg-primary/10 text-text-main/50 shadow-inner"
					>
						<Inbox class="h-8 w-8" />
					</div>
					<h3 class="mb-2 text-lg font-bold text-text-main">Belum Ada Informasi Prodi</h3>
					<p class="text-xs leading-relaxed text-text-muted">
						Saat ini belum tersedia profil informasi & pengaduan program studi. Silakan periksa
						kembali nanti.
					</p>
				</div>
			{/if}
		{:catch error}
			<!-- Modern Error State -->
			<div
				class="mx-auto max-w-lg rounded-3xl border border-rose-500/30 bg-rose-950/20 p-10 text-center text-rose-300 shadow-xl backdrop-blur-xl"
			>
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400 shadow-inner"
				>
					<AlertCircle class="h-8 w-8" />
				</div>
				<h3 class="mb-2 text-lg font-bold text-text-main">Gagal Memuat Profil Prodi</h3>
				<p class="text-xs leading-relaxed text-rose-300/80">
					Terjadi kendala saat mengambil data profil prodi. Silakan muat ulang halaman.
				</p>
			</div>
		{/await}
	</div>
</section>

<!-- kategori 1: dosen Primar -->
<section class=" w-full py-8">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		{#await listDosen}
			<div class="section-group space-y-6">
				<div class="mx-auto flex max-w-7xl items-center gap-3 space-y-16 px-6 py-12 lg:px-12">
					<div class="h-8 w-64 animate-pulse rounded-lg bg-bg-secondary/10"></div>
				</div>

				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{#each Array(4) as _}
						<div
							class="flex animate-pulse flex-col items-center rounded-2xl border border-border-color/10 bg-bg-secondary/40 p-6 backdrop-blur-md"
						>
							<div class="mb-4 h-24 w-24 rounded-full bg-bg-secondary/10"></div>
							<div class="mb-2 h-5 w-3/4 rounded bg-bg-secondary/10"></div>
							<div class="mb-3 h-3 w-1/2 rounded bg-bg-secondary/10"></div>
							<div class="h-4 w-full rounded bg-bg-secondary/10"></div>
						</div>
					{/each}
				</div>
			</div>
		{:then items}
			{#if items && items.length > 0}
				<div class="section-group">
					<!-- Header Section -->
					<div class="flex items-center justify-center">
						<h2
							class="group-title flex items-center gap-2 text-xl font-bold tracking-tight text-text-main sm:text-2xl"
						>
							<span
								class="inline-flex items-center gap-1.5 rounded-full border border-border-color/20 bg-bg-primary/10 px-3 py-1 text-xs font-semibold text-text-main"
							>
								<UsersIcon class="h-4 w-4" /> Dosen
							</span>
							Daftar Dosen Teknologi Infromasi
							<span class="ml-1 text-sm font-medium text-text-muted">({items.length})</span>
						</h2>
					</div>

					<!-- Grid Dosen & Staff -->
					<div class="relative py-16">
						<div
							class="bg-blend-hard-light/30 absolute inset-x-0 bottom-0 h-3/5 w-full border-y border-border-color"
						></div>

						<div
							class="grid w-full gap-6 {items.length === 1
								? 'mx-auto max-w-xl grid-cols-1'
								: items.length === 2
									? 'mx-auto max-w-4xl grid-cols-1 sm:grid-cols-2'
									: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}"
						>
							{#each items as dosen, index (dosen.primary_id)}
								{@const randomHeaderBg = headerColors[index % headerColors.length]}

								<article
									class={` ${classShadowDown} group relative flex w-full max-w-sm flex-col justify-between border border-border-color bg-bg-secondary
                      `}
								>
									<div>
										<div
											class="relative flex h-36 w-full justify-center border-b border-border-color {randomHeaderBg}"
										>
											<div
												class="absolute -bottom-16 aspect-square w-[70%] max-w-[180px] border-2 border-border-color bg-bg-primary p-1 shadow-md"
											>
												{#if dosen.photo_url}
													<img
														src={dosen.photo_url}
														alt={dosen.name}
														class="h-full w-full object-cover"
														loading="lazy"
													/>
												{:else}
													<div
														class="flex h-full w-full items-center justify-center bg-bg-secondary"
													>
														<UserIcon class="h-14 w-14 text-text-muted/60" />
													</div>
												{/if}
											</div>
										</div>

										<!-- 2. Area Isi Kartu (Top Padding Disesuaikan untuk Foto Besar) -->
										<div class="flex flex-col items-center px-6 pt-20 pb-10 text-center">
											<span
												class="mb-3 border border-border-color bg-bg-primary px-3 py-1 text-xs font-bold text-text-muted"
											>
												{dosen.position || 'Staf / Dosen'}
											</span>

											<h3
												class="mb-3 text-lg font-extrabold tracking-tight text-text-main transition-colors group-hover:text-accent-primary-dim"
											>
												{dosen.name}
											</h3>

											{#if dosen.expertise}
												<div
													class="mt-3 w-full border border-border-color bg-bg-primary/60 p-3 text-xs sm:text-sm"
												>
													<div
														class="mb-1.5 flex items-center justify-center gap-1.5 font-bold text-text-muted"
													>
														<AwardIcon class="h-4 w-4 text-accent-purple" />
														<span>Bidang Keahlian</span>
													</div>
													<p class="line-clamp-2 text-text-muted">
														{dosen.expertise}
													</p>
												</div>
											{/if}
										</div>
									</div>

									<!-- 3. Link di Pojok Kanan Bawah (Menempel Presisi di Sudut) -->
									{#if dosen.pddikti_url}
										<a
											href={dosen.pddikti_url}
											target="_blank"
											rel="noopener noreferrer"
											title="Lihat Profil PDDikti"
											class="absolute -right-3 -bottom-3 flex h-11 w-11 items-center justify-center border border-border-color bg-rose-500 text-white shadow-md transition-all duration-200 hover:scale-110 hover:bg-rose-600"
										>
											<ExternalLinkIcon class="h-5 w-5" />
										</a>
									{/if}
								</article>
							{/each}
						</div>
					</div>

					<div class="mt-8 flex justify-center pt-4">
						<button
							onclick={() => goto('/profil/dosen-staff')}
							class="group inline-flex items-center gap-2.5 rounded-2xl border border-border-color bg-bg-secondary px-6 py-3 text-sm font-bold text-text-main shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-purple/50 hover:bg-bg-secondary-hover hover:text-accent-purple hover:shadow-xl hover:shadow-accent-purple/10"
						>
							<span>Jelajahi Semua</span>
							<ArrowRightIcon
								class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
							/>
						</button>
					</div>
				</div>
			{:else}
				<div
					class="mx-auto max-w-lg rounded-2xl border border-dashed border-border-color/10 bg-bg-secondary/20 p-8 text-center backdrop-blur-md"
				>
					<UsersIcon class="mx-auto mb-3 h-10 w-10 text-text-muted/40" />
					<h3 class="mb-1 text-lg font-bold text-text-main">Belum Ada Data Dosen</h3>
					<p class="text-xs text-text-muted">Daftar dosen dan staf pengajar belum ditambahkan.</p>
				</div>
			{/if}
		{:catch error}
			<!-- Error State -->
			<div
				class="mx-auto max-w-lg rounded-2xl border border-rose-500/20 bg-rose-950/20 p-6 text-center text-rose-300 backdrop-blur-md"
			>
				<AlertCircle class="mx-auto mb-2 h-8 w-8 text-rose-400" />
				<p class="text-sm font-semibold">Gagal Memuat Data Dosen</p>
				<p class="mt-1 text-xs text-rose-300/80">{error.message}</p>
			</div>
		{/await}
	</div>
</section>
