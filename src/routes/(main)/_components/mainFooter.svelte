<script lang="ts">
	import { ChevronRight, MapPin, Phone, Mail, ArrowUp, GitBranchPlusIcon } from 'lucide-svelte';

	// Props Svelte 5 (sesuaikan jika memakai Svelte 4)
	let { layananOnline = [], scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' }) } =
		$props();

	const currentYear = new Date().getFullYear();
</script>

<footer class="relative mt-28 border-t border-border-color text-text-muted transition-colors">
	<!-- svg curve wave vector (warna menyatu presisi dengan bg-[#070c18]) -->
	<div
		class="pointer-events-none absolute top-0 left-0 w-full -translate-y-[98%] overflow-hidden leading-none"
	>
		<svg
			class="relative block h-12 w-full text-bg-secondary sm:h-20 md:h-28"
			viewBox="0 0 1200 120"
			preserveAspectRatio="none"
		>
			<path d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z" fill="currentColor"></path>
		</svg>
	</div>

	<!-- Sci-Tech Ambient Glow Border Top -->
	<div class="via-scitech-mint/40 absolute top-0 left-0 h-px w-full bg-bg-secondary"></div>

	<!-- Main Footer Content -->
	<div class="mx-auto bg-bg-secondary px-6 pt-8 pb-16">
		<div class="grid grid-cols-1 items-start gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
			<div class="flex flex-col gap-4 lg:col-span-5">
				<div class="flex items-start gap-3">
					<div
						class="bg-scitech-mint/10 border-scitech-mint/30 shrink-0 rounded-xl border p-2 backdrop-blur-md"
					>
						<div
							class="bg-scitech-mint text-scitech-navy flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black shadow-md"
						>
							UIN
						</div>
					</div>
					<div>
						<h3 class="text-scitech-mint text-base leading-snug font-bold tracking-wide uppercase">
							Prodi Teknologi Informasi
						</h3>
						<p class="text-xs font-semibold tracking-wider text-text-main uppercase">
							Fakultas Sains dan Teknologi
						</p>
					</div>
				</div>

				<p class="max-w-md text-xs leading-relaxed text-text-muted sm:text-sm">
					Program Studi Teknologi Informasi Fakultas Sains dan Teknologi Universitas Islam Negeri
					Ar-Raniry, Banda Aceh.
				</p>

				<!-- Social Media Links -->
				<div class="flex items-center gap-3 pt-2">
					<a
						href="https://www.youtube.com/@programstuditeknologiinfor1880"
						aria-label="YouTube"
						class="hover:bg-scitech-mint hover:text-scitech-navy text-scitech-mint rounded-xl border border-white/10 bg-white/5 p-2.5 shadow-md transition-all duration-300"
					>
						Youtube
						<!-- <Youtube class="w-4 h-4" /> -->
					</a>
					<a
						href="https://www.instagram.com/infotech.uinarraniry?igshid=YmMyMTA2M2Y%3D"
						aria-label="Instagram"
						class="hover:bg-scitech-mint hover:text-scitech-navy text-scitech-mint rounded-xl border border-white/10 bg-white/5 p-2.5 shadow-md transition-all duration-300"
					>
						Instagram
						<!-- <Instagram class="w-4 h-4" /> -->
					</a>
				</div>
			</div>

			<!-- Kolom 2: Layanan Online -->
			<div class="flex flex-col gap-4 lg:col-span-4">
				<h4 class="text-scitech-mint text-xs font-bold tracking-wider uppercase">Layanan Online</h4>
				<ul class="grid grid-cols-1 gap-2.5 text-xs sm:grid-cols-2 sm:text-sm lg:grid-cols-1">
					{#each layananOnline as item}
						<li>
							<a
								href={item.url}
								class="hover:text-scitech-mint group inline-flex items-center gap-1.5 text-text-muted transition-colors"
							>
								<ChevronRight
									class="text-scitech-cyan h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
								/>
								<span>{item.label}</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Kolom 3: Contact Us -->
			<div class="flex flex-col gap-4 lg:col-span-3">
				<h4 class="text-scitech-mint text-xs font-bold tracking-wider uppercase">Contact Us</h4>

				<div class="space-y-3 text-xs leading-relaxed sm:text-sm">
					<div class="flex items-start gap-3">
						<MapPin class="text-scitech-cyan mt-1 h-4 w-4 shrink-0" />
						<span>Jln. Syeikh Abdul Rauf Kopelma Darussalam Banda Aceh, 23111 INDONESIA</span>
					</div>

					<div class="flex items-start gap-3">
						<Phone class="text-scitech-cyan mt-1 h-4 w-4 shrink-0" />
						<div class="flex flex-col">
							<span class="text-[11px] text-text-muted">Phone:</span>
							<a href="tel:+6281360055730" class="hover:text-scitech-mint transition-colors">
								+62 813-6005-5730
							</a>
							<a href="tel:+6282174335947" class="hover:text-scitech-mint transition-colors">
								+62 821-7433-5947
							</a>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<Mail class="text-scitech-cyan mt-1 h-4 w-4 shrink-0" />
						<div class="flex flex-col">
							<span class="text-[11px] text-text-muted">Email:</span>
							<a
								href="mailto:fst.ti@ar-raniry.ac.id"
								class="hover:text-scitech-mint transition-colors"
							>
								fst.ti@ar-raniry.ac.id
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="space-y-1">
		<p>
			© Copyright <span class="text-scitech-mint font-semibold">Prodi Teknologi Informasi</span>
			2023-{currentYear}.
		</p>
		<p>
			© Powered by <span class="font-semibold text-text-main">HIMA-TI</span>. All Rights Reserved.
		</p>
	</div>
</footer>
