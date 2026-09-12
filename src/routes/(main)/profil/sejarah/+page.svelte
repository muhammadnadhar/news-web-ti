<script lang="ts">
	import type { PageData } from './$types';
	import { History, Users, User, Calendar, AlertCircle } from 'lucide-svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
	<!-- HEADER HALAMAN -->
	<div class="mb-12 text-center sm:text-left border-b border-border-color/40 pb-6">
		<div class="mb-3 inline-flex items-center gap-2 rounded-full bg-scitech-mint/10 px-3 py-1 text-xs font-semibold text-scitech-mint">
			<History class="h-4 w-4" />
			<span>Profil Program Studi</span>
		</div>
		<h1 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
			{data.historyContent?.title ?? 'Sejarah Program Studi'}
		</h1>
		<p class="mt-2 text-sm text-text-muted">
			Mengenal rekam jejak, perkembangannya, dan kepemimpinan dari masa ke masa.
		</p>
	</div>

	<!-- BAGIAN 1: KONTEN SEJARAH UTAMA -->
	{#if data.historyContent}
		<section class="mb-16">
			<div class="overflow-hidden rounded-2xl border border-border-color bg-scitech-slate/40 backdrop-blur-md">
				{#if data.historyContent.image_url}
					<div class="relative h-64 w-full sm:h-96">
						<img
							src={data.historyContent.image_url}
							alt={data.historyContent.title}
							class="h-full w-full object-cover"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-scitech-navy/90 via-transparent to-transparent"></div>
					</div>
				{/if}

				{#if data.historyContent.description}
					<div class="prose prose-invert prose-scitech max-w-none p-6 sm:p-10">
						{@html data.historyContent.description}
					</div>
				{/if}
			</div>
		</section>
	{/if}

	<!-- BAGIAN 2: SEJARAH PIMPINAN (PERIODE) -->
	<section>
		<div class="mb-8 flex items-center gap-3">
			<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-scitech-mint/10 text-scitech-mint">
				<Users class="h-5 w-5" />
			</div>
			<div>
				<h2 class="text-2xl font-bold text-white">Sejarah Pimpinan Jurusan</h2>
				<p class="text-xs text-text-muted">Daftar Ketua dan Sekretaris Program Studi berdasarkan periode kepemimpinan.</p>
			</div>
		</div>

		{#if data.historyLeaders && data.historyLeaders.length > 0}
			<div class="space-y-8">
				{#each data.historyLeaders as leader (leader.id)}
					<div class="overflow-hidden rounded-2xl border border-border-color bg-scitech-slate/40 backdrop-blur-md p-6 sm:p-8">
						<!-- Periode Tag -->
						<div class="mb-6 flex items-center gap-2 border-b border-border-color/40 pb-4">
							<Calendar class="h-4 w-4 text-scitech-cyan" />
							<span class="text-base font-bold text-scitech-mint">Periode {leader.period}</span>
						</div>

						<!-- Grid Ketua & Sekretaris -->
						<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<!-- KETUA PRODI -->
							<div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 rounded-xl border border-border-color/30 bg-scitech-navy/50 p-4">
								<div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-border-color bg-scitech-slate flex items-center justify-center">
									{#if leader.head_photo}
										<img
											src={leader.head_photo}
											alt={leader.head_name}
											class="h-full w-full object-cover"
										/>
									{:else}
										<User class="h-10 w-10 text-text-muted" />
									{/if}
								</div>
								<div class="text-center sm:text-left">
									<span class="text-[11px] font-semibold tracking-wider text-scitech-cyan uppercase">Ketua Program Studi</span>
									<h3 class="mt-1 text-base font-bold text-white">{leader.head_name}</h3>
								</div>
							</div>

							<!-- SEKRETARIS PRODI -->
							<div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 rounded-xl border border-border-color/30 bg-scitech-navy/50 p-4">
								<div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-border-color bg-scitech-slate flex items-center justify-center">
									{#if leader.secretary_photo}
										<img
											src={leader.secretary_photo}
											alt={leader.secretary_name}
											class="h-full w-full object-cover"
										/>
									{:else}
										<User class="h-10 w-10 text-text-muted" />
									{/if}
								</div>
								<div class="text-center sm:text-left">
									<span class="text-[11px] font-semibold tracking-wider text-scitech-mint uppercase">Sekretaris Program Studi</span>
									<h3 class="mt-1 text-base font-bold text-white">{leader.secretary_name}</h3>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center rounded-2xl border border-border-color bg-scitech-slate/20 p-12 text-center backdrop-blur-md">
				<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
					<AlertCircle class="h-6 w-6" />
				</div>
				<h3 class="text-lg font-bold text-white">Data Pimpinan Belum Tersedia</h3>
				<p class="mt-1 max-w-md text-xs text-text-muted">
					Belum ada riwayat pimpinan jurusan yang ditambahkan.
				</p>
			</div>
		{/if}
	</section>
</div>

<style>
	:global(.prose a) {
		color: #2dd4bf;
		text-decoration: underline;
	}
	:global(.prose p) {
		color: #cbd5e1;
		line-height: 1.75;
	}
</style>
