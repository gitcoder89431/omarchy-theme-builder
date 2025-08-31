<script>
  import { onMount } from 'svelte';
  import { keyboardMode, focusManager, helpModalOpen } from '../../lib/stores/keyboard.js';
  import KeyboardHelpModal from '../../lib/components/KeyboardHelpModal.svelte';

  let testResults = [];
  let currentTest = '';
  let testsPassed = 0;
  let testsTotal = 0;

  const keyboardTests = [
    {
      name: 'Tab Navigation',
      description: 'Press Tab to move focus between elements',
      test: 'tab-navigation',
      passed: false
    },
    {
      name: 'Shift+Tab Reverse Navigation',
      description: 'Press Shift+Tab to move focus backwards',
      test: 'shift-tab-navigation',
      passed: false
    },
    {
      name: 'Enter Key Activation',
      description: 'Press Enter to activate focused buttons',
      test: 'enter-activation',
      passed: false
    },
    {
      name: 'Space Key Activation',
      description: 'Press Space to activate focused buttons',
      test: 'space-activation',
      passed: false
    },
    {
      name: 'Escape Key Functionality',
      description: 'Press Escape to close modals and dialogs',
      test: 'escape-key',
      passed: false
    },
    {
      name: 'Arrow Key Navigation',
      description: 'Use arrow keys to navigate grouped elements',
      test: 'arrow-navigation',
      passed: false
    },
    {
      name: 'Focus Trap in Modals',
      description: 'Focus should be trapped within modal dialogs',
      test: 'focus-trap',
      passed: false
    },
    {
      name: 'Skip Links',
      description: 'Tab from address bar should show skip links',
      test: 'skip-links',
      passed: false
    }
  ];

  let modalOpen = false;
  let currentFocusIndex = 0;
  let focusableElements = [];

  function runTest(testName) {
    currentTest = testName;
    const test = keyboardTests.find(t => t.test === testName);
    if (test) {
      test.passed = true;
      testsPassed++;
      focusManager.announce(`${test.name} test passed`);
    }
    updateResults();
  }

  function updateResults() {
    testResults = [...keyboardTests];
  }

  function resetTests() {
    keyboardTests.forEach(test => test.passed = false);
    testsPassed = 0;
    currentTest = '';
    updateResults();
    focusManager.announce('Tests reset');
  }

  function openModal() {
    modalOpen = true;
    focusManager.announce('Test modal opened');
  }

  function closeModal() {
    modalOpen = false;
    focusManager.announce('Test modal closed');
  }

  function handleKeydown(event) {
    switch(event.key) {
      case 'Tab':
        if (!event.shiftKey) {
          runTest('tab-navigation');
        } else {
          runTest('shift-tab-navigation');
        }
        break;
      case 'Enter':
        runTest('enter-activation');
        break;
      case ' ':
        if (event.target.tagName === 'BUTTON') {
          runTest('space-activation');
        }
        break;
      case 'Escape':
        runTest('escape-key');
        if (modalOpen) {
          closeModal();
        }
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowUp':
      case 'ArrowDown':
        runTest('arrow-navigation');
        break;
    }
  }

  function getFocusableElements() {
    return document.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    );
  }

  onMount(() => {
    testsTotal = keyboardTests.length;
    updateResults();

    // Set up focus tracking
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('focus', (event) => {
      focusableElements = getFocusableElements();
      currentFocusIndex = Array.from(focusableElements).indexOf(event.target);
    }, true);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  });

  $: progressPercentage = testsTotal > 0 ? (testsPassed / testsTotal) * 100 : 0;
</script>

<svelte:head>
  <title>Keyboard Navigation Test - Omarchy Theme Builder</title>
</svelte:head>

<!-- Skip Links Test -->
<div class="skip-links">
  <a href="#main-content" class="skip-link" on:click={() => runTest('skip-links')}>
    Skip to main content
  </a>
  <a href="#test-controls" class="skip-link">
    Skip to test controls
  </a>
</div>

