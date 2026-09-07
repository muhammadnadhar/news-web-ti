<script lang="ts">
  interface Props {
    count?: number;
  }

  // Menggunakan rune $props() dengan TypeScript interface dan nilai default
  let { count = 8 }: Props = $props();
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
  {#each Array(count) as _}
    <div class="bg-scitech-navy-glare p-4 rounded-2xl border border-scitech-slate/50 animate-pulse">
      <div class="w-full h-32 bg-scitech-slate rounded-xl mb-4"></div>
      
      <div class="flex items-center gap-3">
        <div class="w-7 h-7 bg-scitech-slate rounded-lg shrink-0"></div>
        <div class="w-full space-y-2">
          <div class="h-3 bg-scitech-slate rounded w-5/6"></div>
          <div class="h-2.5 bg-scitech-slate rounded w-1/2"></div>
        </div>
      </div>
    </div>
  {/each}
</div>
