<script lang="ts">
  import { formatWeight } from "@/shared/lib/utils.js";
  import {
    totalWeight,
    gearItems,
    categoryStats,
  } from "@/app/providers/store.js";
</script>

{#if $gearItems.length > 0}
  <section class="weight-summary">
    <h2>Weight Summary</h2>
    <div class="total-weight">
      <strong>Total Weight: {formatWeight($totalWeight)}</strong>
    </div>

    <!-- Category Breakdown -->
    <div class="category-breakdown">
      <h3>By Category</h3>
      {#each $categoryStats.sort((a, b) => b.totalWeight - a.totalWeight) as stat}
        <div class="category-stat">
          <div class="category-info">
            <span class="category-name">{stat.category}</span>
            <span class="category-count"
              >({stat.itemCount} item{stat.itemCount !== 1 ? "s" : ""})</span
            >
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
{/if}

<style>
  .weight-summary {
    background: var(--color-surface);
    border-radius: var(--border-radius);
    padding: var(--space-md);
    margin-bottom: var(--space-md);
    box-shadow: var(--shadow-medium);
  }

  .weight-summary h2 {
    margin: 0 0 var(--space-md);
    color: var(--color-text);
    font-size: var(--text-xl);
    line-height: 1.3;
  }

  .total-weight {
    background: var(--color-primary);
    color: var(--color-text-inverse);
    padding: var(--space-lg) var(--space-md);
    border-radius: var(--border-radius-sm);
    text-align: center;
    margin-bottom: var(--space-lg);
    font-size: var(--text-lg);
    line-height: 1.4;
    font-weight: 600;
    box-shadow: var(--shadow-sm);
  }

  @media (min-width: 640px) {
    .weight-summary {
      padding: var(--space-lg);
      border-radius: var(--border-radius-md);
      margin-bottom: var(--space-lg);
    }

    .weight-summary h2 {
      font-size: var(--text-2xl);
      margin-bottom: var(--space-lg);
    }

    .total-weight {
      padding: var(--space-lg) var(--space-xl);
      border-radius: var(--border-radius);
      margin-bottom: var(--space-xl);
      font-size: var(--text-xl);
    }
  }

  @media (min-width: 1024px) {
    .weight-summary {
      padding: var(--space-xl);
      border-radius: var(--border-radius-lg);
      margin-bottom: var(--space-xl);
    }

    .weight-summary h2 {
      font-size: var(--text-2xl);
      margin-bottom: var(--space-lg);
    }

    .total-weight {
      font-size: var(--text-xl);
      padding: var(--space-xl);
    }
  }

  .category-breakdown h3 {
    margin: var(--space-lg) 0 var(--space-sm);
    color: var(--color-text);
    font-size: var(--text-base);
    line-height: 1.3;
    font-weight: 600;
  }

  .category-stat {
    margin-bottom: var(--space-sm);
    padding: var(--space-sm);
    background: var(--color-background-alt);
    border-radius: var(--border-radius-sm);
    border-left: 3px solid var(--color-primary);
    transition: all 0.2s ease;
  }

  .category-stat:hover {
    background: var(--color-surface-hover);
  }

  .category-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--gap-sm);
    gap: var(--gap-sm);
    flex-wrap: wrap;
  }

  .category-name {
    font-weight: 600;
    color: var(--color-text);
    font-size: var(--text-sm);
    line-height: 1.4;
    flex: 1;
    min-width: 0;
  }

  .category-count {
    color: var(--color-text-light);
    font-size: var(--text-xs);
    line-height: 1.4;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .category-weight {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--gap-sm);
    gap: var(--gap-sm);
  }

  .category-weight .weight {
    font-weight: 600;
    color: var(--color-text-light);
    font-size: var(--text-sm);
    line-height: 1.4;
  }

  .percentage {
    background: var(--color-primary);
    color: var(--color-text-inverse);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--border-radius-lg);
    font-size: var(--text-xs);
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
    flex-shrink: 0;
    min-width: fit-content;
  }

  .progress-bar {
    height: 4px;
    background: var(--color-gray-200);
    border-radius: 2px;
    overflow: hidden;
    position: relative;
  }

  .progress-fill {
    height: 100%;
    background: var(--color-primary);
    border-radius: 2px;
    transition: width 0.6s ease-out;
    min-width: 2px;
  }

  /* Tablet category styles */
  @media (min-width: 640px) {
    .category-breakdown h3 {
      margin-bottom: 1rem;
      font-size: 1.05rem;
    }

    .category-stat {
      margin-bottom: 1rem;
      padding: 1rem;
      border-radius: 8px;
      border-left-width: 4px;
    }

    .category-name {
      font-size: 0.9rem;
    }

    .category-count {
      font-size: 0.8rem;
    }

    .category-weight .weight {
      font-size: 0.9rem;
    }

    .percentage {
      font-size: 0.8rem;
      padding: 0.3rem 0.6rem;
      border-radius: 12px;
    }

    .progress-bar {
      height: 5px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .category-stat,
    .progress-fill {
      transition: none;
    }
  }
</style>