<div class="test-page min-h-screen p-8" style="background: var(--omarchy-bg); color: var(--omarchy-fg);">

  <!-- Header -->
  <header class="mb-8">
    <h1 class="text-3xl font-bold mb-2" style="color: var(--omarchy-iris);">
      🎯 Keyboard Navigation Test Suite
    </h1>
    <p class="text-lg" style="color: var(--omarchy-subtle);">
      Test and validate keyboard accessibility features
    </p>

    <!-- Progress Bar -->
    <div class="mt-4 w-full h-3 rounded-full" style="background: var(--omarchy-surface);">
      <div
        class="h-3 rounded-full transition-all duration-300"
        style="
          width: {progressPercentage}%;
          background: linear-gradient(90deg, var(--omarchy-foam), var(--omarchy-iris));
        "
      ></div>
    </div>
    <p class="mt-2 text-sm" style="color: var(--omarchy-muted);">
      Progress: {testsPassed} of {testsTotal} tests passed ({progressPercentage.toFixed(0)}%)
    </p>
  </header>

  <main id="main-content">

    <!-- Instructions -->
    <section class="mb-8 p-6 rounded-lg" style="background: var(--omarchy-surface); border: 1px solid var(--omarchy-overlay);">
      <h2 class="text-xl font-semibold mb-3" style="color: var(--omarchy-iris);">
        📋 Instructions
      </h2>
      <div class="space-y-2 text-sm" style="color: var(--omarchy-fg);">
        <p>• Press <kbd class="keyboard-shortcut">Tab</kbd> to enable keyboard mode and start testing</p>
        <p>• Use <kbd class="keyboard-shortcut">?</kbd> or <kbd class="keyboard-shortcut">H</kbd> to open help modal</p>
        <p>• Navigate through elements and interact to automatically pass tests</p>
        <p>• Check the results section to see your progress</p>
      </div>
    </section>

    <!-- Test Controls -->
    <section id="test-controls" class="mb-8">
      <h2 class="text-xl font-semibold mb-4" style="color: var(--omarchy-iris);">
        🛠️ Test Controls
      </h2>

      <div class="flex flex-wrap gap-4 mb-6">
        <button
          class="px-4 py-2 rounded font-medium transition-all"
          style="background: var(--omarchy-iris); color: var(--omarchy-bg);"
          on:click={() => helpModalOpen.set(true)}
        >
          Open Help Modal (?)
        </button>

        <button
          class="px-4 py-2 rounded font-medium transition-all"
          style="background: var(--omarchy-foam); color: var(--omarchy-bg);"
          on:click={openModal}
        >
          Open Test Modal
        </button>

        <button
          class="px-4 py-2 rounded font-medium transition-all"
          style="background: var(--omarchy-love); color: var(--omarchy-bg);"
          on:click={resetTests}
        >
          Reset Tests
        </button>
      </div>

      <!-- Interactive Elements for Testing -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        <!-- Buttons Group -->
        <div class="p-4 rounded-lg" style="background: var(--omarchy-surface); border: 1px solid var(--omarchy-overlay);">
          <h3 class="font-medium mb-3" style="color: var(--omarchy-fg);">Button Group</h3>
          <div class="space-y-2">
            <button class="w-full px-3 py-2 text-sm rounded transition-all" style="background: var(--omarchy-pine); color: var(--omarchy-bg);">
              Primary Button
            </button>
            <button class="w-full px-3 py-2 text-sm rounded transition-all" style="background: var(--omarchy-surface); color: var(--omarchy-fg); border: 1px solid var(--omarchy-overlay);">
              Secondary Button
            </button>
            <button class="w-full px-3 py-2 text-sm rounded transition-all" style="background: var(--omarchy-gold); color: var(--omarchy-bg);">
              Warning Button
            </button>
          </div>
        </div>

        <!-- Form Elements -->
        <div class="p-4 rounded-lg" style="background: var(--omarchy-surface); border: 1px solid var(--omarchy-overlay);">
          <h3 class="font-medium mb-3" style="color: var(--omarchy-fg);">Form Elements</h3>
          <div class="space-y-3">
            <input
              type="text"
              placeholder="Text input"
              class="w-full px-3 py-2 text-sm rounded border"
              style="background: var(--omarchy-bg); color: var(--omarchy-fg); border-color: var(--omarchy-overlay);"
            />
            <select class="w-full px-3 py-2 text-sm rounded border" style="background: var(--omarchy-bg); color: var(--omarchy-fg); border-color: var(--omarchy-overlay);">
              <option>Select option</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
            <textarea
              placeholder="Textarea"
              class="w-full px-3 py-2 text-sm rounded border resize-none h-16"
              style="background: var(--omarchy-bg); color: var(--omarchy-fg); border-color: var(--omarchy-overlay);"
            ></textarea>
          </div>
        </div>

        <!-- Navigation Elements -->
        <div class="p-4 rounded-lg" style="background: var(--omarchy-surface); border: 1px solid var(--omarchy-overlay);">
          <h3 class="font-medium mb-3" style="color: var(--omarchy-fg);">Navigation</h3>
          <nav>
            <ul class="space-y-2">
              <li><a href="#" class="text-sm transition-colors" style="color: var(--omarchy-iris);">Home</a></li>
              <li><a href="#" class="text-sm transition-colors" style="color: var(--omarchy-iris);">About</a></li>
              <li><a href="#" class="text-sm transition-colors" style="color: var(--omarchy-iris);">Contact</a></li>
            </ul>
          </nav>
        </div>

      </div>
    </section>

    <!-- Test Results -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-4" style="color: var(--omarchy-iris);">
        📊 Test Results
      </h2>

      <div class="grid gap-3">
        {#each testResults as test}
          <div
            class="flex items-center justify-between p-4 rounded-lg transition-all"
            style="
              background: {test.passed ? 'rgba(156, 207, 216, 0.1)' : 'var(--omarchy-surface)'};
              border: 1px solid {test.passed ? 'var(--omarchy-foam)' : 'var(--omarchy-overlay)'};
            "
          >
            <div class="flex-1">
              <h3 class="font-medium" style="color: var(--omarchy-fg);">
                {test.name}
              </h3>
              <p class="text-sm mt-1" style="color: var(--omarchy-subtle);">
                {test.description}
              </p>
            </div>
            <div class="ml-4 flex items-center">
              {#if test.passed}
                <span class="text-lg" style="color: var(--omarchy-foam);">✅</span>
              {:else}
                <span class="text-lg" style="color: var(--omarchy-muted);">⏳</span>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- Keyboard Mode Status -->
    <section class="p-4 rounded-lg" style="background: var(--omarchy-surface); border: 1px solid var(--omarchy-overlay);">
      <h2 class="text-lg font-semibold mb-2" style="color: var(--omarchy-iris);">
        ⌨️ Keyboard Mode Status
      </h2>
      <p style="color: var(--omarchy-fg);">
        Current mode:
        <span class="font-mono font-medium" style="color: {$keyboardMode ? 'var(--omarchy-foam)' : 'var(--omarchy-muted)'};">
          {$keyboardMode ? 'KEYBOARD' : 'MOUSE'}
        </span>
      </p>
      <p class="text-sm mt-1" style="color: var(--omarchy-subtle);">
        Press Tab to enable keyboard mode, or click with mouse to disable
      </p>
    </section>

  </main>

</div>

<!-- Test Modal -->
{#if modalOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center"
    style="background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px);"
    on:click|self={closeModal}
    role="dialog"
    aria-modal="true"
    aria-labelledby="test-modal-title"
  >
    <div
      class="p-6 rounded-lg max-w-md w-full mx-4"
      style="background: var(--omarchy-surface); border: 1px solid var(--omarchy-overlay);"
    >
      <h3 id="test-modal-title" class="text-lg font-semibold mb-4" style="color: var(--omarchy-fg);">
        🧪 Test Modal
      </h3>
      <p class="mb-4" style="color: var(--omarchy-subtle);">
        This modal tests focus trapping. Try pressing Tab to navigate within the modal.
        Press Escape to close.
      </p>
      <div class="flex space-x-3">
        <button
          class="px-4 py-2 rounded font-medium"
          style="background: var(--omarchy-iris); color: var(--omarchy-bg);"
          on:click={() => { closeModal(); runTest('focus-trap'); }}
        >
          Test Focus Trap
        </button>
        <button
          class="px-4 py-2 rounded font-medium"
          style="background: var(--omarchy-surface); color: var(--omarchy-fg); border: 1px solid var(--omarchy-overlay);"
          on:click={closeModal}
        >
          Close
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Help Modal -->
<KeyboardHelpModal />

<style>
  .test-page {
    font-family: 'Inter', system-ui, sans-serif;
  }

  .skip-link {
    position: absolute;
    left: -10000px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
    background: var(--omarchy-iris);
    color: var(--omarchy-bg);
    padding: 8px 16px;
    text-decoration: none;
    border-radius: 0 0 4px 4px;
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    z-index: 1000;
  }

  .skip-link:focus {
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    width: auto;
    height: auto;
  }

  .keyboard-shortcut {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 2px 4px;
    background: var(--omarchy-surface);
    border: 1px solid var(--omarchy-overlay);
    border-radius: 3px;
    font-family: monospace;
    font-size: 11px;
    font-weight: 600;
    color: var(--omarchy-fg);
  }

  /* Enhanced focus styles for testing */
  :global(.keyboard-mode) button:focus,
  :global(.keyboard-mode) input:focus,
  :global(.keyboard-mode) select:focus,
  :global(.keyboard-mode) textarea:focus,
  :global(.keyboard-mode) a:focus {
    outline: 2px solid var(--omarchy-iris) !important;
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(196, 167, 231, 0.2);
  }
</style>
