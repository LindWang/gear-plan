<script lang="ts">
	import type { GearItem, GearCategory } from '$lib/types.js';
	import { GEAR_CATEGORIES, CATEGORY_DESCRIPTIONS } from '$lib/types.js';
	import { calculateTotalWeight, calculateCategoryStats, formatWeight, generateId } from '$lib/utils.js';

	// Reactive state
	let gearItems = $state<GearItem[]>([]);
	let newItemName = $state('');
	let newItemCategory = $state<GearCategory>('Pack System');
	let newItemWeight = $state<number | null>(null);

	// Derived values
	const totalWeight = $derived(calculateTotalWeight(gearItems));
	const categoryStats = $derived(calculateCategoryStats(gearItems));

	function addItem() {
		if (!newItemName.trim() || newItemWeight === null || newItemWeight <= 0) {
			return;
		}

		const newItem: GearItem = {
			id: generateId(),
			name: newItemName.trim(),
			category: newItemCategory,
			weight: newItemWeight
		};

		gearItems.push(newItem);
		
		// Reset form
		newItemName = '';
		newItemWeight = null;
	}

	function removeItem(id: string) {
		gearItems = gearItems.filter(item => item.id !== id);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			addItem();
		}
	}
</script>

<svelte:head>
	<title>Hiking Gear Weight Planner</title>
</svelte:head>

<main>
	<header>
		<h1>🎒 Hiking Gear Weight Planner</h1>
		<p>Plan your hiking gear and track weight distribution by category</p>
	</header>

	<section class="add-item-form">
		<h2>Add New Gear Item</h2>
		<div class="form-grid">
			<div class="form-group">
				<label for="item-name">Item Name</label>
				<input
					id="item-name"
					type="text"
					bind:value={newItemName}
					onkeydown={handleKeydown}
					placeholder="e.g., Water bottle"
				/>
			</div>
			
			<div class="form-group">
				<label for="item-category">Category</label>
				<select id="item-category" bind:value={newItemCategory}>
					{#each GEAR_CATEGORIES as category}
						<option value={category} title={CATEGORY_DESCRIPTIONS[category]}>
							{category}
						</option>
					{/each}
				</select>
				<small class="category-hint">{CATEGORY_DESCRIPTIONS[newItemCategory]}</small>
			</div>
			
			<div class="form-group">
				<label for="item-weight">Weight (grams)</label>
				<input
					id="item-weight"
					type="number"
					bind:value={newItemWeight}
					onkeydown={handleKeydown}
					placeholder="e.g., 750"
					min="1"
				/>
			</div>
			
			<button 
				onclick={addItem}
				disabled={!newItemName.trim() || newItemWeight === null || newItemWeight <= 0}
				class="add-button"
			>
				Add Item
			</button>
		</div>
	</section>

	{#if gearItems.length > 0}
		<section class="weight-summary">
			<h2>Weight Summary</h2>
			<div class="total-weight">
				<strong>Total Weight: {formatWeight(totalWeight)}</strong>
			</div>
			
			<div class="category-breakdown">
				<h3>By Category</h3>
				{#each categoryStats.sort((a, b) => b.totalWeight - a.totalWeight) as stat}
					<div class="category-stat">
						<div class="category-info">
							<span class="category-name">{stat.category}</span>
							<span class="category-count">({stat.itemCount} item{stat.itemCount !== 1 ? 's' : ''})</span>
						</div>
						<div class="category-weight">
							<span class="weight">{formatWeight(stat.totalWeight)}</span>
							<span class="percentage">{stat.percentage.toFixed(1)}%</span>
						</div>
						<div class="progress-bar">
							<div class="progress-fill" style="width: {stat.percentage}%"></div>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<section class="gear-list">
			<h2>Gear Items ({gearItems.length})</h2>
			<div class="items-grid">
				{#each gearItems.sort((a, b) => a.category.localeCompare(b.category)) as item}
					<div class="gear-item">
						<div class="item-header">
							<h4>{item.name}</h4>
							<button onclick={() => removeItem(item.id)} class="remove-button">×</button>
						</div>
						<div class="item-details">
							<span class="category">{item.category}</span>
							<span class="weight">{formatWeight(item.weight)}</span>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{:else}
		<section class="empty-state">
			<p>🎯 Start by adding your first gear item above!</p>
		</section>
	{/if}
</main>
