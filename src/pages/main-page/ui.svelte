<script lang="ts">
  import AuthWrapper from "./auth-wrapper.svelte";
  import GearListManager from "./gear-list-manager.svelte";
  import GearInterface from "./gear-interface.svelte";
</script>

<svelte:head>
  <title>Gear Planner</title>
  <meta
    name="description"
    content="Plan your hiking gear with weight tracking and organization"
  />
</svelte:head>

<main>
  <header>
    <h1>🎒 Gear Planner</h1>
    <p>Organize your hiking gear with smart weight tracking</p>
  </header>

  <AuthWrapper>
    <GearListManager />
    <GearInterface />
  </AuthWrapper>
</main>

<style>
  main {
    padding: clamp(1rem, 4vw, 2rem);
    max-width: 1200px;
    margin: 0 auto;
  }

  header {
    text-align: center;
    margin-bottom: clamp(2rem, 6vw, 3rem);
  }

  header h1 {
    font-size: clamp(2rem, 6vw, 3rem);
    margin-bottom: 0.5rem;
    color: var(--color-primary);
  }

  header p {
    font-size: clamp(1rem, 3vw, 1.25rem);
    color: var(--color-text-light);
  }
</style>
