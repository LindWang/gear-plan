<script lang="ts">
  import { scale, fade } from "svelte/transition";
  import {
    confirmDialogs,
    hideConfirmDialog,
    type ConfirmDialog,
  } from "./store.js";

  async function handleConfirm(dialog: ConfirmDialog) {
    try {
      await dialog.onConfirm();
    } catch (error) {
      console.error("Error in confirm action:", error);
    } finally {
      hideConfirmDialog(dialog.id);
    }
  }

  function handleCancel(dialog: ConfirmDialog) {
    dialog.onCancel?.();
    hideConfirmDialog(dialog.id);
  }

  function getDialogIcon(type: ConfirmDialog["type"]) {
    switch (type) {
      case "danger":
        return "⚠️";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "ℹ️";
    }
  }

  function getDialogColor(type: ConfirmDialog["type"]) {
    switch (type) {
      case "danger":
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

{#each $confirmDialogs as dialog (dialog.id)}
  <div
    class="dialog-overlay"
    transition:fade={{ duration: 200 }}
    on:click={() => handleCancel(dialog)}
    role="presentation"
  >
    <div
      class="dialog"
      style="--dialog-color: {getDialogColor(dialog.type)}"
      transition:scale={{ duration: 200 }}
      on:click|stopPropagation
      on:keydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleConfirm(dialog);
        }
      }}
      role="dialog"
      tabindex="0"
      aria-labelledby="dialog-title-{dialog.id}"
      aria-describedby="dialog-message-{dialog.id}"
    >
      <div class="dialog-header">
        <div class="dialog-icon">
          {getDialogIcon(dialog.type)}
        </div>
        <h3 id="dialog-title-{dialog.id}" class="dialog-title">
          {dialog.title}
        </h3>
      </div>

      <div class="dialog-content">
        <p id="dialog-message-{dialog.id}" class="dialog-message">
          {dialog.message}
        </p>
      </div>

      <div class="dialog-actions">
        <button
          class="dialog-button dialog-button-cancel"
          on:click={() => handleCancel(dialog)}
        >
          {dialog.cancelText}
        </button>
        <button
          class="dialog-button dialog-button-confirm"
          class:dialog-button-danger={dialog.type === "danger"}
          on:click={() => handleConfirm(dialog)}
        >
          {dialog.confirmText}
        </button>
      </div>
    </div>
  </div>
{/each}

<style>
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 1100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .dialog {
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 32px rgba(0, 0, 0, 0.15);
    max-width: 400px;
    width: 100%;
    max-height: 90vh;
    overflow: auto;
  }

  .dialog-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }

  .dialog-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .dialog-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text, #111827);
  }

  .dialog-content {
    padding: 0 1.5rem 1.5rem 1.5rem;
  }

  .dialog-message {
    margin: 0;
    color: var(--color-text-light, #6b7280);
    line-height: 1.5;
  }

  .dialog-actions {
    display: flex;
    gap: 0.75rem;
    padding: 1rem 1.5rem 1.5rem 1.5rem;
    justify-content: flex-end;
  }

  .dialog-button {
    padding: 0.5rem 1rem;
    border: 1px solid var(--color-border, #d1d5db);
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 80px;
  }

  .dialog-button-cancel {
    background: white;
    color: var(--color-text, #374151);
  }

  .dialog-button-cancel:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }

  .dialog-button-confirm {
    background: var(--dialog-color);
    color: white;
    border-color: var(--dialog-color);
  }

  .dialog-button-confirm:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .dialog-button-danger {
    background: var(--color-error, #ef4444);
    border-color: var(--color-error, #ef4444);
  }

  .dialog-button-danger:hover {
    background: #dc2626;
    border-color: #dc2626;
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .dialog {
      background: #1f2937;
    }

    .dialog-title {
      color: #f9fafb;
    }

    .dialog-message {
      color: #d1d5db;
    }

    .dialog-button-cancel {
      background: #374151;
      color: #f9fafb;
      border-color: #4b5563;
    }

    .dialog-button-cancel:hover {
      background: #4b5563;
    }
  }
</style>
