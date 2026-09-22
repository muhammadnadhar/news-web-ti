<script lang="ts">
import FormKategoriNews from "../_component/formKategoriNews.svelte";
	let { form , data } = $props();
</script>

<div class="p-6">
	<FormKategoriNews data={data}  {form}  actionUrl={"?/save" }/>
</div>
