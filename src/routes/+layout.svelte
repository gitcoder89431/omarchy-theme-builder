<script>
  import "../app.css";
  import { onMount } from "svelte";
  import { cssVariables, applyCssVariables } from "../lib/stores/theme.js";
  import { keyboardMode, createSkipLinks } from "../lib/stores/keyboard.js";

  const skipLinks = createSkipLinks();

  // Apply theme CSS variables when they change
  onMount(() => {
    const unsubscribe = cssVariables.subscribe((variables) => {
      applyCssVariables(variables);
    });

    return unsubscribe;
  });

  function handleSkipLinkClick(event, href) {
    event.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: "smooth" });
    }
  }
</script>

<!-- Skip Links for keyboard navigation -->
<div class="skip-links">
  {#each skipLinks as link}
    <a
      href={link.href}
      class="skip-link"
      on:click={(e) => handleSkipLinkClick(e, link.href)}
    >
      {link.text}
    </a>
  {/each}
</div>

<!-- ARIA Live Region for announcements -->
<div
  id="live-region"
  aria-live="polite"
  aria-atomic="true"
  class="sr-only"
></div>

<main class="app-container" id="main-content">
  <slot />
</main>

<style>
  :global(html) {
    height: 100%;
  }

  :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  .app-container {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  /* Skip Links */
  .skip-links {
    position: absolute;
    top: -100px;
    left: 0;
    width: 100%;
    z-index: 1000;
  }

  .skip-link {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background: var(--omarchy-iris, #c4a7e7);
    color: var(--omarchy-bg, #191724);
    padding: 8px 16px;
    text-decoration: none;
    border-radius: 0 0 4px 4px;
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: all 0.2s ease;
  }

  .skip-link:focus {
    top: 0;
    outline: 2px solid var(--omarchy-love, #eb6f92);
    outline-offset: 2px;
  }

  .skip-link:hover:focus {
    background: var(--omarchy-love, #eb6f92);
  }

  /* Screen reader only class */
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

  /* Enhanced focus styles for keyboard navigation mode */
  :global(.keyboard-mode) :global(*:focus) {
    outline: 2px solid var(--omarchy-iris, #c4a7e7);
    outline-offset: 2px;
  }

  /* Hide focus outline for mouse users */
  :global(.keyboard-mode) :global(*:focus:not(:focus-visible)) {
    outline: none;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .skip-link {
      border: 2px solid currentColor;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .skip-link {
      transition: none;
    }
  }
</style>
