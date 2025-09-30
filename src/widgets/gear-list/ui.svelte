<script lang="ts">
  import { formatWeight } from "@/shared/lib/utils.js";
  import { gearItems, gearStore } from "@/app/providers/store.js";
  import {
    confirmHelpers,
    toastHelpers,
    handleAsyncOperation,
  } from "@/shared/lib/ui-feedback.js";

  // Sort items by category first, then by name within each category
  const sortedItems = $derived(
    $gearItems.sort((a, b) => {
      // Primary sort: by category
      const categoryCompare = a.category.localeCompare(b.category);
      if (categoryCompare !== 0) return categoryCompare;

      // Secondary sort: by name within the same category
      return a.name.localeCompare(b.name);
    })
  );

  async function handleRemoveItem(item: any) {
    confirmHelpers.deleteItem(item.name, async () => {
      await handleAsyncOperation(() => gearStore.removeItem(item.id), {
        successMessage: `"${item.name}" has been removed from your gear list.`,
        errorMessage: `Failed to remove gear item`,
      });
    });
  }
</script>

{#if $gearItems.length > 0}
  <section class="gear-list">
    <h2>Gear Items ({$gearItems.length})</h2>
    <div class="items-list">
      {#each sortedItems as item (item.id)}
        <div class="gear-item">
          <div class="item-name">{item.name}</div>
          <div class="item-category">{item.category}</div>
          <div class="item-weight">{formatWeight(item.weight)}</div>
          <button
            onclick={() => handleRemoveItem(item)}
            class="remove-button"
            aria-label="Remove {item.name}">×</button
          >
        </div>
      {/each}
    </div>
  </section>
{:else}
  <section class="empty-state">
    <p>🎯 Start by adding your first gear item!</p>
  </section>
{/if}

<style>
  .gear-list {
    background: var(--color-surface);
    border-radius: var(--border-radius);
    padding: var(--space-md);
    box-shadow: var(--shadow-medium);
  }

  .gear-list h2 {
    margin: 0 0 var(--space-md);
    color: var(--color-text);
    font-size: var(--text-xl);
    line-height: 1.3;
  }

  .items-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
  }

  .gear-item {
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    align-items: center;
    gap: var(--space-sm);
    background: var(--color-background-alt);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-sm);
    padding: var(--space-sm);
    transition: all 0.2s ease;
    min-height: var(--touch-target);
  }

  .gear-item:hover {
    background: var(--color-surface-hover);
    box-shadow: var(--shadow-sm);
  }

  .item-name {
    font-weight: 600;
    color: var(--color-text);
    font-size: var(--text-sm);
    line-height: 1.4;
    word-break: break-word;
    min-width: 0;
  }

  .item-category {
    background: var(--color-gray-200);
    color: var(--color-text-light);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--border-radius-lg);
    font-size: var(--text-xs);
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
    text-align: center;
    min-width: fit-content;
  }

  .item-weight {
    font-weight: 600;
    color: var(--color-text);
    font-size: var(--text-sm);
    white-space: nowrap;
    text-align: right;
    min-width: fit-content;
  }

  .remove-button {
    background: var(--color-danger-light);
    color: var(--color-danger);
    border: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    flex-shrink: 0;
    transition: all 0.2s ease;
    touch-action: manipulation;
    line-height: 1;
  }

  .remove-button:hover {
    background: var(--color-danger);
    color: var(--color-text-inverse);
    transform: scale(1.05);
  }

  .remove-button:focus {
    outline: 2px solid var(--color-danger);
    outline-offset: 2px;
  }

  .empty-state {
    background: var(--color-surface);
    border-radius: var(--border-radius);
    padding: var(--space-xl) var(--space-md);
    text-align: center;
    box-shadow: var(--shadow-medium);
    color: var(--color-text-muted);
    font-size: var(--text-base);
    line-height: 1.5;
  }

  @media (min-width: 640px) {
    .gear-list {
      padding: var(--space-lg);
      border-radius: var(--border-radius-md);
    }

    .gear-list h2 {
      font-size: var(--text-2xl);
      margin-bottom: var(--space-lg);
    }

    .gear-item {
      padding: var(--space-md);
      gap: var(--gap-md);
      grid-template-columns: 2fr 1fr auto auto;
    }

    .item-name,
    .item-weight {
      font-size: var(--text-base);
    }
  }

  @media (min-width: 1024px) {
    .gear-list {
      padding: var(--space-xl);
      border-radius: var(--border-radius-lg);
    }

    .gear-item {
      grid-template-columns: 3fr 1fr auto auto;
      gap: var(--gap-lg);
    }

    .gear-item:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-lg);
    }

    .remove-button {
      width: 32px;
      height: 32px;
      font-size: 16px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .gear-item,
    .remove-button {
      transition: none;
    }

    .gear-item:hover,
    .remove-button:hover {
      transform: none;
    }
  }
</style>
