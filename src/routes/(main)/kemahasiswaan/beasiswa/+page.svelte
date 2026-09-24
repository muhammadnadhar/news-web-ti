<script lang="ts">
	import EmptyData from '../../_components/emptyData.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="container">
	<header class="page-header">
		<h1 class="title">Daftar Penerima Beasiswa</h1>
		<p class="subtitle">Mahasiswa Program Studi Teknologi Informasi penerima program beasiswa.</p>
	</header>

	{#if data.scholarships.length === 0}
		<EmptyData
			title="Belum ada Data Beasiswa"
			description="Data penerima beasiswa belum dimasukkan atau belum tersedia saat ini."
		/>
	{:else}
		<div class="scholarship-grid">
			{#each data.scholarships as item (item.id)}
				<article class="card">
					<div class="image-container">
						<img
							src={item.image_url || '/placeholder-student.png'}
							alt={item.student_name}
							class="student-photo"
							loading="lazy"
						/>
					</div>
					<div class="card-body">
						<span class="badge">Penerima Beasiswa</span>
						<h3 class="student-name">{item.student_name}</h3>
						<p class="scholarship-program">{item.scholarship_name}</p>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 2rem auto;
		padding: 0 1.5rem;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}

	.page-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.title {
		font-size: 2.25rem;
		font-weight: 800;
		color: #0f172a;
		margin: 0 0 0.5rem 0;
		letter-spacing: -0.02em;
	}

	.subtitle {
		font-size: 1rem;
		color: #64748b;
		margin: 0;
	}

	/* Responsive Grid Layout */
	.scholarship-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 1.75rem;
	}

	/* Card Component */
	.card {
		background: #ffffff;
		border-radius: 16px;
		overflow: hidden;
		border: 1px solid #e2e8f0;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.05),
			0 2px 4px -2px rgba(0, 0, 0, 0.05);
		transition:
			transform 0.25s ease,
			box-shadow 0.25s ease;
		display: flex;
		flex-direction: column;
	}

	.card:hover {
		transform: translateY(-4px);
		box-shadow:
			0 12px 20px -5px rgba(0, 0, 0, 0.1),
			0 4px 6px -4px rgba(0, 0, 0, 0.05);
	}

	.image-container {
		width: 100%;
		height: 220px;
		background-color: #f1f5f9;
		overflow: hidden;
		position: relative;
	}

	.student-photo {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center top;
		transition: transform 0.3s ease;
	}

	.card:hover .student-photo {
		transform: scale(1.04);
	}

	.card-body {
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}

	.badge {
		align-self: flex-start;
		background-color: #e0f2fe;
		color: #0369a1;
		font-size: 0.75rem;
		font-weight: 700;
		padding: 0.25rem 0.65rem;
		border-radius: 9999px;
		margin-bottom: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.025em;
	}

	.student-name {
		font-size: 1.15rem;
		font-weight: 700;
		color: #0f172a;
		margin: 0 0 0.5rem 0;
		line-height: 1.3;
	}

	.scholarship-program {
		font-size: 0.875rem;
		color: #475569;
		margin: 0;
		line-height: 1.4;
	}

	/* Empty State */
	.empty-state {
		text-align: center;
		padding: 4rem 1rem;
		background: #f8fafc;
		border-radius: 16px;
		border: 2px dashed #cbd5e1;
	}

	.empty-state .icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.empty-state h3 {
		font-size: 1.25rem;
		color: #1e293b;
		margin: 0 0 0.5rem 0;
	}

	.empty-state p {
		color: #64748b;
		margin: 0;
		font-size: 0.95rem;
	}

	/* Mobile adjustment */
	@media (max-width: 640px) {
		.title {
			font-size: 1.75rem;
		}

		.scholarship-grid {
			grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
			gap: 1.25rem;
		}
	}
</style>
