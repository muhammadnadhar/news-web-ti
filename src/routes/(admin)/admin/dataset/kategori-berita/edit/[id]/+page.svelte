<script lang="ts">
	import FormKategoriNews from '../../_component/formKategoriNews.svelte';


	let { data, form } = $props();
</script>

<div class="p-6">
	<FormKategoriNews actionUrl={"?/update"} data={data}  {form}  />
</div>
