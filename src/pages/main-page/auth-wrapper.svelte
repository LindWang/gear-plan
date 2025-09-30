<script lang="ts">
  import { isAuthenticated, user, isLoading } from "@/app/providers/store.js";

  $: {
    console.log("Auth state:", {
      isLoading: $isLoading,
      isAuthenticated: $isAuthenticated,
      user: $user?.email || null,
    });
  }
</script>

{#if $isLoading}
  {console.log("STILL IN LOADING STATE:", {
    isLoading: $isLoading,
    isAuthenticated: $isAuthenticated,
  })}
  <div class="loading">
    <p>Loading...</p>
  </div>
{:else if !$isAuthenticated}
  <!-- No authentication needed -->
  <div class="loading">
    <p>Initializing...</p>
  </div>
{:else}
  {console.log("SHOWING AUTHENTICATED INTERFACE for user:", $user?.email)}
  <!-- Authenticated User Interface -->
  <div class="user-header">
    <p>Welcome, {$user?.name || $user?.email}</p>
  </div>

  <slot />
{/if}

<style>
  .loading {
    text-align: center;
    padding: 2rem;
  }

  /* User Interface Styles */
  .user-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: var(--color-surface);
    border-radius: var(--border-radius);
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    .user-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  }
</style>
