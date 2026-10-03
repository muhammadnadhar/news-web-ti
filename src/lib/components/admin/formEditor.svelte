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
		X,
		Plus,
		Combine,
		AlignLeft,
		AlignCenter,
		AlignRight,
		WrapText,
		GripHorizontal,
		PinIcon,
		Maximize2,
		Trash2Icon,
		CheckCircle2
	} from 'lucide-svelte';
	import { bgColors, fgColors } from '$lib/constants';
	import { convertYouTubeUrlToEmbed } from '$lib/utils';

	interface Props {
		title?: string;
		label?: string;
		value?: string;

		// ini 2 indikator value yg sama
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

	let touchTimer: ReturnType<typeof setTimeout> | null = null;

	type ModalType = 'link' | 'image' | 'table' | 'video' | null;
	let activeModal = $state<ModalType>(null);

	let contextType = $state<'table' | 'image' | 'video' | null>(null);

	let editorRef = $state<HTMLDivElement | null>(null);
	let isSaved = $state(false);
	let isInternalUpdate = false;

	let targetImage = $state<HTMLImageElement | null>(null);
	let targetVideoWrapper = $state<HTMLElement | null>(null);

	// Sinkronisasi data dari luar (Parent) tanpa merusak posisi kursor saat mengetik
	$effect(() => {
		if (editorRef && !isInternalUpdate && value !== editorRef.innerHTML) {
			editorRef.innerHTML = value || '';
		}
	});

	// Simpan history untuk Undo/Redo manual
	let history = $state<string[]>([]);
	let historyIndex = $state(-1);
	let isHistoryAction = false;

	let linkUrl = $state('');
	let imageUrl = $state('');
	let videoUrl = $state('');
	let tableRows = $state(3);
	let tableCols = $state(3);

	let showContextMenu = $state(false);
	let menuPos = $state({ x: 0, y: 0 });
	let targetCell = $state<HTMLTableCellElement | null>(null);
	let targetRow = $state<HTMLTableRowElement | null>(null);
	let targetTable = $state<HTMLTableElement | null>(null);

	// Menyimpan & Memulihkan Posisi Kursor
	let savedRange = $state<Range | null>(null);

	function saveSelection() {
		const sel = window.getSelection();
		if (sel && sel.rangeCount > 0) {
			savedRange = sel.getRangeAt(0);
		}
	}

	function handleTouchStart(e: TouchEvent) {
		// Ambil elemen target dari sentuhan pertama
		const touch = e.touches[0];
		const target = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
		if (!target) return;

		// Set timer untuk mendeteksi tahanan lama (long press ~500ms)
		touchTimer = setTimeout(() => {
			const cell = target.closest('td, th') as HTMLTableCellElement | null;
			const img = target.closest('img') as HTMLImageElement | null;
			const videoWrapper = target.closest('.aspect-video') as HTMLElement | null;

			// Buat objek event buatan (mock MouseEvent) agar posisi sesuai dengan sentuhan jari
			const fakeEvent = {
				preventDefault: () => e.preventDefault(),
				clientX: touch.clientX,
				clientY: touch.clientY,
				target: target
			} as unknown as MouseEvent;

			if (cell || img || videoWrapper) {
				handleContextMenu(fakeEvent);
			}
		}, 500); // Durasi long press dalam milidetik
	}

	function handleTouchEnd() {
		if (touchTimer) {
			clearTimeout(touchTimer);
			touchTimer = null;
		}
	}

	function restoreSelection() {
		if (savedRange) {
			const sel = window.getSelection();
			if (sel) {
				sel.removeAllRanges();
				sel.addRange(savedRange);
			}
		}
	}
	// Helper untuk posisi menu agar rapi
	function openMenu(e: MouseEvent) {
		const x = Math.min(e.clientX, window.innerWidth - 240);
		const y = Math.min(e.clientY, window.innerHeight - 380);
		menuPos = { x, y };
		showContextMenu = true;
	}

	function handleContextMenu(e: MouseEvent) {
		const target = e.target as HTMLElement;

		// Deteksi elemen apa yang diklik
		const cell = target.closest('td, th') as HTMLTableCellElement | null;
		const img = target.closest('img') as HTMLImageElement | null;
		// Menyesuaikan struktur video wrapper Anda: <div class="aspect-video ..."><iframe ...></iframe></div>
		const videoWrapper = target.closest('.video-container') as HTMLElement | null;

		if (cell) {
			e.preventDefault();
			contextType = 'table';
			targetCell = cell;
			targetRow = cell.closest('tr');
			targetTable = cell.closest('table');
			openMenu(e);
		} else if (img) {
			e.preventDefault();
			contextType = 'image';
			targetImage = img;
			openMenu(e);
		} else if (videoWrapper) {
			e.preventDefault();
			contextType = 'video';
			targetVideoWrapper = videoWrapper;
			openMenu(e);
		} else {
			closeContextMenu();
		}
	}
	function closeContextMenu() {
		showContextMenu = false;
		contextType = null;

		targetCell = null;
		targetRow = null;
		targetTable = null;
		targetImage = null;
		targetVideoWrapper = null;
	}

	// --- FUNGSI MANIPULASI GAMBAR ---
	function setImageSize(sizeClass: string) {
		if (!targetImage) return;
		replaceClass(targetImage, /^(w-(full|auto|\d+)|max-w-\[?\w+\]?|h-auto)/, sizeClass);
		notifyDOMChange();
		closeContextMenu();
	}

	function setImageAlign(align: 'left' | 'center' | 'right') {
		if (!targetImage) return;
		let parent = targetImage.parentElement;
		if (!parent || !parent.classList.contains('flex')) {
			const wrapper = document.createElement('div');
			wrapper.className = 'flex my-4';
			targetImage.replaceWith(wrapper);
			wrapper.appendChild(targetImage);
			parent = wrapper;
		}
		parent.className = `flex my-4 justify-${align === 'left' ? 'start' : align === 'right' ? 'end' : 'center'}`;
		notifyDOMChange();
		closeContextMenu();
	}

	function deleteImage() {
		if (targetImage) {
			const parent = targetImage.parentElement;
			if (parent && parent.classList.contains('flex') && parent !== editorRef) {
				parent.remove();
			} else {
				targetImage.remove();
			}
			notifyDOMChange();
		}
		closeContextMenu();
	}

	// --- FUNGSI MANIPULASI GAMBAR ---

	// --- FUNGSI MANIPULASI VIDEO ---
	function handleEditorClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		const menuTrigger = target.closest('.video-menu-trigger');

		if (menuTrigger) {
			e.preventDefault();
			e.stopPropagation();

			const wrapper = menuTrigger.closest('.video-container') as HTMLElement;
			if (wrapper) {
				targetVideoWrapper = wrapper;
				contextType = 'video';

				const rect = menuTrigger.getBoundingClientRect();
				menuPos = {
					x: rect.left,
					y: rect.bottom + 6
				};
				showContextMenu = true;
			}
		} else {
			// Tutup menu jika klik di luar
			closeContextMenu();
		}
	}
	function setVideoSize(sizeClass: string) {
		if (!targetVideoWrapper) return;
		replaceClass(targetVideoWrapper, /^(w-(full|\d+)|max-w-\[?\w+\]?)/, sizeClass);
		notifyDOMChange();
		closeContextMenu();
	}

	function setVideoAlign(align: 'left' | 'center' | 'right') {
		if (!targetVideoWrapper) return;
		replaceClass(targetVideoWrapper, /^mx-(auto|0|left|right)/, '');
		if (align === 'center') {
			targetVideoWrapper.classList.add('mx-auto');
		} else if (align === 'left') {
			targetVideoWrapper.classList.add('mr-auto', 'ml-0');
		} else {
			targetVideoWrapper.classList.add('ml-auto', 'mr-0');
		}
		notifyDOMChange();
		closeContextMenu();
	}

	function deleteVideo() {
		if (targetVideoWrapper) {
			targetVideoWrapper.remove();
			notifyDOMChange();
		}
		closeContextMenu();
	}

	// --- FUNGSI MANIPULASI VIDEO ---

	// --------------- TABLE METHOD
	// Helper manipulasi class Tailwind
	function replaceClass(element: HTMLElement, regexPattern: RegExp, newClass: string) {
		const cleanClasses = element.className
			.split(' ')
			.filter((c) => !regexPattern.test(c))
			.join(' ');
		element.className = `${cleanClasses} ${newClass}`.trim();
	}
	function notifyDOMChange() {
		handleInput();
		if (editorRef) {
			// Memicu event input sintetis agar Undo/Redo native dan Svelte menyadari perubahan DOM
			editorRef.dispatchEvent(new Event('input', { bubbles: true }));
		}
	}

	// --- Fungsi Modifikasi Tabel ---
	function addRow(position: 'above' | 'below') {
		if (!targetCell || !targetRow || !targetTable) return;
		const colCount = targetRow.cells.length;
		const index = position === 'above' ? targetRow.rowIndex : targetRow.rowIndex + 1;
		const newRow = targetTable.insertRow(index);

		for (let i = 0; i < colCount; i++) {
			const cell = newRow.insertCell(i);
			cell.className = 'border border-bg-secondary-hover p-2';
			cell.innerHTML = 'Teks';
		}
		notifyDOMChange();
		handleInput();
		closeContextMenu();
	}

	function addColumn(position: 'left' | 'right') {
		if (!targetCell || !targetTable) return;
		const colIdx = targetCell.cellIndex;
		const targetIdx = position === 'left' ? colIdx : colIdx + 1;

		Array.from(targetTable.rows).forEach((row) => {
			const cell = row.insertCell(targetIdx);
			cell.className = 'border border-bg-secondary-hover p-2';
			cell.innerHTML = 'Teks';
		});

		notifyDOMChange();
		handleInput();
		closeContextMenu();
	}

	function deleteRow() {
		if (!targetRow || !targetTable) return;
		targetTable.deleteRow(targetRow.rowIndex);
		if (targetTable.rows.length === 0) targetTable.remove();

		notifyDOMChange();
		handleInput();
		closeContextMenu();
	}

	function deleteColumn() {
		if (!targetCell || !targetTable) return;
		const idx = targetCell.cellIndex;
		Array.from(targetTable.rows).forEach((row) => {
			if (row.cells.length > idx) row.deleteCell(idx);
		});
		if (targetTable.rows[0]?.cells.length === 0) targetTable.remove();

		notifyDOMChange();
		handleInput();
		closeContextMenu();
	}

	function deleteTable() {
		if (targetTable) targetTable.remove();

		notifyDOMChange();
		handleInput();
		closeContextMenu();
	}

	function toggleHeader() {
		if (!targetTable || targetTable.rows.length === 0) return;
		const firstRow = targetTable.rows[0];
		const isHeader = firstRow.cells[0]?.tagName.toLowerCase() === 'th';

		Array.from(firstRow.cells).forEach((cell) => {
			const newTag = isHeader ? 'td' : 'th';
			const newCell = document.createElement(newTag);
			newCell.innerHTML = cell.innerHTML;
			newCell.className = isHeader
				? 'border border-bg-secondary-hover p-2 font-normal'
				: 'border border-bg-secondary-hover p-2 bg-bg-primary-glare font-bold text-accent-primary text-left';

			cell.replaceWith(newCell);

			if (cell === targetCell) {
				targetCell = newCell as HTMLTableCellElement;
			}
		});

		notifyDOMChange();
		handleInput();
		closeContextMenu();
	}

	function togglePinRow() {
		if (!targetRow) return;
		const isPinned = targetRow.classList.contains('sticky');
		Array.from(targetRow.cells).forEach((cell) => {
			if (isPinned) {
				cell.classList.remove('sticky', 'top-0', 'bg-bg-secondary', 'z-10', 'shadow-sm');
			} else {
				cell.classList.add('sticky', 'top-0', 'bg-bg-secondary', 'z-10', 'shadow-sm');
			}
		});
		handleInput();
		closeContextMenu();
	}

	function setAlignment(align: 'left' | 'center' | 'right') {
		if (!targetCell) return;
		replaceClass(targetCell, /^text-(left|center|right)$/, `text-${align}`);
		handleInput();
		closeContextMenu();
	}

	function toggleWrapping() {
		if (!targetCell) return;
		if (targetCell.classList.contains('whitespace-nowrap')) {
			targetCell.classList.remove('whitespace-nowrap');
		} else {
			targetCell.classList.add('whitespace-nowrap');
		}
		handleInput();
		closeContextMenu();
	}

	function setBgColor(cls: string) {
		if (!targetCell) return;
		replaceClass(targetCell, /^bg-/, cls);
		handleInput();
		closeContextMenu();
	}

	function setFgColor(cls: string) {
		if (!targetCell) return;
		replaceClass(targetCell, /^text-/, cls);
		handleInput();
		closeContextMenu();
	}

	function mergeRight() {
		if (!targetCell) return;
		const nextCell = targetCell.nextElementSibling as HTMLTableCellElement | null;
		if (nextCell) {
			const currentColspan = parseInt(targetCell.getAttribute('colspan') || '1');
			const nextColspan = parseInt(nextCell.getAttribute('colspan') || '1');
			targetCell.setAttribute('colspan', (currentColspan + nextColspan).toString());
			targetCell.innerHTML += ' ' + nextCell.innerHTML;
			nextCell.remove();

			notifyDOMChange();
			handleInput();
		}
		closeContextMenu();
	}

	function mergeDown() {
		if (!targetCell || !targetRow || !targetTable) return;
		const rowIdx = targetRow.rowIndex;
		const currentRowSpan = targetCell.rowSpan || 1;

		const targetRowIdx = rowIdx + currentRowSpan;
		const nextRow = targetTable.rows[targetRowIdx];

		if (nextRow) {
			const cellIdx = targetCell.cellIndex;
			const nextCell = nextRow.cells[cellIdx];
			if (nextCell) {
				const nextRowspan = nextCell.rowSpan || 1;
				targetCell.rowSpan = currentRowSpan + nextRowspan;
				targetCell.innerHTML += '<br>' + nextCell.innerHTML;
				nextCell.remove();

				notifyDOMChange();
				handleInput();
			}
		}
		closeContextMenu();
	}

	function setCellPadding(paddingClass: string) {
		if (!targetCell) return;
		replaceClass(targetCell, /^p-/, paddingClass);
		handleInput();
		closeContextMenu();
	}

	function toggleTableWidth() {
		if (!targetTable) return;
		if (targetTable.classList.contains('w-full')) {
			targetTable.classList.remove('w-full');
			targetTable.classList.add('w-auto');
		} else {
			targetTable.classList.remove('w-auto');
			targetTable.classList.add('w-full');
		}
		handleInput();
		closeContextMenu();
	}
	// --------------- TABLE METHOD

	function closeModal() {
		activeModal = null;
		linkUrl = '';
		imageUrl = '';
		videoUrl = '';
		tableRows = 3;
		tableCols = 3;
	}
	function handleInput() {
		if (!editorRef || isHistoryAction) return;

		isInternalUpdate = true;
		value = editorRef.innerHTML;

		// Potong history redo jika ada aksi baru
		if (historyIndex < history.length - 1) {
			history = history.slice(0, historyIndex + 1);
		}

		// Simpan snapshot HTML saat ini ke history
		history.push(value);
		historyIndex = history.length - 1;

		setTimeout(() => {
			isInternalUpdate = false;
		}, 0);
	}
	function format(command: string, val: string | undefined = undefined) {
		if (command === 'undo') {
			if (historyIndex > 0) {
				historyIndex--;
				isHistoryAction = true;
				value = history[historyIndex];
				if (editorRef) editorRef.innerHTML = value;
				isHistoryAction = false;
			}
			return;
		}

		if (command === 'redo') {
			if (historyIndex < history.length - 1) {
				historyIndex++;
				isHistoryAction = true;
				value = history[historyIndex];
				if (editorRef) editorRef.innerHTML = value;
				isHistoryAction = false;
			}
			return;
		}

		// Untuk perintah format teks biasa (bold, italic, dll)
		document.execCommand(command, false, val);
		handleInput();
	}

	function handleHeadingChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const tag = target.value;
		if (!tag) return;

		if (['h4', 'h5', 'h6'].includes(tag)) {
			const selection = window.getSelection();
			if (selection && selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);
				const element = document.createElement(tag);
				element.appendChild(range.extractContents());
				range.insertNode(element);
				notifyDOMChange();
			}
		} else {
			format('formatBlock', tag);
		}
	}

	// --- Handler Pemicu Modal ---
	function handleAddLink() {
		saveSelection();
		linkUrl = '';
		activeModal = 'link';
	}

	function confirmAddLink() {
		if (!linkUrl) return;
		restoreSelection();
		format('createLink', linkUrl);
		closeModal();
	}

	function handleAddImage() {
		saveSelection();
		imageUrl = '';
		activeModal = 'image';
	}

	function confirmAddImage() {
		if (!imageUrl) return;
		restoreSelection();
		format('insertImage', imageUrl);
		closeModal();
	}

	function handleAddTable() {
		saveSelection();
		tableRows = 3;
		tableCols = 3;
		activeModal = 'table';
	}

	function confirmAddTable() {
		if (tableRows < 1 || tableCols < 1) return;
		restoreSelection();
		let tableHtml =
			'<table class="my-4 w-full border-collapse border border-bg-secondary-hover"><tbody>';
		for (let r = 0; r < tableRows; r++) {
			tableHtml += '<tr>';
			for (let c = 0; c < tableCols; c++) {
				tableHtml += '<td class="border border-bg-secondary-hover p-2">&nbsp;</td>';
			}
			tableHtml += '</tr>';
		}
		tableHtml += '</tbody></table><p><br></p>';

		format('insertHTML', tableHtml);
		closeModal();
	}

	function handleAddVideo() {
		saveSelection();
		videoUrl = '';
		activeModal = 'video';
	}
	function confirmAddVideo() {
		if (!videoUrl) return;
		restoreSelection();

		let embedUrl = videoUrl;
		if (videoUrl.includes('watch?v=')) {
			embedUrl = videoUrl.replace('watch?v=', 'embed/');
		}

		const embedUrlClean = convertYouTubeUrlToEmbed(embedUrl);

		// Gunakan class wrapper yang konsisten, misal: video-container
		const videoHtml = `
        <div class="video-container relative inline-block w-full max-w-xl group my-4">
            <iframe 
                src="${embedUrlClean}" 
                class="aspect-video w-full rounded-lg border-0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
            <button 
                type="button"
                onclick={(e) => handleEditorClick()}
                class="video-menu-trigger absolute top-3 right-3 rounded-md bg-black/70 px-2.5 py-1 text-xs text-text-main opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black shadow-md cursor-pointer"
            >
                ⋮ Menu
            </button>
        </div>
        <p><br></p>
    `;

		// Masukkan ke editor (sesuaikan fungsi insert Anda, misal pakai execCommand atau manipulasi DOM)
		//	if (editorRef) {
		//	editorRef.focus();
		//			document.execCommand('insertHTML', false, videoHtml);
		//		}

		format('insertHTML', videoHtml);
		closeModal();
	}

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
						<option value="p" class="bg-bg-secondary text-text-main">Paragraph</option>
						<option value="h1" class="bg-bg-secondary text-text-main">Heading 1</option>
						<option value="h2" class="bg-bg-secondary text-text-main">Heading 2</option>
						<option value="h3" class="bg-bg-secondary text-text-main">Heading 3</option>
						<option value="h4" class="bg-bg-secondary text-text-main">Heading 4</option>
						<option value="h5" class="bg-bg-secondary text-text-main">Heading 5</option>
						<option value="h6" class="bg-bg-secondary text-text-main">Heading 6</option>
					</select>
					<div class="mx-1 h-4 w-1 bg-bg-secondary-hover"></div>

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

					<div class="mx-1 h-4 w-1 bg-bg-secondary-hover"></div>

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
					ontouchstart={handleTouchStart}
					ontouchend={handleTouchEnd}
					oncontextmenu={handleContextMenu}
					class="prose max-h-[500px] min-h-[300px] max-w-none overflow-y-auto p-6 leading-relaxed text-text-main focus:outline-none"
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

