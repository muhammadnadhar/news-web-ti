<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="container">
	<h2>Ubah jabatan</h2>

	{#if form?.message}
		<div class="alert" class:success={form.success} class:error={!form.success}>
			{form.message}
		</div>
	{/if}

	<div class="primary-grid">
		{#each data.primaryDosenList as slot, index (slot.primary_id)}
			<div class="slot-card">
				<div class="slot-header">
					<span class="badge">Slot #{index + 1}</span>
					<span class="position-title">{slot.position}</span>
				</div>

				<div class="current-dosen">
					<img src={slot.photo_url || '/placeholder-avatar.png'} alt={slot.name} class="avatar" />
					<div class="info">
						<h3>{slot.name}</h3>
						<p>{slot.expertise}</p>
					</div>
				</div>

				<!-- Form untuk mengganti Dosen pada slot ini -->
				<form method="POST" action="?/updateSlot" use:enhance class="update-form">
					<input type="hidden" name="primary_id" value={slot.primary_id} />

					<label for="dosen-select-{slot.primary_id}">Ganti Dosen:</label>
					<select
						id="dosen-select-{slot.primary_id}"
						name="lecturer_staff_id"
						value={slot.lecturer_staff_id}
					>
						{#each data.allDosen as dosen (dosen.id)}
							<option value={dosen.id}>
								{dosen.name} ({dosen.expertise})
							</option>
						{/each}
					</select>

					<label for="pos-input-{slot.primary_id}">Jabatan Tampil:</label>
					<input
						type="text"
						id="pos-input-{slot.primary_id}"
						name="position"
						value={slot.position}
					/>

					<button type="submit" class="btn-save"> Simpan Perubahan </button>
				</form>
			</div>
		{/each}
	</div>
</div>

<style>
	.container {
		max-width: 1000px;
		margin: 2rem auto;
		padding: 0 1rem;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}

	.primary-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
		margin-top: 1.5rem;
	}

	.slot-card {
		background: #ffffff;
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		padding: 1.25rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
	}

	.slot-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.badge {
		background: #0284c7;
		color: #ffffff;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 700;
	}

	.position-title {
		font-size: 0.85rem;
		color: #64748b;
		font-weight: 600;
	}

	.current-dosen {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #f1f5f9;
		margin-bottom: 1rem;
	}

	.avatar {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		object-fit: cover;
	}

	.info h3 {
		margin: 0;
		font-size: 0.95rem;
		color: #0f172a;
	}

	.info p {
		margin: 0.2rem 0 0 0;
		font-size: 0.8rem;
		color: #64748b;
	}

	.update-form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.update-form label {
		font-size: 0.8rem;
		font-weight: 600;
		color: #334155;
		margin-top: 0.25rem;
	}

	select,
	input[type='text'] {
		padding: 0.5rem;
		border: 1px solid #cbd5e1;
		border-radius: 6px;
		font-size: 0.875rem;
		width: 100%;
		box-sizing: border-box;
	}

	.btn-save {
		margin-top: 0.75rem;
		padding: 0.5rem;
		background-color: #0f172a;
		color: #ffffff;
		border: none;
		border-radius: 6px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.btn-save:hover {
		background-color: #1e293b;
	}

	.alert {
		padding: 0.75rem 1rem;
		border-radius: 8px;
		margin-bottom: 1rem;
		font-size: 0.9rem;
	}

	.alert.success {
		background-color: #dcfce7;
		color: #15803d;
	}

	.alert.error {
		background-color: #fee2e2;
		color: #b91c1c;
	}
</style>
