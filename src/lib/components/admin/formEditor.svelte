<script lang="ts">
	import {
		Bold,
		Italic,
		Link as LinkIcon,
		List,
		ListOrdered,
		Outdent,
		Indent,
		Image as ImageIcon,
		Quote,
		Table,
		Video,
		Undo,
		Redo,
		Send,
		CheckCircle2
	} from 'lucide-svelte';

	interface Props {
		title?: string;
		label?: string;
		value?: string;
		showSaveButton?: boolean;
		onSave?: (data: string) => void;
	}

	let {
		title = 'Form Editor Data',
		label = 'Konten Editor',
		value = $bindable(''),
		showSaveButton = true,
		onSave
	}: Props = $props();

	let editorRef = $state<HTMLDivElement | null>(null);
	let isSaved = $state(false);
	let isInternalUpdate = false;

	// Sinkronisasi data dari luar (Parent) tanpa merusak posisi kursor saat mengetik
	$effect(() => {
		if (editorRef && !isInternalUpdate && value !== editorRef.innerHTML) {
			editorRef.innerHTML = value || '';
		}
	});

	function handleInput() {
		if (!editorRef) return;
		isInternalUpdate = true;
		value = editorRef.innerHTML;
		isInternalUpdate = false;
	}

	function format(command: string, val: string | undefined = undefined) {
		document.execCommand(command, false, val);
		handleInput();
	}

	function handleHeadingChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		if (target.value) {
			format('formatBlock', target.value);
		}
	}

	function handleAddLink() {
		const url = prompt('Masukkan URL tautan:');
		if (url) format('createLink', url);
	}

	function handleAddImage() {
		const url = prompt('Masukkan URL Gambar:');
		if (url) format('insertImage', url);
	}

	function handleAddTable() {
		const rows = prompt('Masukkan jumlah baris:', '3');
		const cols = prompt('Masukkan jumlah kolom:', '3');
		if (!rows || !cols) return;

		let tableHtml = '<table class="my-4 w-full border-collapse border border-bg-secondary-hover">';
		for (let r = 0; r < parseInt(rows); r++) {
			tableHtml += '<tr>';
			for (let c = 0; c < parseInt(cols); c++) {
				tableHtml += '<td class="border border-bg-secondary-hover p-2">Teks</td>';
			}
			tableHtml += '</tr>';
		}
		tableHtml += '</table><p><br></p>';
		format('insertHTML', tableHtml);
	}

	function handleAddVideo() {
		const url = prompt('Masukkan URL Embed Video (Contoh YouTube Embed URL):');
		if (!url) return;

		let embedUrl = url;
		if (url.includes('watch?v=')) {
			embedUrl = url.replace('watch?v=', 'embed/');
		}

		const videoHtml = `<div class="aspect-video my-4 w-full"><iframe src="${embedUrl}" class="h-full w-full rounded-lg" frameborder="0" allowfullscreen></iframe></div><p><br></p>`;
		format('insertHTML', videoHtml);
	}

	// Fungsi Publik: Bisa dipanggil langsung oleh Parent via Bindable Ref
	export function triggerSave(): string {
		if (editorRef) {
			value = editorRef.innerHTML;
		}
		if (onSave) onSave(value);

		isSaved = true;
		setTimeout(() => (isSaved = false), 3000);
		return value;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		triggerSave();
	}
</script>

