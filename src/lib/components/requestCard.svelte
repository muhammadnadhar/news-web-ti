<script lang="ts">
  import { Network, Brain, Smartphone, ShieldCheck } from 'lucide-svelte';

  // Props yang diterima dari luar / API
  export let title = "";
  export let description = "";
  export let iconName = "";
  export let isActive = false; // Prop untuk mengontrol mode highlight / featured

  // Map ikon dari Lucide berdasarkan string ikon dari API
  const iconMap = {
    brain: Brain,
    mobile: Smartphone,
    shield: ShieldCheck,
    network: Network
  };

  // Default fallback ke Network jika iconName tidak cocok
  $: SelectedIcon = iconMap[iconName] || Network;
</script>

<div 
  class="relative flex flex-col items-center text-center p-8 rounded-xl transition-all duration-300 border h-full group
  {isActive 
    ? 'bg-accent-primary text-text-dark border-accent-primary shadow-lg shadow-accent-primary/20 scale-105 z-10' 
    : 'bg-bg-secondary text-text-main border-bg-secondary-hover hover:border-accent-primary/50 border-b-4 border-b-accent-primary hover:-translate-y-1'}"
>
  <!-- Icon Wrapper -->
  <div 
    class="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-300
    {isActive 
      ? 'bg-pure-white text-accent-primary-dim shadow-sm' 
      : 'bg-accent-primary-dim text-accent-primary group-hover:scale-110'}"
  >
    <svelte:component this={SelectedIcon} class="w-8 h-8" />
  </div>

  <!-- Title -->
  <h3 class="text-xl font-bold mb-4 leading-snug">
    {title}
  </h3>

  <!-- Description -->
  <p class="text-sm leading-relaxed max-w-sm {isActive ? 'text-text-dark/90 font-medium' : 'text-text-muted'}">
    {description}
  </p>
</div>
