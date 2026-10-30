<script lang="ts">
	import {
		History,
		Save,
		Image as ImageIcon,
		Upload,
		Trash2,
		Bold,
		Italic,
		List,
		ListOrdered,
		Link as LinkIcon,
		CheckCircle2,
		FileText
	} from 'lucide-svelte';

	// State Svelte 5 Runes
	let judul = $state('Sejarah Program Studi');
	let isSaving = $state(false);
	let showSuccess = $state(false);
	let imagePreview = $state<string | null>(
		'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800'
	);

	// Mockup Isi Sejarah
	let isiSejarah = $state(
		`Program Strata-1 Teknologi Informasi, Fakultas Sains dan Teknologi, Universitas Islam Negeri Ar-Raniry, resmi diselenggarakan pada Semester Ganjil tahun akademik 2018/2019, tepatnya 3 September 2019.\n\nLahirnya Surat Keputusan tersebut berdasarkan penilaian oleh Kemenristek Dikti dan BAN-PT terhadap Instrumen Prodi Baru yang diusulkan oleh 7 (tujuh) orang Dosen pendiri.`
	);

	function handleSave() {
		isSaving = true;
		setTimeout(() => {
			isSaving = false;
			showSuccess = true;
			setTimeout(() => (showSuccess = false), 3000);
		}, 800);
	}

	function handleImageUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			const file = target.files[0];
			imagePreview = URL.createObjectURL(file);
		}
	}

	function removeImage() {
		imagePreview = null;
	}
</script>

