import type { Component } from "lucide-svelte";

// Mendefinisikan tipe data untuk tombol tautan
  export  interface DashboardActionLink {
        id: string;
        href: string;
        label: string;
        icon: typeof Component;
        external?: boolean;
        iconColorClass: string;
    }
