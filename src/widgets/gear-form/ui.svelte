<script lang="ts">
  import type { GearCategory, GearItem } from "@/shared/types";
  import { GEAR_CATEGORIES, CATEGORY_DESCRIPTIONS } from "@/shared/types";
  import { validateGearItem } from "@/shared/lib/validation.js";
  import { gearStore } from "@/app/providers/store.js";
  import { toastHelpers, createFormHandler } from "@/shared/lib/ui-feedback.js";

  // Form state
  let name = $state("");
  let category = $state<GearCategory>("Pack System");
  let weight = $state<number | null>(null);

  // Validation
  const validation = $derived(validateGearItem({ name, category, weight }));
  const isValid = $derived(validation.isValid);

  // Form handler with integrated feedback
  const formHandler = createFormHandler(
    async () => {
      const itemName = name.trim();
      if (!itemName) {
        toastHelpers.validationWarning(
          "Please enter a name for your gear item."
        );
        return;
      }

      await gearStore.addItem({
        name: itemName,
        description: "",
        category,
        weight: weight!,
        quantity: 1,
        isPacked: false,
        isWorn: false,
        url: "",
        notes: "",
      });

      toastHelpers.success(`"${itemName}" has been added to your gear list!`);
      resetForm();
    },
    {
      errorPrefix: "Failed to add gear item",
    }
  );

  function resetForm() {
    name = "";
    weight = null;
    // Keep category selection for better UX
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      handleSubmit();
    }
  }

  function handleSubmit() {
    if (!isValid || formHandler.isSubmitting) return;
    formHandler.handleSubmit({ name, category, weight });
  }
</script>

<section class="add-item-form">
  <h2>Add New Gear Item</h2>
  <div class="form-grid">
    <div class="form-group">
      <label for="item-name">Item Name</label>
      <input
        id="item-name"
        type="text"
        bind:value={name}
        onkeydown={handleKeydown}
        placeholder="e.g., Water bottle"
        class:error={!validation.nameValid && name.length > 0}
      />
      {#if !validation.nameValid && name.length > 0}
        <span class="error-message">Item name is required</span>
      {/if}
    </div>

    <div class="form-group">
      <label for="item-category">Category</label>
      <select id="item-category" bind:value={category}>
        {#each GEAR_CATEGORIES as categoryOption}
          <option
            value={categoryOption}
            title={CATEGORY_DESCRIPTIONS[categoryOption]}
          >
            {categoryOption}
          </option>
        {/each}
      </select>
      <!-- <small class="category-hint">{CATEGORY_DESCRIPTIONS[category]}</small> -->
    </div>

    <div class="form-group">
      <label for="item-weight">Weight (grams)</label>
      <input
        id="item-weight"
        type="number"
        bind:value={weight}
        onkeydown={handleKeydown}
        placeholder="e.g., 750"
        min="1"
        class:error={!validation.weightValid && weight !== null}
      />
      {#if !validation.weightValid && weight !== null}
        <span class="error-message">Weight must be greater than 0</span>
      {/if}
    </div>

    <button
      onclick={handleSubmit}
      disabled={!isValid || formHandler.isSubmitting}
      class="add-button"
    >
      {formHandler.isSubmitting ? "Adding..." : "Add Item"}
    </button>
  </div>
</section>

<style>
  .add-item-form {
    background: var(--color-surface);
    border-radius: var(--border-radius);
    padding: var(--space-md);
    margin-bottom: var(--space-md);
    box-shadow: var(--shadow-medium);
  }

  .add-item-form h2 {
    margin: 0 0 var(--space-md);
    color: var(--color-text);
    font-size: var(--text-xl);
    line-height: 1.3;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--gap-md);
    align-items: end;
    width: 100%;
  }

  .add-button {
    width: 100%;
    justify-self: stretch;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    min-width: 0;
  }

  .form-group label {
    font-weight: 600;
    color: var(--color-text-light);
    font-size: var(--text-sm);
    line-height: 1.4;
    flex-shrink: 0;
  }

  .form-group input,
  .form-group select {
    padding: var(--space-sm);
    border: 2px solid var(--color-input-border);
    border-radius: var(--border-radius-sm);
    font-size: var(--text-base);
    line-height: 1.5;
    transition: all 0.2s ease;
    background: var(--color-input-bg);
    color: var(--color-text);
    min-height: var(--touch-target);
    appearance: none;
    -webkit-appearance: none;
  }

  .add-button {
    background: var(--color-primary);
    color: var(--color-text-inverse);
    border: none;
    padding: var(--space-sm) var(--space-lg);
    border-radius: var(--border-radius-sm);
    font-size: var(--text-base);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: var(--touch-target);
  }

  .add-button:hover:not(:disabled) {
    background: var(--color-primary-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }

  .add-button:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: var(--color-border-focus);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .form-group input.error {
    border-color: var(--color-danger);
  }

  .error-message {
    color: var(--color-danger);
    font-size: var(--text-xs);
    font-weight: 500;
    margin-top: var(--space-xs);
  }

  .add-button:disabled {
    background: var(--color-gray-300);
    color: var(--color-gray-500);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media (min-width: 640px) {
    .add-item-form {
      padding: var(--space-lg);
      border-radius: var(--border-radius-md);
      margin-bottom: var(--space-lg);
    }

    .add-item-form h2 {
      font-size: var(--text-2xl);
      margin-bottom: var(--space-lg);
    }

    .add-button {
      width: auto;
      justify-self: start;
    }
  }

  @media (min-width: 1024px) {
    .add-item-form {
      padding: var(--space-xl);
      border-radius: var(--border-radius-lg);
      margin-bottom: var(--space-xl);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .add-button {
      transition: none;
    }

    .add-button:hover {
      transform: none;
    }
  }

  /* Large desktop styles (1280px+) */
  @media (min-width: 1280px) {
    .form-grid {
      gap: 1.5rem;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .form-group input,
    .form-group select {
      border-width: 3px;
    }
  }
</style>
