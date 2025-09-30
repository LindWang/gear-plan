<script lang="ts">
  import { currentGearList } from "@/app/providers/store.js";
  import GearItemForm from "@/widgets/gear-form/index.js";
  import WeightSummary from "@/widgets/weight-summary/index.js";
  import GearList from "@/widgets/gear-list/index.js";
  import CategoryStats from "@/widgets/gear-stats/index.js";
</script>

<!-- Selected Gear List Interface -->
{#if $currentGearList}
  <section class="gear-section">
    <h2>{$currentGearList.name}</h2>
    {#if $currentGearList.description}
      <p class="list-description">{$currentGearList.description}</p>
    {/if}

    <div class="gear-interface">
      <div class="gear-forms">
        <GearItemForm />
        <WeightSummary />
      </div>

      <div class="gear-content">
        <CategoryStats />
        <GearList />
      </div>
    </div>
  </section>
{/if}

<style>
  /* Gear Interface */
  .gear-section h2 {
    margin-bottom: 1rem;
    color: var(--color-primary);
  }

  .list-description {
    font-size: 0.875rem;
    color: var(--color-text-light);
    margin-bottom: 0.5rem;
  }

  .gear-interface {
    display: grid;
    gap: clamp(1rem, 4vw, 2rem);
    grid-template-columns: 1fr;
  }

  .gear-forms {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    overflow: hidden; /* Prevent overflow */
  }

  .gear-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    overflow: hidden; /* Prevent overflow */
  }

  /* Desktop layout - side by side */
  @media (min-width: 1024px) {
    .gear-interface {
      grid-template-columns: 1fr 1fr;
      align-items: start; /* Align to top to prevent stretching */
    }
  }

  /* Large desktop layout - more space for forms */
  @media (min-width: 1280px) {
    .gear-interface {
      grid-template-columns: 400px 1fr;
    }
  }
</style>