<!-- MODAL OVERLAY & CONTENT -->
{#if activeModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
		<div
			class="w-full max-w-md overflow-hidden rounded-xl border border-bg-secondary-hover bg-bg-secondary shadow-2xl"
		>
			<!-- Modal Header -->
			<div
				class="flex items-center justify-between border-b border-bg-secondary-hover bg-bg-primary-glare px-5 py-3.5"
			>
				<h4 class="text-xs font-bold tracking-wider text-accent-primary uppercase">
					{#if activeModal === 'link'}
						Sisipkan Link
					{:else if activeModal === 'image'}
						Sisipkan Gambar
					{:else if activeModal === 'table'}
						Buat Tabel
					{:else if activeModal === 'video'}
						Embed Video
					{/if}
				</h4>
				<button
					type="button"
					onclick={closeModal}
					class="rounded-lg p-1 text-text-muted transition-colors hover:bg-bg-secondary hover:text-text-main"
				>
					<X class="h-4 w-4" />
				</button>
			</div>

			<!-- Modal Body -->
			<div class="space-y-4 p-5">
				{#if activeModal === 'link'}
					<div class="space-y-1.5">
						<label
							for="modal-link-url"
							class="block text-xs font-semibold text-text-muted uppercase">URL Link</label
						>
						<input
							id="modal-link-url"
							type="url"
							bind:value={linkUrl}
							placeholder="https://example.com"
							class="w-full rounded-lg border border-bg-secondary-hover bg-bg-primary px-3 py-2 text-sm text-text-main focus:border-accent-primary focus:outline-none"
						/>
					</div>
				{:else if activeModal === 'image'}
					<!-- di sini memang gak rencana cloudinary , melainkan langsug link aja -->
					<div class="space-y-1.5">
						<label
							for="modal-image-url"
							class="block text-xs font-semibold text-text-muted uppercase">URL Gambar</label
						>
						<input
							id="modal-image-url"
							type="url"
							bind:value={imageUrl}
							placeholder="https://example.com/image.jpg"
							class="w-full rounded-lg border border-bg-secondary-hover bg-bg-primary px-3 py-2 text-sm text-text-main focus:border-accent-primary focus:outline-none"
						/>
					</div>
				{:else if activeModal === 'table'}
					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-1.5">
							<label
								for="modal-table-rows"
								class="block text-xs font-semibold text-text-muted uppercase">Jumlah Baris</label
							>
							<input
								id="modal-table-rows"
								type="number"
								min="1"
								bind:value={tableRows}
								class="w-full rounded-lg border border-bg-secondary-hover bg-bg-primary px-3 py-2 text-sm text-text-main focus:border-accent-primary focus:outline-none"
							/>
						</div>
						<div class="space-y-1.5">
							<label
								for="modal-table-cols"
								class="block text-xs font-semibold text-text-muted uppercase">Jumlah Kolom</label
							>
							<input
								id="modal-table-cols"
								type="number"
								min="1"
								bind:value={tableCols}
								class="w-full rounded-lg border border-bg-secondary-hover bg-bg-primary px-3 py-2 text-sm text-text-main focus:border-accent-primary focus:outline-none"
							/>
						</div>
					</div>
				{:else if activeModal === 'video'}
					<div class="space-y-1.5">
						<label
							for="modal-video-url"
							class="block text-xs font-semibold text-text-muted uppercase"
							>URL Video (YouTube / Embed)</label
						>
						<input
							id="modal-video-url"
							type="url"
							bind:value={videoUrl}
							placeholder="https://www.youtube.com/watch?v=..."
							class="w-full rounded-lg border border-bg-secondary-hover bg-bg-primary px-3 py-2 text-sm text-text-main focus:border-accent-primary focus:outline-none"
						/>
					</div>
				{/if}
			</div>

			<!-- Modal Footer -->
			<div
				class="flex items-center justify-end gap-2 border-t border-bg-secondary-hover bg-bg-primary-glare px-5 py-3"
			>
				<button
					type="button"
					onclick={closeModal}
					class="rounded-lg border border-bg-secondary-hover px-4 py-2 text-xs font-semibold text-text-muted transition-colors hover:bg-bg-primary hover:text-text-main"
				>
					Batal
				</button>
				<button
					type="button"
					onclick={() => {
						if (activeModal === 'link') confirmAddLink();
						else if (activeModal === 'image') confirmAddImage();
						else if (activeModal === 'table') confirmAddTable();
						else if (activeModal === 'video') confirmAddVideo();
					}}
					class="rounded-lg bg-accent-primary px-4 py-2 text-xs font-semibold text-text-dark shadow-md shadow-accent-primary/10 transition-all hover:bg-accent-primary-hover"
				>
					Tambahkan
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- CONTEXT MENU TABLE OVERLAY -->
{#if showContextMenu}
	<!-- Backdrop untuk menutup menu saat diklik di luar -->
	<div
		class="fixed inset-0 z-40 bg-transparent"
		onclick={closeContextMenu}
		oncontextmenu={(e) => {
			e.preventDefault();
			closeContextMenu();
		}}
	></div>

	<!-- Context Menu Floating Card -->
	<div
		style="top: {menuPos.y}px; left: {menuPos.x}px;"
		class="fixed z-50 w-60 overflow-hidden rounded-xl border border-bg-secondary-hover bg-bg-secondary p-1.5 shadow-2xl backdrop-blur-md"
	>
		{#if contextType === 'table'}
			<!-- ===========menu table =========== -->
			<div
				class="border-b border-bg-secondary-hover px-2.5 py-1.5 text-[10px] font-bold tracking-wider text-accent-primary uppercase"
			>
				Opsi Tabel
			</div>

			<div class="max-h-[360px] space-y-1 overflow-y-auto py-1 text-xs text-text-main">
				<div class="px-1 text-[10px] font-semibold text-text-muted">Baris & Kolom</div>
				<div class="grid grid-cols-2 gap-1 px-1">
					<button
						type="button"
						onclick={() => addRow('above')}
						class="flex items-center gap-1.5 rounded p-1.5 hover:bg-bg-primary-glare hover:text-accent-primary"
					>
						<Plus class="h-3.5 w-3.5" /> Baris Atas
					</button>
					<button
						type="button"
						onclick={() => addRow('below')}
						class="flex items-center gap-1.5 rounded p-1.5 hover:bg-bg-primary-glare hover:text-accent-primary"
					>
						<Plus class="h-3.5 w-3.5" /> Baris Bawah
					</button>
					<button
						type="button"
						onclick={() => addColumn('left')}
						class="flex items-center gap-1.5 rounded p-1.5 hover:bg-bg-primary-glare hover:text-accent-primary"
					>
						<Plus class="h-3.5 w-3.5" /> Kolom Kiri
					</button>
					<button
						type="button"
						onclick={() => addColumn('right')}
						class="flex items-center gap-1.5 rounded p-1.5 hover:bg-bg-primary-glare hover:text-accent-primary"
					>
						<Plus class="h-3.5 w-3.5" /> Kolom Kanan
					</button>
				</div>

				<div class="my-1 h-px bg-bg-secondary-hover"></div>

				<!-- Merge & Alignment -->
				<div class="px-1 text-[10px] font-semibold text-text-muted">Tata Letak & Gabung</div>
				<button
					type="button"
					onclick={mergeRight}
					class="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-bg-primary-glare hover:text-accent-primary"
				>
					<Combine class="h-3.5 w-3.5" /> Merge Samping (Right)
				</button>
				<button
					type="button"
					onclick={mergeDown}
					class="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-bg-primary-glare hover:text-accent-primary"
				>
					<Combine class="h-3.5 w-3.5" /> Merge Bawah (Down)
				</button>

				<div class="flex items-center gap-1 px-1 py-1">
					<button
						type="button"
						onclick={() => setAlignment('left')}
						class="flex-1 rounded p-1.5 text-center hover:bg-bg-primary-glare hover:text-accent-primary"
						title="Rata Kiri"
					>
						<AlignLeft class="mx-auto h-3.5 w-3.5" />
					</button>
					<button
						type="button"
						onclick={() => setAlignment('center')}
						class="flex-1 rounded p-1.5 text-center hover:bg-bg-primary-glare hover:text-accent-primary"
						title="Rata Tengah"
					>
						<AlignCenter class="mx-auto h-3.5 w-3.5" />
					</button>
					<button
						type="button"
						onclick={() => setAlignment('right')}
						class="flex-1 rounded p-1.5 text-center hover:bg-bg-primary-glare hover:text-accent-primary"
						title="Rata Kanan"
					>
						<AlignRight class="mx-auto h-3.5 w-3.5" />
					</button>
				</div>

				<button
					type="button"
					onclick={toggleWrapping}
					class="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-bg-primary-glare hover:text-accent-primary"
				>
					<WrapText class="h-3.5 w-3.5" /> Toggle Wrap Text
				</button>

				<div class="my-1 h-px bg-bg-secondary-hover"></div>

				<div class="px-1 text-[10px] font-semibold text-text-muted">Warna Background Sel</div>
				<div class="flex flex-wrap gap-1 px-1 py-1">
					{#each bgColors as bg}
						<button
							type="button"
							onclick={() => setBgColor(bg.class)}
							class="h-5 w-5 rounded border border-bg-secondary-hover transition-transform hover:scale-110 {bg.class}"
							title={bg.name}
						></button>
					{/each}
				</div>

				<div class="px-1 text-[10px] font-semibold text-text-muted">Warna Teks Sel</div>
				<div class="flex flex-wrap gap-1 px-1 py-1">
					{#each fgColors as fg}
						<button
							type="button"
							onclick={() => setFgColor(fg.class)}
							class="flex h-5 w-5 items-center justify-center rounded border border-bg-secondary-hover text-xs font-bold transition-transform hover:scale-110 {fg.class}"
							title={fg.name}
						>
							A
						</button>
					{/each}
				</div>

				<div class="my-1 h-px bg-bg-secondary-hover"></div>

				<div class="px-1 text-[10px] font-semibold text-text-muted">Struktur & Ukuran</div>
				<button
					type="button"
					onclick={toggleHeader}
					class="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-bg-primary-glare hover:text-accent-primary"
				>
					<GripHorizontal class="h-3.5 w-3.5" /> Toggle Header Baris 1
				</button>
				<button
					type="button"
					onclick={togglePinRow}
					class="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-bg-primary-glare hover:text-accent-primary"
				>
					<PinIcon class="h-3.5 w-3.5" /> Pin Baris Ini (Sticky)
				</button>
				<button
					type="button"
					onclick={toggleTableWidth}
					class="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-bg-primary-glare hover:text-accent-primary"
				>
					<Maximize2 class="h-3.5 w-3.5" /> Toggle Width (Full / Auto)
				</button>

				<div class="px-1 pt-1 text-[10px] font-semibold text-text-muted">Padding Sel</div>
				<div class="flex gap-1 px-1">
					<button
						type="button"
						onclick={() => setCellPadding('p-1')}
						class="flex-1 rounded border border-bg-secondary-hover px-1 py-0.5 text-[10px] hover:bg-bg-primary-glare"
					>
						Ringkas
					</button>
					<button
						type="button"
						onclick={() => setCellPadding('p-2.5')}
						class="flex-1 rounded border border-bg-secondary-hover px-1 py-0.5 text-[10px] hover:bg-bg-primary-glare"
					>
						Normal
					</button>
					<button
						type="button"
						onclick={() => setCellPadding('p-4')}
						class="flex-1 rounded border border-bg-secondary-hover px-1 py-0.5 text-[10px] hover:bg-bg-primary-glare"
					>
						Longgar
					</button>
				</div>

				<div class="my-1 h-px bg-bg-secondary-hover"></div>

				<!-- Hapus Elemen -->
				<div class="px-1 text-[10px] font-semibold text-status-error">Hapus</div>
				<button
					type="button"
					onclick={deleteRow}
					class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-status-error hover:bg-status-error/10"
				>
					<Trash2Icon class="h-3.5 w-3.5" /> Hapus Baris Ini
				</button>
				<button
					type="button"
					onclick={deleteColumn}
					class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-status-error hover:bg-status-error/10"
				>
					<Trash2Icon class="h-3.5 w-3.5" /> Hapus Kolom Ini
				</button>
				<button
					type="button"
					onclick={deleteTable}
					class="flex w-full items-center gap-2 rounded px-2 py-1.5 font-semibold text-status-error hover:bg-status-error/20"
				>
					<Trash2Icon class="h-3.5 w-3.5" /> Hapus Seluruh Tabel
				</button>
			</div>
			<!-- ===========menu table =========== -->
		{:else if contextType === 'image'}
			<!-- MENU GAMBAR -->
			<div class="px-1 text-[10px] font-semibold text-text-muted">Ukuran Gambar</div>
			<div class="grid grid-cols-3 gap-1 px-1">
				<button
					type="button"
					onclick={() => setImageSize('w-1/4')}
					class="rounded p-1.5 text-center hover:bg-bg-primary-glare hover:text-accent-primary"
					>25%</button
				>
				<button
					type="button"
					onclick={() => setImageSize('w-1/2')}
					class="rounded p-1.5 text-center hover:bg-bg-primary-glare hover:text-accent-primary"
					>50%</button
				>
				<button
					type="button"
					onclick={() => setImageSize('w-full')}
					class="rounded p-1.5 text-center hover:bg-bg-primary-glare hover:text-accent-primary"
					>100%</button
				>
			</div>

			<div class="my-1 h-[1px] bg-bg-secondary-hover"></div>
			<div class="px-1 text-[10px] font-semibold text-text-muted">Perataan (Align)</div>
			<div class="grid grid-cols-3 gap-1 px-1">
				<button
					type="button"
					onclick={() => setImageAlign('left')}
					class="flex items-center justify-center gap-1 rounded p-1.5 hover:bg-bg-primary-glare hover:text-accent-primary"
					><AlignLeft class="h-3.5 w-3.5" /></button
				>
				<button
					type="button"
					onclick={() => setImageAlign('center')}
					class="flex items-center justify-center gap-1 rounded p-1.5 hover:bg-bg-primary-glare hover:text-accent-primary"
					><AlignCenter class="h-3.5 w-3.5" /></button
				>
				<button
					type="button"
					onclick={() => setImageAlign('right')}
					class="flex items-center justify-center gap-1 rounded p-1.5 hover:bg-bg-primary-glare hover:text-accent-primary"
					><AlignRight class="h-3.5 w-3.5" /></button
				>
			</div>

			<div class="my-1 h-[1px] bg-bg-secondary-hover"></div>
			<button
				type="button"
				onclick={deleteImage}
				class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-status-error hover:bg-status-error/10"
				><Trash2Icon class="h-3.5 w-3.5" /> Hapus Gambar</button
			>
		{:else if contextType === 'video'}
			<!-- MENU VIDEO IFRAME -->
			<div class="px-1 text-[10px] font-semibold text-text-muted">Ukuran Lebar Video</div>
			<div class="grid grid-cols-3 gap-1 px-1">
				<button
					type="button"
					onclick={() => setVideoSize('w-full max-w-sm')}
					class="rounded p-1.5 text-center hover:bg-bg-primary-glare hover:text-accent-primary"
					>Kecil</button
				>
				<button
					type="button"
					onclick={() => setVideoSize('w-full max-w-xl')}
					class="rounded p-1.5 text-center hover:bg-bg-primary-glare hover:text-accent-primary"
					>Sedang</button
				>
				<button
					type="button"
					onclick={() => setVideoSize('w-full')}
					class="rounded p-1.5 text-center hover:bg-bg-primary-glare hover:text-accent-primary"
					>Penuh</button
				>
			</div>

			<div class="my-1 h-[1px] bg-bg-secondary-hover"></div>
			<div class="px-1 text-[10px] font-semibold text-text-muted">Perataan (Align)</div>
			<div class="grid grid-cols-3 gap-1 px-1">
				<button
					type="button"
					onclick={() => setVideoAlign('left')}
					class="flex items-center justify-center gap-1 rounded p-1.5 hover:bg-bg-primary-glare hover:text-accent-primary"
					><AlignLeft class="h-3.5 w-3.5" /></button
				>
				<button
					type="button"
					onclick={() => setVideoAlign('center')}
					class="flex items-center justify-center gap-1 rounded p-1.5 hover:bg-bg-primary-glare hover:text-accent-primary"
					><AlignCenter class="h-3.5 w-3.5" /></button
				>
				<button
					type="button"
					onclick={() => setVideoAlign('right')}
					class="flex items-center justify-center gap-1 rounded p-1.5 hover:bg-bg-primary-glare hover:text-accent-primary"
					><AlignRight class="h-3.5 w-3.5" /></button
				>
			</div>

			<div class="my-1 h-[1px] bg-bg-secondary-hover"></div>
			<button
				type="button"
				onclick={deleteVideo}
				class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-status-error hover:bg-status-error/10"
				><Trash2Icon class="h-3.5 w-3.5" /> Hapus Video</button
			>
		{/if}
	</div>
{/if}

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

<!-- dengan tombol  -->
<!-- <script lang="ts"> -->
<!--     import Editor from './Editor.svelte'; -->
<!---->
<!--     let content = $state(''); -->
<!---->
<!--     async function handleSaveData(htmlContent: string) { -->
<!--         // Kirim data ke API / Database -->
<!--         await fetch('/api/konten', { -->
<!--             method: 'POST', -->
<!--             headers: { 'Content-Type': 'application/json' }, -->
<!--             body: JSON.stringify({ body: htmlContent }) -->
<!--         }); -->
<!--     } -->
<!-- </script> -->
<!---->
<!-- <Editor  -->
<!--     title="Edit Konten"  -->
<!--     bind:value={content}  -->
<!--     onSave={handleSaveData}  -->
<!-- /> -->

<style>
	h1,
	h2,
	h3 {
		color: var(--text-text-main);
	}
</style>
