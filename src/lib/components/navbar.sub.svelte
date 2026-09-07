<script lang="ts">
import {type MenuItem } from '$lib/types/navbar';
  import { ChevronRight, Layers } from 'lucide-svelte';

  interface Props {
    item: MenuItem;
  }

  let { item }: Props = $props();
</script>

<div class="w-full bg-scitech-slate border border-white/10 rounded-2xl p-5 shadow-xl transition-all duration-300 hover:border-scitech-mint/30">
  
  <!-- Header Card -->
  <div class="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
    <div class="flex items-center gap-3">
      <!-- Icon dengan Background khusus dari MenuItem -->
      <div class="p-2.5 rounded-xl flex items-center justify-center shrink-0 {item.bgClass}">
        <item.icon class="w-5 h-5" />
      </div>
      <div>
        <h3 class="text-base font-bold text-white tracking-wide">{item.label}</h3>
        <p class="text-[11px] text-text-muted">Navigasi Halaman</p>
      </div>
    </div>
    
    <!-- Indicator Jumlah Sub Menu -->
    {#if item.subMenu.length > 0}
      <span class="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-scitech-mint-dim text-scitech-mint border border-scitech-mint/20">
        {item.subMenu.length} Menu
      </span>
    {/if}
  </div>

  <!-- Body Card: Daftar Sub Menu -->
  {#if item.subMenu.length > 0}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {#each item.subMenu as sub (sub.id)}
        <a
          href={sub.href}
          class="group flex items-center justify-between p-3 rounded-xl bg-scitech-navy/60 hover:bg-scitech-slate-hover border border-white/5 hover:border-scitech-mint/40 transition-all duration-200"
        >
          <span class="text-xs font-medium text-text-muted group-hover:text-scitech-mint transition-colors">
            {sub.label}
          </span>
          <ChevronRight class="w-4 h-4 text-text-muted/40 group-hover:text-scitech-mint group-hover:translate-x-1 transition-all shrink-0" />
        </a>
      {/each}
    </div>
  {:else}
    <!-- Tampilan saat Sub Menu kosong -->
    <div class="py-6 flex flex-col items-center justify-center text-center bg-scitech-navy/40 rounded-xl border border-dashed border-white/10">
      <Layers class="w-8 h-8 text-text-muted/30 mb-2" />
      <p class="text-xs font-medium text-text-muted">Belum ada sub-menu</p>
      <span class="text-[10px] text-text-muted/50 mt-0.5">Halaman sedang disiapkan</span>
    </div>
  {/if}

</div>
