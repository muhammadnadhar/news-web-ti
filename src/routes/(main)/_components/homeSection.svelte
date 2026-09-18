<script lang="ts">
	import UserCard from '$lib/components/admin/userCard.svelte';
	import type { PrimaryDosenDTO } from '$lib/types/admin/home';
	import type { PerminatanTIItemDTO } from '$lib/types/admin/home';
	import type { ProfilProdiItemDTO } from '$lib/types/admin/home';
	import { stripHtml } from '$lib/utils';
	import {
		AlertCircle,
		ArrowRight,
		AwardIcon,
		BookOpenIcon,
		BuildingIcon,
		ExternalLinkIcon,
		GraduationCapIcon,
		IdCardIcon,
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
</script>

<!-- kategori  perminatan ti -->
<section class=" w-full bg-bg-primary py-12">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		{#await listPerminatan}
			<!-- Skeleton Loading State (Menggunakan variabel tema) -->
			<div class="section-group space-y-8">
				<div class="flex items-center gap-3">
					<div class="h-9 w-72 animate-pulse rounded-full bg-bg-secondary-hover"></div>
				</div>

				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{#each Array(3) as _}
						<div
							class="flex h-56 animate-pulse flex-col justify-center overflow-hidden rounded-3xl border border-border-color bg-bg-secondary p-6 shadow-sm"
						>
							<div class="space-y-4">
								<div class="flex items-center gap-3">
									<div class="h-12 w-12 rounded-2xl bg-bg-secondary-hover"></div>
									<div class="h-6 w-3/4 rounded-lg bg-bg-secondary-hover"></div>
								</div>
								<div class="space-y-2 pt-2">
									<div class="h-3.5 w-full rounded bg-bg-secondary-hover"></div>
									<div class="h-3.5 w-4/5 rounded bg-bg-secondary-hover"></div>
									<div class="h-3.5 w-2/3 rounded bg-bg-secondary-hover"></div>
								</div>
							</div>
							<div class="h-3 w-32 rounded bg-bg-secondary-hover"></div>
						</div>
					{/each}
				</div>
			</div>
		{:then list}
			{#if list && list.length > 0}
				<div class="section-group space-y-8">
					<!-- Header Section -->
					<div class="flex items-center justify-center pb-5">
						<div class="flex flex-wrap items-center gap-3">
							<!-- <span -->
							<!-- 	class="inline-flex items-center gap-2 rounded-full border border-accent-purple/30 bg-accent-purple/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-accent-purple shadow-sm backdrop-blur-md" -->
							<!-- > -->
							<!-- 	<Layers class="h-4 w-4 text-accent-purple" /> -->
							<!-- 	Perminatan -->
							<!-- </span> -->
							<h2 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">
								Bidang Keahlian TI
							</h2>
							<span
								class="rounded-lg border border-border-color bg-bg-secondary-hover px-2.5 py-1 text-xs font-semibold text-text-muted"
							>
								{list.length} Bidang
							</span>
						</div>
					</div>

					<!-- Grid Cards -->
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{#each list as perminatan (perminatan.id)}
							<article
								class="group relative flex flex-col justify-center overflow-hidden rounded-3xl border border-border-color bg-bg-secondary p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-accent-purple/50 hover:bg-bg-primary-glare hover:shadow-xl hover:shadow-accent-purple/5"
							>
								<!-- Subtle Glow Accent saat Hover -->
								<div
									class="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-accent-purple/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
								></div>

								<div class="relative space-y-4">
									<div class="flex items-start gap-3.5">
										<div
											class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-accent-purple/30 bg-accent-purple/10 text-accent-purple transition-all duration-300 group-hover:border-accent-purple group-hover:bg-accent-purple group-hover:text-text-dark group-hover:shadow-lg group-hover:shadow-accent-purple/20"
										>
											<BookOpenIcon class="h-6 w-6" />
										</div>
										<h3
											class="text-lg leading-snug font-bold text-text-main transition-colors duration-300 group-hover:text-accent-purple"
										>
											{perminatan.title}
										</h3>
									</div>

									<!-- Description -->
									<p class="line-clamp-4 text-xs leading-relaxed text-text-muted sm:text-sm">
										{perminatan.description}
									</p>
								</div>

								<!-- Footer Meta (Tanggal Perubahan) -->
								{#if perminatan.updated_at || perminatan.created_at}
									<div
										class="relative mt-6 border-t border-border-color pt-4 text-xs font-medium text-text-muted"
									>
										Perubahan: {new Date(
											perminatan.updated_at || perminatan.created_at || ''
										).toLocaleDateString('id-ID', {
											day: 'numeric',
											month: 'short',
											year: 'numeric'
										})}
									</div>
								{/if}
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
			<!-- Skeleton Loading State (Modern Glow & Pulse) -->
			<div class="section-group space-y-8">
				<div class="flex items-center gap-3">
					<div class="h-9 w-72 animate-pulse rounded-full bg-white/10"></div>
				</div>

				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{#each Array(3) as _}
						<div
							class="flex animate-pulse flex-col justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
						>
							<div class="space-y-4">
								<div class="h-48 w-full rounded-2xl bg-white/10"></div>
								<div class="h-6 w-3/4 rounded-lg bg-white/10"></div>
								<div class="space-y-2">
									<div class="h-3.5 w-full rounded bg-white/10"></div>
									<div class="h-3.5 w-4/5 rounded bg-white/10"></div>
								</div>
							</div>
							<div class="mt-6 h-10 w-36 rounded-xl bg-white/10"></div>
						</div>
					{/each}
				</div>
			</div>
		{:then items}
			{#if items && items.length > 0}
				<div class="section-group space-y-8">
					<!-- Header Section -->
					<div class="flex items-center justify-center pb-5">
						<div class="flex flex-wrap items-center gap-3">
							<!-- <span -->
							<!-- 	class="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-emerald-400 shadow-sm backdrop-blur-md" -->
							<!-- > -->
							<!-- 	<GraduationCapIcon class="h-4 w-4" /> Profil Prodi -->
							<!-- </span> -->
							<h2 class="text-2xl font-extrabold tracking-tight text-text-main sm:text-3xl">
								Informasi & Pengaduan
							</h2>
							<span
								class="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-text-muted"
							>
								{items.length} Program Studi
							</span>
						</div>
					</div>

					<!-- Grid Profil Prodi (Modern Glassmorphism Cards) -->
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{#each items as profil (profil.id)}
							<article
								class="group align-center relative flex flex-col justify-center overflow-hidden rounded-3xl border border-white/10 bg-bg-primary/30 p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10"
							>
								<!-- Subtle Glow Background Effect on Hover -->
								<div
									class="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-emerald-500/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
								></div>

								<div>
									<!-- Container Gambar dengan Zoom Effect & Gradient Overlay -->
									<div
										class="relative mb-5 h-48 w-full overflow-hidden rounded-2xl bg-slate-900/60 shadow-inner"
									>
										{#if profil.image_url}
											<img
												src={profil.image_url}
												alt={profil.title}
												class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
												loading="lazy"
											/>
										{:else}
											<div
												class="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-400"
											>
												<BuildingIcon
													class="mb-2 h-10 w-10 opacity-30 transition-transform duration-500 group-hover:scale-110"
												/>
												<span class="text-xs font-medium tracking-wide text-slate-400/80"
													>Profil Program Studi</span
												>
											</div>
										{/if}

										<!-- Multi-layer Gradient Overlay -->
										<div
											class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"
										></div>
									</div>

									<!-- Judul Prodi & Deskripsi -->
									<h3
										class="mb-2 line-clamp-1 text-lg font-bold tracking-tight text-text-main transition-colors duration-300 group-hover:text-emerald-400"
									>
										{profil.title}
									</h3>
									<p
										class="mb-5 line-clamp-3 text-xs leading-relaxed text-text-muted/90 sm:text-sm"
									>
										{stripHtml(profil.description)}
									</p>
								</div>

								<!-- Footer Action Link -->
								<div class="flex items-center justify-center border-t border-white/5 pt-4">
									<a
										href="/prodi/{profil.id}"
										class="group/link inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400 transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-500 hover:text-white hover:shadow-lg hover:shadow-emerald-500/20"
									>
										<span>Detail & Pengaduan</span>
										<ArrowRight
											class="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1"
										/>
									</a>
								</div>
							</article>
						{/each}
					</div>
				</div>
			{:else}
				<!-- Modern Empty State -->
				<div
					class="mx-auto max-w-lg rounded-3xl border border-white/10 bg-bg-primary/20 p-10 text-center shadow-xl backdrop-blur-xl"
				>
					<div
						class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-inner"
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
							class="flex animate-pulse flex-col items-center rounded-2xl border border-white/10 bg-bg-secondary/40 p-6 backdrop-blur-md"
						>
							<div class="mb-4 h-24 w-24 rounded-full bg-white/10"></div>
							<div class="mb-2 h-5 w-3/4 rounded bg-white/10"></div>
							<div class="mb-3 h-3 w-1/2 rounded bg-white/10"></div>
							<div class="h-4 w-full rounded bg-white/10"></div>
						</div>
					{/each}
				</div>
			</div>
		{:then items}
			{#if items && items.length > 0}
				<div class="section-group space-y-6">
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
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{#each items as dosen (dosen.primary_id)}
							<article
								class="group 0 relative flex flex-col justify-center overflow-hidden rounded-2xl border border-border-color/10 bg-bg-secondary p-6 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-bg-secondary/60 hover:shadow-xl hover:shadow-cyan-500/5"
							>
								<div
									class="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-bg-secondary/5 blur-xl transition-all duration-300 group-hover:bg-bg-secondary-hover"
								></div>

								<div class="relative flex flex-col items-center">
									<div class="relative mb-4">
										<div
											class="h-24 w-24 overflow-hidden rounded-full border-2 border-border-color bg-slate-800 p-0.5 shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:bg-bg-secondary-hover/20"
										>
											{#if dosen.photo_url}
												<img
													src={dosen.photo_url}
													alt={dosen.name}
													class="h-full w-full rounded-full object-cover"
													loading="lazy"
												/>
											{:else}
												<div
													class="0 flex h-full w-full items-center justify-center rounded-full bg-slate-900"
												>
													<UserIcon class="h-10 w-10 opacity-60" />
												</div>
											{/if}
										</div>
									</div>

									<span
										class="mb-2 inline-block rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold"
									>
										{dosen.position || 'Staf / Dosen'}
									</span>

									<h3
										class="mb-1 text-base leading-snug font-bold text-text-main transition-colors group-hover:bg-bg-secondary-hover"
									>
										{dosen.name}
									</h3>

									<!-- {#if dosen.nidn} -->
									<!-- 	<p class="mb-3 flex items-center gap-1 text-xs text-text-muted"> -->
									<!-- 		<IdCardIcon class="h-3.5 w-3.5 text-cyan-400/80" /> -->
									<!-- 		<span>NIDN: {dosen.nidn}</span> -->
									<!-- 	</p> -->
									<!-- {/if} -->

									{#if dosen.expertise}
										<div
											class="mt-2 w-full rounded-xl border border-border-color/5 bg-bg-primary/10 p-2.5 text-xs"
										>
											<div
												class="mb-1 flex items-center justify-center gap-1 font-semibold text-text-muted/80"
											>
												<AwardIcon class="h-3.5 w-3.5" />
												<span>Bidang Keahlian</span>
											</div>
											<p class="line-clamp-2 text-text-muted">
												{dosen.expertise}
											</p>
										</div>
									{/if}
								</div>

								<!-- Footer: PDDikti Link (Jika Ada) -->
								{#if dosen.pddikti_url}
									<div class="mt-5 border-t pt-3">
										<a
											href={dosen.pddikti_url}
											target="_blank"
											rel="noopener noreferrer"
											class="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-text-main transition-colors hover:text-text-main/25 hover:underline"
										>
											<span>Profil PDDikti</span>
											<ExternalLinkIcon class="h-3.5 w-3.5" />
										</a>
									</div>
								{/if}
							</article>
						{/each}
					</div>
				</div>
			{:else}
				<div
					class="mx-auto max-w-lg rounded-2xl border border-dashed border-white/10 bg-bg-secondary/20 p-8 text-center backdrop-blur-md"
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