<div class="mx-auto max-w-7xl space-y-6">
	<!-- HEADER SECTION -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<div class="text-scitech-mint flex items-center gap-2 font-mono text-xs">
				<History class="h-4 w-4" />
				<span>PROFIL // SEJARAH MANAGEMENT</span>
			</div>
			<h1 class="mt-1 text-xl font-bold tracking-tight text-text-main sm:text-2xl">
				Kelola Data Sejarah
			</h1>
			<p class="text-xs text-text-muted">
				Perbarui profil riwayat dan latar belakang pendirian Prodi Teknologi Informasi.
			</p>
		</div>

		<!-- ACTION BUTTONS -->
		<div class="flex items-center gap-3">
			{#if showSuccess}
				<div
					class="border-scitech-mint/30 bg-scitech-mint/10 text-scitech-mint inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold"
				>
					<CheckCircle2 class="h-4 w-4" />
					<span>Tersimpan!</span>
				</div>
			{/if}

			<button
				type="button"
				onclick={handleSave}
				disabled={isSaving}
				class="bg-scitech-mint text-scitech-navy shadow-scitech-mint/10 hover:bg-scitech-mint-hover inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
			>
				<Save class="h-4 w-4" />
				<span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
			</button>
		</div>
	</div>

	<!-- FORM GRID CONTENT -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
		<!-- KOLOM KIRI: INPUT EDITING UTAMA (8 Cols) -->
		<div class="space-y-6 lg:col-span-8">
			<!-- CARD EDIT JUDUL & KONTEN -->
			<div
				class="bg-scitech-slate/60 space-y-5 rounded-2xl border border-white/10 p-5 shadow-2xl backdrop-blur-xl"
			>
				<!-- Input Judul -->
				<div class="space-y-2">
					<label
						for="judul-sejarah"
						class="text-scitech-cyan flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase"
					>
						<FileText class="h-3.5 w-3.5" />
						Judul Sejarah <span class="text-status-error">*</span>
					</label>
					<input
						id="judul-sejarah"
						type="text"
						bind:value={judul}
						placeholder="Masukkan judul halaman sejarah..."
						class="bg-scitech-navy/80 focus:border-scitech-mint focus:ring-scitech-mint w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-white placeholder-text-muted transition-all focus:ring-1 focus:outline-none"
					/>
				</div>

				<!-- Rich Text Editor Container Mockup -->
				<div class="space-y-2">
					<label
						for="editor-sejarah"
						class="text-scitech-cyan flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase"
					>
						<FileText class="h-3.5 w-3.5" />
						Isi Konten Sejarah <span class="text-status-error">*</span>
					</label>

					<div class="bg-scitech-navy/80 overflow-hidden rounded-xl border border-white/10">
						<!-- WYSIWYG Toolbar -->
						<div
							class="flex flex-wrap items-center gap-1 border-b border-white/10 bg-white/5 p-2 text-text-muted"
						>
							<button
								type="button"
								class="rounded-lg p-1.5 transition-colors hover:bg-white/10 hover:text-white"
							>
								<Bold class="h-4 w-4" />
							</button>
							<button
								type="button"
								class="rounded-lg p-1.5 transition-colors hover:bg-white/10 hover:text-white"
							>
								<Italic class="h-4 w-4" />
							</button>
							<div class="mx-1 h-4 w-px bg-white/10"></div>
							<button
								type="button"
								class="rounded-lg p-1.5 transition-colors hover:bg-white/10 hover:text-white"
							>
								<List class="h-4 w-4" />
							</button>
							<button
								type="button"
								class="rounded-lg p-1.5 transition-colors hover:bg-white/10 hover:text-white"
							>
								<ListOrdered class="h-4 w-4" />
							</button>
							<div class="mx-1 h-4 w-px bg-white/10"></div>
							<button
								type="button"
								class="rounded-lg p-1.5 transition-colors hover:bg-white/10 hover:text-white"
							>
								<LinkIcon class="h-4 w-4" />
							</button>
						</div>

						<!-- Textarea Editor -->
						<textarea
							id="editor-sejarah"
							bind:value={isiSejarah}
							rows="14"
							placeholder="Tuliskan narasi lengkap sejarah pendirian prodi..."
							class="w-full resize-y bg-transparent p-4 text-xs leading-relaxed text-white placeholder-text-muted focus:outline-none sm:text-sm"
						></textarea>
					</div>
					<span class="text-[11px] text-text-muted"
						>Mendukung format paragraf, daftar poin dosen pendiri, dan kriteria BAN-PT.</span
					>
				</div>
			</div>
		</div>

		<!-- KOLOM KANAN: MEDIA UPLOADER & PREVIEW CARD (4 Cols) -->
		<div class="space-y-6 lg:col-span-4">
			<div
				class="bg-scitech-slate/60 space-y-4 rounded-2xl border border-white/10 p-5 shadow-2xl backdrop-blur-xl"
			>
				<div class="flex items-center justify-between">
					<span
						class="text-scitech-cyan flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase"
					>
						<ImageIcon class="h-3.5 w-3.5" /> Foto Banner
					</span>
					{#if imagePreview}
						<button
							type="button"
							onclick={removeImage}
							class="inline-flex items-center gap-1 text-[11px] text-status-error hover:underline"
						>
							<Trash2 class="h-3 w-3" /> Hapus
						</button>
					{/if}
				</div>

				<!-- Image Preview Container -->
				{#if imagePreview}
					<div
						class="group bg-scitech-navy relative aspect-video w-full overflow-hidden rounded-xl border border-white/10"
					>
						<img
							src={imagePreview}
							alt="Foto Gedung Sejarah"
							class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div
							class="bg-scitech-navy/60 absolute inset-0 flex items-center justify-center gap-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
						>
							<label
								class="bg-scitech-mint text-scitech-navy hover:bg-scitech-mint-hover cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold transition-colors"
							>
								Ganti Foto
								<input type="file" accept="image/*" class="hidden" onchange={handleImageUpload} />
							</label>
						</div>
					</div>
				{:else}
					<!-- Upload Dropzone -->
					<label
						class="bg-scitech-navy/50 hover:border-scitech-mint/50 hover:bg-scitech-navy flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/15 p-8 text-center transition-all"
					>
						<div class="bg-scitech-mint/10 text-scitech-mint rounded-full p-3">
							<Upload class="h-5 w-5" />
						</div>
						<div class="space-y-1">
							<p class="text-xs font-semibold text-white">Klik untuk unggah foto gedung</p>
							<p class="text-[10px] text-text-muted">PNG, JPG, atau WEBP (Maksimal 5MB)</p>
						</div>
						<input type="file" accept="image/*" class="hidden" onchange={handleImageUpload} />
					</label>
				{/if}

				<!-- Info Box -->
				<div
					class="space-y-1 rounded-xl border border-white/5 bg-white/5 p-3 text-[11px] text-text-muted"
				>
					<p class="font-semibold text-white">Panduan Visual:</p>
					<p>
						Gunakan gambar landscape gedung Fakultas Sains & Teknologi rasio 16:9 untuk hasil
						terbaik.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
