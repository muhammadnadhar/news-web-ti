<script lang="ts">
	import EmptyData from '../../_components/emptyData.svelte';
	import type { PageData } from './$types';
	import { History, Users, User, Calendar, AlertCircle } from 'lucide-svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
	<!-- HEADER HALAMAN -->
	<div class="mb-12 border-b border-border-color/40 pb-6 text-center sm:text-left">
		<div
			class="bg-scitech-mint/10 text-scitech-mint mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
		>
			<History class="h-4 w-4" />
			<span>Profil Program Studi</span>
		</div>
		<h1 class="text-3xl font-extrabold tracking-tight text-text-main sm:text-4xl">
			{data.historyContent?.title ?? 'Sejarah Program Studi'}
		</h1>
		<p class="mt-2 text-sm text-text-muted">
			Mengenal rekam jejak, perkembangannya, dan kepemimpinan dari masa ke masa.
		</p>
	</div>

	<!-- bagian 1: konten sejarah utama -->
	{#if data.historyContent}
		<section class="mb-16">
			<div
				class="bg-scitech-slate/40 overflow-hidden rounded-2xl border border-border-color backdrop-blur-md"
			>
				{#if data.historyContent.image_url}
					<div class="relative h-64 w-full sm:h-96">
						<img
							src={data.historyContent.image_url}
							alt={data.historyContent.title}
							class="h-full w-full object-cover"
						/>
						<div
							class="from-scitech-navy/90 absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
						></div>
					</div>
				{/if}

				{#if data.historyContent.description}
					<div class="prose-scitech prose max-w-none p-6 prose-invert sm:p-10">
						{@html data.historyContent.description}
					</div>
				{/if}
			</div>
		</section>
	{/if}

	<!-- BAGIAN 2: SEJARAH PIMPINAN (PERIODE) -->
	<section>
		<div class="mb-8 flex items-center gap-3">
			<div
				class="bg-scitech-mint/10 text-scitech-mint flex h-10 w-10 items-center justify-center rounded-xl"
			>
				<Users class="h-5 w-5" />
			</div>
			<div>
				<h2 class="text-2xl font-bold text-text-main">Sejarah Pimpinan Jurusan</h2>
				<p class="text-xs text-text-muted">
					Daftar Ketua dan Sekretaris Program Studi berdasarkan periode kepemimpinan.
				</p>
			</div>
		</div>

		{#if data.historyLeaders && data.historyLeaders.length > 0}
			<div class="space-y-8">
				{#each data.historyLeaders as leader (leader.id)}
					<div
						class="bg-scitech-slate/40 overflow-hidden rounded-2xl border border-border-color p-6 backdrop-blur-md sm:p-8"
					>
						<div class="mb-6 flex items-center gap-2 border-b border-border-color/40 pb-4">
							<Calendar class="text-scitech-cyan h-4 w-4" />
							<span class="text-scitech-mint text-base font-bold">Periode {leader.period}</span>
						</div>

						<!-- Grid Ketua & Sekretaris -->
						<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div
								class="bg-scitech-navy/50 flex flex-col items-center gap-4 rounded-xl border border-border-color/30 p-4 sm:flex-row sm:items-start"
							>
								<div
									class="bg-scitech-slate flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border-color"
								>
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
									<span class="text-scitech-cyan text-[11px] font-semibold tracking-wider uppercase"
										>Ketua Program Studi</span
									>
									<h3 class="mt-1 text-base font-bold text-text-main">{leader.head_name}</h3>
								</div>
							</div>

							<div
								class="bg-scitech-navy/50 flex flex-col items-center gap-4 rounded-xl border border-border-color/30 p-4 sm:flex-row sm:items-start"
							>
								<div
									class="bg-scitech-slate flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border-color"
								>
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
									<span class="text-scitech-mint text-[11px] font-semibold tracking-wider uppercase"
										>Sekretaris Program Studi</span
									>
									<h3 class="mt-1 text-base font-bold text-text-main">{leader.secretary_name}</h3>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<EmptyData
				title="Data Pimpinan Belum Tersedia"
				description="	Belum ada riwayat pimpinan jurusan yang ditambahkan."
			/>
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
