<script lang="ts">
  import "@/app/styles/variables.css";
  import "@/app/styles/global.css";
  import { Toast, ConfirmDialog } from "@/shared/ui";

  let { children } = $props();
</script>

<svelte:head>
  <link
    rel="icon"
    href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><text y='18' font-size='18'>🎒</text></svg>"
  />
</svelte:head>

{@render children?.()}

<!-- Global UI Components -->
<Toast />
<ConfirmDialog />
