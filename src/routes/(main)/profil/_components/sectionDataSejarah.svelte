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
		Eye,
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
			<div class="flex items-center gap-2 font-mono text-xs text-scitech-mint">
				<History class="h-4 w-4" />
				<span>PROFIL // SEJARAH MANAGEMENT</span>
			</div>
			<h1 class="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
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
					class="inline-flex items-center gap-2 rounded-xl border border-scitech-mint/30 bg-scitech-mint/10 px-3 py-2 text-xs font-semibold text-scitech-mint"
				>
					<CheckCircle2 class="h-4 w-4" />
					<span>Tersimpan!</span>
				</div>
			{/if}

			<button
				type="button"
				onclick={handleSave}
				disabled={isSaving}
				class="inline-flex items-center gap-2 rounded-xl bg-scitech-mint px-5 py-2.5 text-xs font-bold text-scitech-navy shadow-lg shadow-scitech-mint/10 transition-all hover:bg-scitech-mint-hover active:scale-95 disabled:opacity-50"
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
				class="rounded-2xl border border-white/10 bg-scitech-slate/60 p-5 shadow-2xl backdrop-blur-xl space-y-5"
			>
				<!-- Input Judul -->
				<div class="space-y-2">
					<label for="judul-sejarah" class="flex items-center gap-1.5 text-xs font-mono text-scitech-cyan uppercase tracking-wider">
						<FileText class="h-3.5 w-3.5" />
						Judul Sejarah <span class="text-status-error">*</span>
					</label>
					<input
						id="judul-sejarah"
						type="text"
						bind:value={judul}
						placeholder="Masukkan judul halaman sejarah..."
						class="w-full rounded-xl border border-white/10 bg-scitech-navy/80 px-4 py-3 text-sm text-white placeholder-text-muted transition-all focus:border-scitech-mint focus:outline-none focus:ring-1 focus:ring-scitech-mint"
					/>
				</div>

				<!-- Rich Text Editor Container Mockup -->
				<div class="space-y-2">
					<label for="editor-sejarah" class="flex items-center gap-1.5 text-xs font-mono text-scitech-cyan uppercase tracking-wider">
						<FileText class="h-3.5 w-3.5" />
						Isi Konten Sejarah <span class="text-status-error">*</span>
					</label>

					<div class="overflow-hidden rounded-xl border border-white/10 bg-scitech-navy/80">
						<!-- WYSIWYG Toolbar -->
						<div
							class="flex flex-wrap items-center gap-1 border-b border-white/10 bg-white/5 p-2 text-text-muted"
						>
							<button type="button" class="rounded-lg p-1.5 hover:bg-white/10 hover:text-white transition-colors">
								<Bold class="h-4 w-4" />
							</button>
							<button type="button" class="rounded-lg p-1.5 hover:bg-white/10 hover:text-white transition-colors">
								<Italic class="h-4 w-4" />
							</button>
							<div class="h-4 w-px bg-white/10 mx-1"></div>
							<button type="button" class="rounded-lg p-1.5 hover:bg-white/10 hover:text-white transition-colors">
								<List class="h-4 w-4" />
							</button>
							<button type="button" class="rounded-lg p-1.5 hover:bg-white/10 hover:text-white transition-colors">
								<ListOrdered class="h-4 w-4" />
							</button>
							<div class="h-4 w-px bg-white/10 mx-1"></div>
							<button type="button" class="rounded-lg p-1.5 hover:bg-white/10 hover:text-white transition-colors">
								<LinkIcon class="h-4 w-4" />
							</button>
						</div>

						<!-- Textarea Editor -->
						<textarea
							id="editor-sejarah"
							bind:value={isiSejarah}
							rows="14"
							placeholder="Tuliskan narasi lengkap sejarah pendirian prodi..."
							class="w-full resize-y bg-transparent p-4 text-xs sm:text-sm text-white placeholder-text-muted leading-relaxed focus:outline-none"
						></textarea>
					</div>
					<span class="text-[11px] text-text-muted">Mendukung format paragraf, daftar poin dosen pendiri, dan kriteria BAN-PT.</span>
				</div>
			</div>
		</div>

		<!-- KOLOM KANAN: MEDIA UPLOADER & PREVIEW CARD (4 Cols) -->
		<div class="space-y-6 lg:col-span-4">
			<div
				class="rounded-2xl border border-white/10 bg-scitech-slate/60 p-5 shadow-2xl backdrop-blur-xl space-y-4"
			>
				<div class="flex items-center justify-between">
					<span class="flex items-center gap-1.5 text-xs font-mono text-scitech-cyan uppercase tracking-wider">
						<ImageIcon class="h-3.5 w-3.5" /> Foto Banner
					</span>
					{#if imagePreview}
						<button
							type="button"
							onclick={removeImage}
							class="text-[11px] text-status-error hover:underline inline-flex items-center gap-1"
						>
							<Trash2 class="h-3 w-3" /> Hapus
						</button>
					{/if}
				</div>

				<!-- Image Preview Container -->
				{#if imagePreview}
					<div class="relative group aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-scitech-navy">
						<img
							src={imagePreview}
							alt="Foto Gedung Sejarah"
							class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div
							class="absolute inset-0 bg-scitech-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm"
						>
							<label
								class="cursor-pointer rounded-lg bg-scitech-mint px-3 py-1.5 text-xs font-bold text-scitech-navy hover:bg-scitech-mint-hover transition-colors"
							>
								Ganti Foto
								<input type="file" accept="image/*" class="hidden" onchange={handleImageUpload} />
							</label>
						</div>
					</div>
				{:else}
					<!-- Upload Dropzone -->
					<label
						class="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/15 bg-scitech-navy/50 p-8 text-center cursor-pointer hover:border-scitech-mint/50 hover:bg-scitech-navy transition-all"
					>
						<div class="rounded-full bg-scitech-mint/10 p-3 text-scitech-mint">
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
				<div class="rounded-xl border border-white/5 bg-white/5 p-3 text-[11px] text-text-muted space-y-1">
					<p class="font-semibold text-white">Panduan Visual:</p>
					<p>Gunakan gambar landscape gedung Fakultas Sains & Teknologi rasio 16:9 untuk hasil terbaik.</p>
				</div>
			</div>
		</div>
	</div>
</div>
