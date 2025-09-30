<script lang="ts">
  import { formatWeight } from "@/shared/lib/utils.js";
  import { gearItems, totalWeight } from "@/app/providers/store.js";

  // Calculate additional statistics
  $: totalItems = $gearItems.length;
  $: categoriesUsed = new Set($gearItems.map((item) => item.category)).size;
  $: averageWeight = totalItems > 0 ? $totalWeight / totalItems : 0;

  // Weight distribution ranges
  $: weightDistribution = (() => {
    const ranges = {
      ultraLight: { count: 0, label: "Ultra Light", range: "< 100g" },
      light: { count: 0, label: "Light", range: "100-500g" },
      medium: { count: 0, label: "Medium", range: "500g-1kg" },
      heavy: { count: 0, label: "Heavy", range: "> 1kg" },
    };

    $gearItems.forEach((item) => {
      const weight = item.weight * item.quantity;
      if (weight < 100) ranges.ultraLight.count++;
      else if (weight < 500) ranges.light.count++;
      else if (weight < 1000) ranges.medium.count++;
      else ranges.heavy.count++;
    });

    return ranges;
  })();
</script>

{#if $gearItems.length > 0}
  <div class="gear-statistics">
    <h3>Gear Statistics</h3>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{totalItems}</div>
        <div class="stat-label">Total Items</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">{weightDistribution.heavy.count}</div>
        <div class="stat-label">Heavy Items (>1kg)</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">
          {formatWeight(Math.round(averageWeight * 10) / 10)}
        </div>
        <div class="stat-label">Average Weight</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">{categoriesUsed}</div>
        <div class="stat-label">Categories Used</div>
      </div>
    </div>

    <div class="weight-distribution">
      <h4>Weight Distribution</h4>
      <div class="distribution-grid">
        {#each Object.entries(weightDistribution) as [key, range]}
          <div class="distribution-item">
            <div class="distribution-header">
              <span class="range-label">{range.label}</span>
              <span class="range-count">{range.count}</span>
            </div>
            <div class="range-info">{range.range}</div>
            <div class="distribution-bar">
              <div
                class="distribution-fill {key}"
                style="width: {totalItems > 0
                  ? (range.count / totalItems) * 100
                  : 0}%"
              ></div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class="empty-stats">
    <p>📊 Add gear items to see statistics</p>
  </div>
{/if}

<style>
  .gear-statistics h3 {
    margin-bottom: var(--space-md);
    color: var(--color-text);
    font-size: var(--text-base);
    line-height: 1.3;
    font-weight: 600;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--gap-sm);
    margin-bottom: var(--space-lg);
  }

  .stat-card {
    background: var(--color-background-alt);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-sm);
    padding: var(--space-md);
    text-align: center;
    transition: all 0.2s ease;
  }

  .stat-card:hover {
    background: var(--color-surface-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }

  .stat-value {
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--color-primary);
    margin-bottom: var(--space-xs);
    line-height: 1.2;
  }

  .stat-label {
    font-size: var(--text-xs);
    color: var(--color-text-light);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    line-height: 1.3;
  }

  .empty-stats {
    background: var(--color-surface);
    border-radius: var(--border-radius-sm);
    padding: var(--space-xl) var(--space-md);
    text-align: center;
    color: var(--color-text-muted);
    font-size: var(--text-base);
    line-height: 1.5;
  }

  .weight-distribution {
    margin-top: var(--space-lg);
  }

  .weight-distribution h4 {
    margin: 0 0 var(--space-md) 0;
    color: var(--color-text);
    font-size: var(--text-sm);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .distribution-grid {
    display: grid;
    gap: var(--gap-sm);
  }

  .distribution-item {
    background: var(--color-background-alt);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-sm);
    padding: var(--space-sm);
  }

  .distribution-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-xs);
  }

  .range-label {
    font-weight: 500;
    color: var(--color-text);
    font-size: var(--text-sm);
  }

  .range-count {
    font-weight: 600;
    color: var(--color-primary);
    font-size: var(--text-sm);
  }

  .range-info {
    color: var(--color-text-light);
    font-size: var(--text-xs);
    margin-bottom: var(--gap-sm);
  }

  .distribution-bar {
    height: 4px;
    background: var(--color-gray-200);
    border-radius: 2px;
    overflow: hidden;
  }

  .distribution-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.6s ease-out;
    min-width: 2px;
  }

  .distribution-fill.ultraLight {
    background: #10b981; /* Green - lightweight */
  }

  .distribution-fill.light {
    background: #3b82f6; /* Blue - light */
  }

  .distribution-fill.medium {
    background: #f59e0b; /* Orange - medium */
  }

  .distribution-fill.heavy {
    background: #ef4444; /* Red - heavy */
  }

  /* Tablet styles (640px+) */
  @media (min-width: 640px) {
    .gear-statistics h3 {
      font-size: 1.05rem;
      margin-bottom: 1.25rem;
    }

    .stats-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    .stat-card {
      padding: 1.25rem 1rem;
      border-radius: 8px;
    }

    .stat-value {
      font-size: 1.375rem;
    }

    .stat-label {
      font-size: 0.8rem;
    }

    .heaviest-item {
      padding: 1.25rem;
      border-radius: 8px;
    }

    .item-name,
    .item-weight {
      font-size: 0.9rem;
    }

    .empty-stats {
      padding: 2.5rem 2rem;
      border-radius: 8px;
      font-size: 1.1rem;
    }

    .distribution-grid {
      gap: 1rem;
    }

    .distribution-item {
      padding: 1rem;
      border-radius: 8px;
    }

    .range-label,
    .range-count {
      font-size: 0.9rem;
    }

    .distribution-bar {
      height: 5px;
    }
  }

  /* Desktop styles (1024px+) */
  @media (min-width: 1024px) {
    .gear-statistics h3 {
      font-size: 1.1rem;
    }

    .stat-card {
      padding: 1.5rem 1rem;
    }

    .stat-value {
      font-size: 1.5rem;
    }

    .stat-label {
      font-size: 0.85rem;
    }

    .heaviest-item {
      padding: 1.5rem;
    }
  } /* <-- Close the 1024px media query */

  @media (prefers-reduced-motion: reduce) {
    .stat-card,
    .distribution-fill {
      transition: none;
    }

    .stat-card:hover {
      transform: none;
    }
  }
</style>
