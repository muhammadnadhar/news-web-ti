<script lang="ts">
  import { 
    Bold, Italic, Link as LinkIcon, List, ListOrdered, 
    Outdent, Indent, Image as ImageIcon, Quote, Table, 
    Video, Undo, Redo, Send, CheckCircle2 
  } from 'lucide-svelte';

  // Interface Props untuk reusability
  interface Props {
    title?: string;
    label?: string;
    value?: string;
    onSave?: (data: string) => void;
  }

  let { 
    title = "Form Editor Data", 
    label = "Konten Editor", 
    value = $bindable(""), 
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

<div class="bg-bg-secondary border border-bg-secondary-hover rounded-xl overflow-hidden shadow-xl">
  
  <!-- Header Modal/Form -->
  <div class="bg-bg-primary-glare px-6 py-4 border-b border-bg-secondary-hover flex items-center justify-between">
    <h3 class="text-accent-primary font-bold text-sm uppercase tracking-wider">
      {title}
    </h3>
    {#if isSaved}
      <span class="inline-flex items-center gap-1.5 text-xs text-accent-primary bg-accent-primary-dim/60 px-3 py-1 rounded-full border border-accent-primary/30">
        <CheckCircle2 class="w-3.5 h-3.5" /> Data Berhasil Disimpan
      </span>
    {/if}
  </div>

  <form onsubmit={handleSubmit} class="p-6 space-y-4">
    <div class="space-y-2">
      <label for="rich-editor" class="block text-xs font-semibold text-text-muted uppercase tracking-wider">
        {label} <span class="text-status-error">*</span>
      </label>

      <!-- Editor Container -->
      <div class="border border-bg-secondary-hover rounded-lg overflow-hidden bg-bg-primary">
        
        <!-- Toolbar -->
        <div class="bg-bg-primary-glare p-2 border-b border-bg-secondary-hover flex flex-wrap items-center gap-1 text-text-muted">
          
          <select 
            onchange={handleHeadingChange}
            class="bg-bg-secondary text-text-main text-xs border border-bg-secondary-hover rounded px-2 py-1.5 focus:outline-none focus:border-accent-primary cursor-pointer mr-1"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>

          <div class="h-4 w-[1px] bg-bg-secondary-hover mx-1"></div>

          <button type="button" onclick={() => format('bold')} class="p-1.5 hover:bg-bg-secondary hover:text-accent-primary rounded transition-colors" title="Bold">
            <Bold class="w-4 h-4" />
          </button>
          <button type="button" onclick={() => format('italic')} class="p-1.5 hover:bg-bg-secondary hover:text-accent-primary rounded transition-colors" title="Italic">
            <Italic class="w-4 h-4" />
          </button>
          <button type="button" onclick={handleAddLink} class="p-1.5 hover:bg-bg-secondary hover:text-accent-primary rounded transition-colors" title="Insert Link">
            <LinkIcon class="w-4 h-4" />
          </button>

          <div class="h-4 w-[1px] bg-bg-secondary-hover mx-1"></div>

          <button type="button" onclick={() => format('insertUnorderedList')} class="p-1.5 hover:bg-bg-secondary hover:text-accent-primary rounded transition-colors" title="Unordered List">
            <List class="w-4 h-4" />
          </button>
          <button type="button" onclick={() => format('insertOrderedList')} class="p-1.5 hover:bg-bg-secondary hover:text-accent-primary rounded transition-colors" title="Ordered List">
            <ListOrdered class="w-4 h-4" />
          </button>

          <div class="h-4 w-[1px] bg-bg-secondary-hover mx-1"></div>

          <button type="button" onclick={() => format('outdent')} class="p-1.5 hover:bg-bg-secondary hover:text-accent-primary rounded transition-colors" title="Outdent">
            <Outdent class="w-4 h-4" />
          </button>
          <button type="button" onclick={() => format('indent')} class="p-1.5 hover:bg-bg-secondary hover:text-accent-primary rounded transition-colors" title="Indent">
            <Indent class="w-4 h-4" />
          </button>

          <div class="h-4 w-[1px] bg-bg-secondary-hover mx-1"></div>

          <button type="button" onclick={handleAddImage} class="p-1.5 hover:bg-bg-secondary hover:text-accent-primary rounded transition-colors" title="Insert Image">
            <ImageIcon class="w-4 h-4" />
          </button>
          <button type="button" onclick={() => format('formatBlock', 'blockquote')} class="p-1.5 hover:bg-bg-secondary hover:text-accent-primary rounded transition-colors" title="Quote">
            <Quote class="w-4 h-4" />
          </button>
          <button type="button" onclick={() => alert('Fitur Tabel')} class="p-1.5 hover:bg-bg-secondary hover:text-accent-primary rounded transition-colors" title="Table">
            <Table class="w-4 h-4" />
          </button>
          <button type="button" onclick={() => alert('Fitur Video')} class="p-1.5 hover:bg-bg-secondary hover:text-accent-primary rounded transition-colors" title="Video">
            <Video class="w-4 h-4" />
          </button>

          <div class="h-4 w-[1px] bg-bg-secondary-hover mx-1"></div>

          <button type="button" onclick={() => format('undo')} class="p-1.5 hover:bg-bg-secondary hover:text-accent-primary rounded transition-colors" title="Undo">
            <Undo class="w-4 h-4" />
          </button>
          <button type="button" onclick={() => format('redo')} class="p-1.5 hover:bg-bg-secondary hover:text-accent-primary rounded transition-colors" title="Redo">
            <Redo class="w-4 h-4" />
          </button>
        </div>

        <!-- Editable Area -->
        <div 
          id="rich-editor"
          bind:this={editorRef}
          contenteditable="true"
          oninput={() => { if (editorRef) value = editorRef.innerHTML; }}
          class="p-6 min-h-[300px] max-h-[500px] overflow-y-auto text-text-main focus:outline-none prose prose-invert max-w-none leading-relaxed"
        >
          {@html value}
        </div>

      </div>
    </div>

    <!-- Submit Button -->
    <div class="pt-2">
      <button 
        type="submit" 
        class="bg-accent-primary hover:bg-accent-primary-hover text-text-dark font-semibold px-5 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2 shadow-lg shadow-accent-primary/10"
      >
        <Send class="w-4 h-4" />
        <span>Simpan Data</span>
      </button>
    </div>
  </form>
</div>
