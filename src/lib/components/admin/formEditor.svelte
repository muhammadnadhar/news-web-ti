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

	// Interface Props untuk reusability
	interface Props {
		title?: string;
		label?: string;
		value?: string;
		onSave?: (data: string) => void;
	}

	let {
		title = 'Form Editor Data',
		label = 'Konten Editor',
		value = $bindable(''),
		onSave
	}: Props = $props();

	let editorRef = $state<HTMLDivElement | null>(null);
	let isSaved = $state(false);

	// Menjalankan perintah Formatting pada Document Editor
	function format(command: string, val: string | undefined = undefined) {
		document.execCommand(command, false, val);
		if (editorRef) {
			value = editorRef.innerHTML;
		}
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

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (editorRef) {
			value = editorRef.innerHTML;
			if (onSave) onSave(value);

			isSaved = true;
			setTimeout(() => (isSaved = false), 3000);
		}
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
				<!-- Toolbar -->
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

					<div class="mx-1 h-4 w-1 bg-bg-secondary-hover"></div>

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
						onclick={() => alert('Fitur Tabel')}
						class="rounded p-1.5 transition-colors hover:bg-bg-secondary hover:text-accent-primary"
						title="Table"
					>
						<Table class="h-4 w-4" />
					</button>
					<button
						type="button"
						onclick={() => alert('Fitur Video')}
						class="rounded p-1.5 transition-colors hover:bg-bg-secondary hover:text-accent-primary"
						title="Video"
					>
						<Video class="h-4 w-4" />
					</button>

					<div class="mx-1 h-4 w-[1px] bg-bg-secondary-hover"></div>

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
					oninput={() => {
						if (editorRef) value = editorRef.innerHTML;
					}}
					class="prose max-h-[500px] min-h-[300px] max-w-none overflow-y-auto p-6 leading-relaxed text-text-main prose-invert focus:outline-none"
				>
					{@html value}
				</div>
			</div>
		</div>

		<!-- Submit Button -->
		<div class="pt-2">
			<button
				type="submit"
				class="flex items-center gap-2 rounded-lg bg-accent-primary px-5 py-2.5 text-sm font-semibold text-text-dark shadow-lg shadow-accent-primary/10 transition-all hover:bg-accent-primary-hover"
			>
				<Send class="h-4 w-4" />
				<span>Simpan Data</span>
			</button>
		</div>
	</form>
</div>
