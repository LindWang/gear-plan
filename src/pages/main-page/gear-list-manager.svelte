<script lang="ts">
  import {
    userGearLists,
    currentGearList,
    createGearList,
    loadUserGearLists,
    loadGearList,
    deleteGearList,
    dataError,
    isLoading,
  } from "@/app/providers/store.js";

  $: {
    console.log("GearListManager render:", {
      isLoading: $isLoading,
      dataError: $dataError,
      userGearLists: $userGearLists.length,
    });
  }
  import { addToast, showConfirmDialog } from "@/shared/ui";
  import { onMount } from "svelte";

  let newListName = "";
  let showCreateList = false;
  let hasLoadedLists = false;

  onMount(() => {
    if (!hasLoadedLists) {
      console.log("GearListManager mounted, loading gear lists...");
      hasLoadedLists = true;
      loadUserGearLists();
    }
  });

  async function handleCreateList() {
    console.log("handleCreateList called with name:", newListName);
    if (!newListName.trim()) {
      console.log("No list name provided, returning");
      addToast({
        type: "warning",
        message: "Please enter a name for your gear list.",
      });
      return;
    }

    try {
      console.log("Attempting to create gear list...");
      const result = await createGearList(newListName.trim());
      console.log("Create list result:", result);
      if (result.error) {
        console.error("Failed to create list:", result.error);
        addToast({
          type: "error",
          message: `Failed to create gear list: ${result.error}`,
        });
      } else {
        console.log("List created successfully, clearing form");
        addToast({
          type: "success",
          message: `Gear list "${newListName}" created successfully!`,
        });
        newListName = "";
        showCreateList = false;
      }
    } catch (error) {
      console.error("Failed to create list:", error);
      addToast({
        type: "error",
        message: `Failed to create gear list: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  }

  async function handleSelectList(listId: string) {
    console.log("Selecting gear list:", listId);
    try {
      await loadGearList(listId);
      console.log("Successfully selected gear list");
    } catch (error) {
      console.error("Failed to select list:", error);
      addToast({
        type: "error",
        message: `Failed to select gear list: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  }

  async function handleDeleteList(listId: string, listName: string) {
    showConfirmDialog({
      title: "Delete Gear List",
      message: `Are you sure you want to delete "${listName}"? This action cannot be undone and will delete all gear items in this list.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        try {
          console.log("Deleting gear list:", listId);
          await deleteGearList(listId);
          console.log("Successfully deleted gear list");
          addToast({
            type: "success",
            message: `Gear list "${listName}" has been deleted successfully.`,
          });
        } catch (error) {
          console.error("Failed to delete list:", error);
          addToast({
            type: "error",
            message: `Failed to delete gear list: ${error instanceof Error ? error.message : "Unknown error"}`,
          });
        }
      },
    });
  }
</script>

<!-- Gear Lists Management -->
<section class="lists-section">
  {#if $isLoading}
    <div class="loading-indicator">
      <p>Loading gear lists...</p>
    </div>
  {/if}
  <div class="lists-header">
    <h2>Your Gear Lists</h2>
    <button
      on:click={() => {
        console.log(
          "New List button clicked, current showCreateList:",
          showCreateList
        );
        showCreateList = !showCreateList;
        console.log("showCreateList is now:", showCreateList);
      }}
      class="create-list-button"
    >
      + New List
    </button>
  </div>

  {#if showCreateList}
    {console.log("Rendering create list form, showCreateList:", showCreateList)}
    <div class="create-list-form">
      <input
        type="text"
        bind:value={newListName}
        placeholder="Enter list name"
        on:keydown={(e) => e.key === "Enter" && handleCreateList()}
      />
      <button on:click={handleCreateList}>Create</button>
      <button on:click={() => (showCreateList = false)}>Cancel</button>
    </div>
  {/if}

  {#if $dataError}
    <div class="error-state">
      <p style="color: #ff3838; font-weight: bold;">{$dataError}</p>
    </div>
  {:else if $userGearLists.length > 0}
    <div class="gear-lists">
      {#each $userGearLists as list}
        <div class="list-item-container">
          <button
            class="list-item"
            class:active={$currentGearList?.id === list.id}
            on:click={() => handleSelectList(list.id)}
          >
            <div class="list-name">{list.name}</div>
            {#if list.description}
              <div class="list-description">{list.description}</div>
            {/if}
            <div class="list-meta">
              Updated {new Date(list.updated_at).toLocaleDateString()}
            </div>
          </button>
          <button
            class="delete-list-button"
            on:click|stopPropagation={() =>
              handleDeleteList(list.id, list.name)}
            title="Delete list"
            aria-label="Delete {list.name}"
          >
            ❌
          </button>
        </div>
      {/each}
    </div>
  {:else}
    <div class="empty-state">
      <p>No gear lists yet. Create your first list to get started!</p>
    </div>
  {/if}
</section>

<style>
  .loading-indicator {
    text-align: center;
    padding: 2rem;
    color: var(--color-primary);
    font-weight: bold;
  }
  .error-state {
    text-align: center;
    padding: 2rem;
  }
  /* Lists Management */
  .lists-section {
    margin-bottom: 2rem;
  }

  .lists-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .create-list-button {
    padding: 0.5rem 1rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
  }

  .create-list-form {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding: 1rem;
    background: var(--color-surface);
    border-radius: var(--border-radius);
  }

  .create-list-form input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
  }

  .create-list-form button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
  }

  .gear-lists {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .list-item-container {
    position: relative;
    display: flex;
    align-items: stretch;
  }

  .list-item {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    padding: 1rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
    flex: 1;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .delete-list-button {
    color: white;
    border: 1px solid #ff4757;
    border-radius: 0 var(--border-radius) var(--border-radius) 0;
    cursor: pointer;
    transition: all 0.2s;
    padding: 0.5rem;
    font-size: 1rem;
    min-width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .delete-list-button:hover {
    background: #ff3838;
    transform: scale(1.05);
    filter: invert(1);
  }

  .delete-list-button:active {
    transform: scale(0.95);
  }

  .list-item:hover {
    box-shadow: var(--shadow-medium);
  }

  .list-item.active {
    border-color: var(--color-primary);
    background: var(--color-primary-light);
  }

  .list-item-container:hover .list-item {
    box-shadow: var(--shadow-medium);
  }

  .list-item-container .list-item.active {
    border-color: var(--color-primary);
    background: var(--color-primary-light);
  }

  .list-name {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .list-description {
    font-size: 0.875rem;
    color: var(--color-text-light);
    margin-bottom: 0.5rem;
  }

  .list-meta {
    font-size: 0.75rem;
    color: var(--color-text-light);
  }

  .empty-state {
    text-align: center;
    padding: 2rem;
    color: var(--color-text-light);
  }

  @media (max-width: 768px) {
    .lists-header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .create-list-form {
      flex-direction: column;
    }

    .list-item-container {
      flex-direction: column;
    }

    .list-item {
      border-radius: var(--border-radius) var(--border-radius) 0 0;
    }

    .delete-list-button {
      border-radius: 0 0 var(--border-radius) var(--border-radius);
      border: 1px solid #ff4757;
      border-top: none;
      min-height: 44px; /* Touch-friendly height */
      font-size: 1.2rem;
    }
  }
</style>
