<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import { toasts, removeToast, type Toast } from "./store.js";

  function getToastIcon(type: Toast["type"]) {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "ℹ️";
    }
  }

  function getToastColor(type: Toast["type"]) {
    switch (type) {
      case "success":
        return "var(--color-success, #10b981)";
      case "error":
        return "var(--color-error, #ef4444)";
      case "warning":
        return "var(--color-warning, #f59e0b)";
      case "info":
        return "var(--color-info, #3b82f6)";
      default:
        return "var(--color-info, #3b82f6)";
    }
  }
</script>

<div class="toast-container">
  {#each $toasts as toast (toast.id)}
    <div
      class="toast toast-{toast.type}"
      style="--toast-color: {getToastColor(toast.type)}"
      transition:fly={{ y: -50, duration: 300 }}
      role="alert"
    >
      <div class="toast-content">
        <span class="toast-icon">{getToastIcon(toast.type)}</span>
        <span class="toast-message">{toast.message}</span>
      </div>
      <button
        class="toast-close"
        on:click={() => removeToast(toast.id)}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    pointer-events: none;
    max-width: 400px;
  }

  .toast {
    background: white;
    border: 1px solid var(--toast-color);
    border-left: 4px solid var(--toast-color);
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    pointer-events: auto;
    min-width: 300px;
  }

  .toast-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
  }

  .toast-icon {
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .toast-message {
    font-size: 0.9rem;
    line-height: 1.4;
    color: var(--color-text, #374151);
  }

  .toast-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6b7280;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .toast-close:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #374151;
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .toast {
      background: #1f2937;
      color: #f9fafb;
    }

    .toast-message {
      color: #f9fafb;
    }

    .toast-close {
      color: #9ca3af;
    }

    .toast-close:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #f9fafb;
    }
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .toast-container {
      left: 1rem;
      right: 1rem;
      max-width: none;
    }

    .toast {
      min-width: auto;
    }
  }
</style>
