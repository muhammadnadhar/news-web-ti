<script lang="ts">
	import FormKurikulums from '../../_components/formKurikulums.svelte';

	let { data, form } = $props();
</script>

<div class="mx-auto max-w-5xl space-y-6 p-6 sm:p-10">
	<div class="flex flex-col gap-1">
		<h1 class="text-2xl font-extrabold text-text-main sm:text-3xl">
			Update Kurikulum {data.currikulums.title}
		</h1>
		<p class="text-xs text-text-muted">
			Silakan lenggarakan deskripsi dan unggah gambar pendukung untuk kurikulum baru.
		</p>
	</div>

	<FormKurikulums
		action="?/update"
		initialData={data.currikulums}
		valuesData={form?.values}
		submitLabel={`Update Kurikulum ${data.currikulums.title ?? ''}`}
		isBack={true}
	/>
</div>
