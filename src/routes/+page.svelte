<script>
  import { onMount } from "svelte";
  import Desktop from "../lib/components/Desktop.svelte";
  import { currentTheme, addNotification } from "../lib/stores/theme.js";

  onMount(() => {
    // Component initialized
  });
</script>

<svelte:head>
  <title>Omarchy Theme Builder - Interactive Desktop Theme Editor</title>
  <meta
    name="description"
    content="Build and preview Omarchy desktop themes in real-time with our interactive theme builder. Export ready-to-use theme files."
  />
</svelte:head>

<div class="page-container h-screen w-screen overflow-hidden">
  <!-- Main Desktop Simulation -->
  <Desktop />

  <!-- SEO Content (hidden but accessible) -->
  <div class="sr-only">
    <h1>Omarchy Theme Builder</h1>
    <p>
      Interactive desktop theme editor for Omarchy Linux desktop environment
    </p>
    <p>Current theme: {$currentTheme.name}</p>
  </div>
</div>

<style>
  .page-container {
    font-family: "Inter", system-ui, sans-serif;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
