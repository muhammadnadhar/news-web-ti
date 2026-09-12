<script lang="ts">

interface Props {
	id: string;
	title: string;
	subtitle?: string | null;
	description?: string | null;
	imageUrl?: string | null;
	editUrl: string;
}

let {
	id,
	title,
	subtitle = null,
	description = null,
	imageUrl = null,
	editUrl
}: Props = $props();
</script>

<div class="card">
	{#if imageUrl}
		<div class="image-container">
			<img src={imageUrl} alt={title} loading="lazy" />
		</div>
	{/if}

	<div class="card-body">
		<h3 class="card-title">{title}</h3>

		{#if subtitle}
			<p class="card-subtitle">{subtitle}</p>
		{/if}

		{#if description}
			<p class="card-description">{description}</p>
		{/if}

		<div class="card-actions">
			<a href={editUrl} class="btn-change">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
				</svg>
				Ubah / Change
			</a>
		</div>
	</div>
</div>

<style>
	.card {
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		overflow: hidden;
		background-color: #ffffff;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.card:hover {
		transform: translateY(-4px);
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
	}

	.image-container {
		width: 100%;
		height: 200px;
		background-color: #f1f5f9;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.image-container img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card-body {
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}

	.card-title {
		font-size: 1.25rem;
		font-weight: 700;
		color: #1e293b;
		margin: 0 0 0.25rem 0;
	}

	.card-subtitle {
		font-size: 0.875rem;
		font-weight: 600;
		color: #2563eb;
		margin: 0 0 0.75rem 0;
	}

	.card-description {
		font-size: 0.875rem;
		color: #64748b;
		margin: 0 0 1.25rem 0;
		line-height: 1.5;
		flex-grow: 1;
	}

	.card-actions {
		margin-top: auto;
	}

	.btn-change {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.5rem 1rem;
		background-color: #0284c7;
		color: #ffffff;
		font-weight: 600;
		font-size: 0.875rem;
		border-radius: 6px;
		text-decoration: none;
		transition: background-color 0.2s ease;
	}

	.btn-change:hover {
		background-color: #0369a1;
	}
</style>
