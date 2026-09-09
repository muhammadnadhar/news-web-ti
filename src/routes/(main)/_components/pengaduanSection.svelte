<script lang="ts">
	import {
		ShieldCheck,
		Clock,
		QrCode,
		ExternalLink,
		Copy,
		Check,
		MessageSquareWarning,
		Sparkles
	} from 'lucide-svelte';

	let copied = $state(false);
	const complaintUrl = 'https://fst.ar-raniry.ac.id/pengaduan';

	function handleCopy() {
		navigator.clipboard.writeText(complaintUrl);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	}
</script>

<section class="relative mx-auto max-w-7xl px-6 py-16 lg:px-12">
	<!-- Background Glow Subtle -->
	<div
		class="from-scitech-mint/5 to-scitech-cyan/5 absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r via-transparent blur-3xl"
	></div>

	<div
		class="bg-scitech-slate/60 relative overflow-hidden rounded-3xl border border-white/10 p-8 shadow-2xl backdrop-blur-xl sm:p-12"
	>
		<div class="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
			<!-- Kolom Kiri: Informasi & Layanan -->
			<div class="space-y-6 lg:col-span-7">
				<div>
					<span
						class="text-scitech-mint mb-3 inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
					>
						<Sparkles class="text-scitech-mint h-4 w-4" /> Layanan Publik & Aspirasi
					</span>
					<h2 class="text-2xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl">
						Pusat Pengaduan & Layanan Aspirasi Mahasiswa
					</h2>
				</div>

				<p class="text-text-muted text-sm leading-relaxed sm:text-base">
					Prodi Teknologi Informasi FST UIN Ar-Raniry berkomitmen menciptakan lingkungan akademik
					yang transparan dan akuntabel. Sampaikan saran, kritik, maupun laporan Anda secara aman.
				</p>

				<!-- Garansi & Fitur Utama -->
				<div class="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
					<div class="flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-3.5">
						<div class="bg-scitech-mint/10 text-scitech-mint shrink-0 rounded-lg p-2">
							<ShieldCheck class="h-5 w-5" />
						</div>
						<div>
							<h4 class="text-xs font-bold text-white">Privasi Terjamin</h4>
							<p class="text-text-muted mt-0.5 text-[11px]">
								Identitas pelapor dapat disamarkan (Anonym).
							</p>
						</div>
					</div>

					<div class="flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-3.5">
						<div class="bg-scitech-cyan/10 text-scitech-cyan shrink-0 rounded-lg p-2">
							<Clock class="h-5 w-5" />
						</div>
						<div>
							<h4 class="text-xs font-bold text-white">Respon Cepat</h4>
							<p class="text-text-muted mt-0.5 text-[11px]">
								Ditindaklanjuti oleh tim pengelola fakultas.
							</p>
						</div>
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="flex flex-wrap items-center gap-4 pt-4">
					<a
						href={complaintUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover shadow-scitech-mint/20 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-bold shadow-lg transition-all duration-200 active:scale-95 sm:text-sm"
					>
						<MessageSquareWarning class="h-4 w-4" />
						<span>Form Pengaduan Online</span>
						<ExternalLink class="h-3.5 w-3.5 opacity-70" />
					</a>

					<button
						onclick={handleCopy}
						class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-semibold text-white transition-all hover:bg-white/10 active:scale-95 sm:text-sm"
					>
						{#if copied}
							<Check class="text-scitech-mint h-4 w-4" />
							<span class="text-scitech-mint">Tautan Menyalin</span>
						{:else}
							<Copy class="text-text-muted h-4 w-4" />
							<span>Salin Tautan</span>
						{/if}
					</button>
				</div>
			</div>

			<!-- Kolom Kanan: Card QR Code Modern -->
			<div class="flex justify-center lg:col-span-5">
				<div class="group relative w-full max-w-sm">
					<!-- Outer Glow Card -->
					<div
						class="from-scitech-mint to-scitech-cyan absolute -inset-1 rounded-3xl bg-gradient-to-r opacity-20 blur-lg transition duration-500 group-hover:opacity-40"
					></div>

					<!-- Card QR Code utama -->
					<div
						class="bg-scitech-navy/90 relative flex flex-col items-center rounded-3xl border border-white/15 p-6 text-center shadow-2xl backdrop-blur-md"
					>
						<div class="text-text-muted mb-4 flex items-center gap-2 text-xs font-semibold">
							<QrCode class="text-scitech-mint h-4 w-4" />
							<span>Pindai QR untuk Akses Cepat</span>
						</div>

						<!-- Kontainer QR Image -->
						<div
							class="mb-4 rounded-2xl border border-white/20 bg-white p-4 shadow-inner transition-transform duration-300 group-hover:scale-105"
						>
							<img
								src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https://fst.ar-raniry.ac.id/pengaduan&color=0b1329"
								alt="QR Code Pengaduan FST UIN Ar-Raniry"
								class="h-48 w-48 rounded-lg object-contain"
								loading="lazy"
							/>
						</div>

						<!-- ID Label Pengaduan -->
						<div
							class="text-scitech-mint rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs tracking-wider"
						>
							@ PENGADUAN FST UIN AR-RANIRY
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
