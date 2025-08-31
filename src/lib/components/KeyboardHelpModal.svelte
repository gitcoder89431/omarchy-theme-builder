<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { helpModalOpen } from '../stores/keyboard.js';
  import { focusManager } from '../stores/keyboard.js';

  const dispatch = createEventDispatcher();

  let modalRef;
  let focusTrap;

  // Keyboard shortcuts organized by category
  const shortcutCategories = [
    {
      title: 'General',
      shortcuts: [
        { keys: ['T'], description: 'Toggle theme controls panel' },
        { keys: ['?', 'H'], description: 'Show/hide this help modal' },
        { keys: ['Escape'], description: 'Close modal or panel' }
      ]
    },
    {
      title: 'Theme Controls',
      shortcuts: [
        { keys: ['E'], description: 'Export current theme' },
        { keys: ['R'], description: 'Reset theme to default' },
        { keys: ['→', '←'], description: 'Navigate between presets' },
        { keys: ['Enter', 'Space'], description: 'Open color picker' }
      ]
    },
    {
      title: 'Quick Preset Access',
      shortcuts: [
        { keys: ['1'], description: 'Apply Rose Pine theme' },
        { keys: ['2'], description: 'Apply Catppuccin theme' },
        { keys: ['3'], description: 'Apply Nord theme' },
        { keys: ['4'], description: 'Apply Tokyo Night theme' },
        { keys: ['5'], description: 'Apply Everforest theme' },
        { keys: ['6'], description: 'Apply Gruvbox theme' },
        { keys: ['7'], description: 'Apply Kanagawa theme' }
      ]
    },
    {
      title: 'Navigation',
      shortcuts: [
        { keys: ['Tab'], description: 'Move to next focusable element' },
        { keys: ['Shift', '+', 'Tab'], description: 'Move to previous focusable element' },
        { keys: ['Enter'], description: 'Activate focused element' },
        { keys: ['Space'], description: 'Activate button or toggle' }
      ]
    }
  ];

  function closeModal() {
    helpModalOpen.set(false);
    dispatch('close');
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
    }
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  onMount(() => {
    // Setup focus trap
    if (modalRef) {
      focusTrap = focusManager.setupFocusTrap(modalRef);
    }

    // Add keyboard listener
    document.addEventListener('keydown', handleKeydown);

    return () => {
      // Cleanup
      document.removeEventListener('keydown', handleKeydown);
      if (focusTrap) {
        focusTrap.destroy();
      }
      focusManager.restoreFocus();
    };
  });

  function renderKey(key) {
    // Special key mappings for display
    const keyMappings = {
      'ArrowLeft': '←',
      'ArrowRight': '→',
      'ArrowUp': '↑',
      'ArrowDown': '↓',
      'Enter': '↵',
      'Space': '␣',
      'Escape': 'Esc',
      'Shift': '⇧',
      'Ctrl': '⌃',
      'Alt': '⌥',
      'Meta': '⌘'
    };

    return keyMappings[key] || key;
  }
</script>

{#if $helpModalOpen}
  <!-- Modal backdrop -->
  <div
    class="help-modal-backdrop fixed inset-0 z-[100] flex items-center justify-center"
    style="background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px);"
    on:click={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-labelledby="help-modal-title"
  >
    <!-- Modal content -->
    <div
      bind:this={modalRef}
      class="help-modal frosted-panel border shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
      style="
        background: rgba(31, 29, 46, 0.95);
        border-color: rgba(38, 35, 58, 0.5);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1);
      "
    >
      <!-- Header -->
      <div
        class="help-modal-header flex items-center justify-between p-6 border-b"
        style="border-color: rgba(38, 35, 58, 0.3);"
      >
        <div class="flex items-center space-x-3">
          <div
            class="w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-lg"
            style="background: linear-gradient(135deg, var(--omarchy-iris), var(--omarchy-love));"
          >
            ⌨️
          </div>
          <div>
            <h2
              id="help-modal-title"
              class="text-xl font-bold"
              style="color: var(--omarchy-fg);"
            >
              Keyboard Shortcuts
            </h2>
            <p
              class="text-sm"
              style="color: var(--omarchy-subtle);"
            >
              Navigate the theme builder efficiently
            </p>
          </div>
        </div>
        <button
          class="close-button w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style="
            color: var(--omarchy-muted);
            background: transparent;
          "
          on:click={closeModal}
          aria-label="Close help modal"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="help-modal-content p-6 overflow-y-auto">
        <div class="space-y-6">
          {#each shortcutCategories as category}
            <div class="shortcut-category">
              <h3
                class="text-sm font-bold mb-3 tracking-wide"
                style="color: var(--omarchy-iris);"
              >
                {category.title.toUpperCase()}
              </h3>
              <div class="space-y-2">
                {#each category.shortcuts as shortcut}
                  <div
                    class="shortcut-item flex items-center justify-between p-3 rounded-lg"
                    style="background: var(--omarchy-highlight-low);"
                  >
                    <span
                      class="shortcut-description text-sm"
                      style="color: var(--omarchy-fg);"
                    >
                      {shortcut.description}
                    </span>
                    <div class="shortcut-keys flex items-center space-x-1">
                      {#each shortcut.keys as key, index}
                        {#if index > 0}
                          <span
                            class="key-separator text-xs"
                            style="color: var(--omarchy-muted);"
                          >
                            +
                          </span>
                        {/if}
                        <kbd
                          class="key px-2 py-1 text-xs font-mono rounded border"
                          style="
                            background: var(--omarchy-surface);
                            color: var(--omarchy-fg);
                            border-color: var(--omarchy-overlay);
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                          "
                        >
                          {renderKey(key)}
                        </kbd>
                      {/each}
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/each}
        </div>

        <!-- Footer tip -->
        <div
          class="help-footer mt-8 pt-6 border-t text-center"
          style="border-color: rgba(38, 35, 58, 0.3);"
        >
          <p
            class="text-sm"
            style="color: var(--omarchy-subtle);"
          >
            💡 <strong>Tip:</strong> Press <kbd
              class="px-2 py-1 text-xs font-mono rounded"
              style="background: var(--omarchy-surface); border: 1px solid var(--omarchy-overlay);"
            >Tab</kbd> to enable keyboard navigation mode
          </p>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .help-modal {
    border-radius: 12px;
  }

  .close-button:hover {
    background: var(--omarchy-highlight-low) !important;
    color: var(--omarchy-fg) !important;
  }

  .close-button:focus {
    outline: 2px solid var(--omarchy-iris);
    outline-offset: 2px;
  }

  .shortcut-item {
    transition: all 0.2s ease;
  }

  .shortcut-item:hover {
    background: var(--omarchy-highlight-med) !important;
  }

  .key {
    min-width: 24px;
    text-align: center;
    font-weight: 600;
  }

  .help-modal-content {
    max-height: calc(80vh - 120px);
  }

  .help-modal-content::-webkit-scrollbar {
    width: 6px;
  }

  .help-modal-content::-webkit-scrollbar-track {
    background: var(--omarchy-surface);
    border-radius: 3px;
  }

  .help-modal-content::-webkit-scrollbar-thumb {
    background: var(--omarchy-muted);
    border-radius: 3px;
  }

  .help-modal-content::-webkit-scrollbar-thumb:hover {
    background: var(--omarchy-subtle);
  }

  /* Focus styles for keyboard navigation */
  :global(.keyboard-mode) .close-button:focus,
  :global(.keyboard-mode) button:focus {
    outline: 2px solid var(--omarchy-iris);
    outline-offset: 2px;
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
</style>