<div class="overflow-hidden rounded-xl border border-bg-secondary-hover bg-bg-secondary shadow-xl">
	<!-- Header Modal/Form -->
	<div
		class="flex items-center justify-between border-b border-bg-secondary-hover bg-bg-primary-glare px-6 py-4"
	>
		<h3 class="text-sm font-bold tracking-wider text-accent-primary uppercase">
			{title}
		</h3>
		{#if isSaved}
			<span
				class="inline-flex items-center gap-1.5 rounded-full border border-accent-primary/30 bg-accent-primary-dim/60 px-3 py-1 text-xs text-accent-primary"
			>
				<CheckCircle2 class="h-3.5 w-3.5" /> Data Berhasil Disimpan
			</span>
		{/if}
	</div>

	<form onsubmit={handleSubmit} class="space-y-4 p-6">
		<div class="space-y-2">
			<label
				for="rich-editor"
				class="block text-xs font-semibold tracking-wider text-text-muted uppercase"
			>
				{label} <span class="text-status-error">*</span>
			</label>

			<!-- Editor Container -->
			<div class="overflow-hidden rounded-lg border border-bg-secondary-hover bg-bg-primary">
				<div
					class="flex flex-wrap items-center gap-1 border-b border-bg-secondary-hover bg-bg-primary-glare p-2 text-text-muted"
				>
					<select
						onchange={handleHeadingChange}
						class="mr-1 cursor-pointer rounded border border-bg-secondary-hover bg-bg-secondary px-2 py-1.5 text-xs text-text-main focus:border-accent-primary focus:outline-none"
					>
						<option value="p">Paragraph</option>
						<option value="h1">Heading 1</option>
						<option value="h2">Heading 2</option>
						<option value="h3">Heading 3</option>
					</select>

					<div class="mx-1 h-4 w-[1px] bg-bg-secondary-hover"></div>

					<button
						type="button"
						onclick={() => format('bold')}
						class="rounded p-1.5 transition-colors hover:bg-bg-secondary hover:text-accent-primary"
						title="Bold"
					>
						<Bold class="h-4 w-4" />
					</button>
					<button
						type="button"
						onclick={() => format('italic')}
						class="rounded p-1.5 transition-colors hover:bg-bg-secondary hover:text-accent-primary"
						title="Italic"
					>
						<Italic class="h-4 w-4" />
					</button>
					<button
						type="button"
						onclick={handleAddLink}
						class="rounded p-1.5 transition-colors hover:bg-bg-secondary hover:text-accent-primary"
						title="Insert Link"
					>
						<LinkIcon class="h-4 w-4" />
					</button>

					<div class="mx-1 h-4 w-[1px] bg-bg-secondary-hover"></div>

					<button
						type="button"
						onclick={() => format('insertUnorderedList')}
						class="rounded p-1.5 transition-colors hover:bg-bg-secondary hover:text-accent-primary"
						title="Unordered List"
					>
						<List class="h-4 w-4" />
					</button>
					<button
						type="button"
						onclick={() => format('insertOrderedList')}
						class="rounded p-1.5 transition-colors hover:bg-bg-secondary hover:text-accent-primary"
						title="Ordered List"
					>
						<ListOrdered class="h-4 w-4" />
					</button>

					<div class="mx-1 h-4 w-[1px] bg-bg-secondary-hover"></div>

					<button
						type="button"
						onclick={() => format('outdent')}
						class="rounded p-1.5 transition-colors hover:bg-bg-secondary hover:text-accent-primary"
						title="Outdent"
					>
						<Outdent class="h-4 w-4" />
					</button>
					<button
						type="button"
						onclick={() => format('indent')}
						class="rounded p-1.5 transition-colors hover:bg-bg-secondary hover:text-accent-primary"
						title="Indent"
					>
						<Indent class="h-4 w-4" />
					</button>

					<div class="mx-1 h-4 w-[1px] bg-bg-secondary-hover"></div>

					<button
						type="button"
						onclick={handleAddImage}
						class="rounded p-1.5 transition-colors hover:bg-bg-secondary hover:text-accent-primary"
						title="Insert Image"
					>
						<ImageIcon class="h-4 w-4" />
					</button>
					<button
						type="button"
						onclick={() => format('formatBlock', 'blockquote')}
						class="rounded p-1.5 transition-colors hover:bg-bg-secondary hover:text-accent-primary"
						title="Quote"
					>
						<Quote class="h-4 w-4" />
					</button>
					<button
						type="button"
						onclick={handleAddTable}
						class="rounded p-1.5 transition-colors hover:bg-bg-secondary hover:text-accent-primary"
						title="Table"
					>
						<Table class="h-4 w-4" />
					</button>
					<button
						type="button"
						onclick={handleAddVideo}
						class="rounded p-1.5 transition-colors hover:bg-bg-secondary hover:text-accent-primary"
						title="Video"
					>
						<Video class="h-4 w-4" />
					</button>

					<div class="mx-1 h-4 w-px bg-bg-secondary-hover"></div>

					<button
						type="button"
						onclick={() => format('undo')}
						class="rounded p-1.5 transition-colors hover:bg-bg-secondary hover:text-accent-primary"
						title="Undo"
					>
						<Undo class="h-4 w-4" />
					</button>
					<button
						type="button"
						onclick={() => format('redo')}
						class="rounded p-1.5 transition-colors hover:bg-bg-secondary hover:text-accent-primary"
						title="Redo"
					>
						<Redo class="h-4 w-4" />
					</button>
				</div>

				<!-- Editable Area -->
				<div
					id="rich-editor"
					bind:this={editorRef}
					contenteditable="true"
					oninput={handleInput}
					class="prose max-h-[500px] min-h-[300px] max-w-none overflow-y-auto p-6 leading-relaxed text-text-main prose-invert focus:outline-none"
				></div>
			</div>
		</div>

		<!-- Submit Button (Kondisional) -->
		{#if showSaveButton}
			<div class="pt-2">
				<button
					type="submit"
					class="flex items-center gap-2 rounded-lg bg-accent-primary px-5 py-2.5 text-sm font-semibold text-text-dark shadow-lg shadow-accent-primary/10 transition-all hover:bg-accent-primary-hover"
				>
					<Send class="h-4 w-4" />
					<span>Simpan Data</span>
				</button>
			</div>
		{/if}
	</form>
</div>

<!-- penggunaan  -->
<!---->
<!-- <FormEditor  -->
<!--     bind:value={content}  -->
<!--     onSave={(data) => console.log('Data disimpan:', data)}  -->
<!-- /> -->

<!-- perente triger   -->
<!-- <script lang="ts"> -->
<!--     import FormEditor from '$lib/components/FormEditor.svelte'; -->
<!---->
<!--     let editorRef: any; -->
<!--     let content = $state('<p>Konten Awal</p>'); -->
<!---->
<!--     function handleParentSubmit() { -->
<!--         // Trigger fungsi simpan dari Parent -->
<!--         const data = editorRef.triggerSave(); -->
<!--         console.log('Data dikirim oleh Parent:', data); -->
<!--     } -->
<!-- </script> -->
<!---->
<!-- <FormEditor  -->
<!--     bind:this={editorRef}  -->
<!--     bind:value={content}  -->
<!--     showSaveButton={false}  -->
<!-- /> -->
<!---->
<!-- <button onclick={handleParentSubmit} class="mt-4 border p-2"> -->
<!--     Submit dari Parent -->
<!-- </button> -->
