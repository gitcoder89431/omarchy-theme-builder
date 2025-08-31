<script>
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import {
    currentTheme,
    themePresets,
    iconThemes,
    updateThemeColor,
    updateIconTheme,
    loadThemePreset,
    resetTheme,
    addNotification,
    themeName,
    isExporting,
  } from "../stores/theme.js";
  import { exportTheme, validateTheme } from "../utils/themeExport.js";
  import {
    keyboardMode,
    focusedElement,
    focusManager,
    createKeyboardHandler,
    shortcuts,
  } from "../stores/keyboard.js";

  const dispatch = createEventDispatcher();

  let isExpanded = false;
  let activeColorPicker = null;
  let colorPickerValue = "#191724";
  let controlsRef;
  let currentPresetIndex = 0;
  let focusTrap;

  // Enhanced color configuration with keyboard shortcuts
  const colorKeys = [
    {
      key: "background",
      label: "Background",
      description: "Main desktop background",
      shortcut: "b",
    },
    {
      key: "foreground",
      label: "Foreground",
      description: "Primary text color",
      shortcut: "f",
    },
    {
      key: "surface",
      label: "Surface",
      description: "Window backgrounds",
      shortcut: "s",
    },
    {
      key: "accent",
      label: "Accent",
      description: "Highlight color",
      shortcut: "a",
    },
    {
      key: "love",
      label: "Love",
      description: "Error/critical color",
      shortcut: "l",
    },
    {
      key: "gold",
      label: "Gold",
      description: "Warning color",
      shortcut: "g",
    },
    {
      key: "foam",
      label: "Foam",
      description: "Success color",
      shortcut: "o",
    },
    {
      key: "iris",
      label: "Iris",
      description: "Primary accent",
      shortcut: "i",
    },
    {
      key: "pine",
      label: "Pine",
      description: "Info color",
      shortcut: "p",
    },
    {
      key: "rose",
      label: "Rose",
      description: "Secondary color",
      shortcut: "r",
    },
  ];

  // Preset shortcuts mapping
  const presetKeys = Object.keys(themePresets);
  const presetShortcuts = {
    "1": "rosePine",
    "2": "catppuccin",
    "3": "nord",
    "4": "tokyoNight",
    "5": "everforest",
    "6": "gruvbox",
    "7": "kanagawa",
  };

  // Keyboard handler
  const handleKeyboard = createKeyboardHandler({
    ...shortcuts,
    // Color picker shortcuts
    ...Object.fromEntries(
      colorKeys.map((color) => [
        `COLOR_${color.key.toUpperCase()}`,
        [color.shortcut],
      ]),
    ),
    // Preset shortcuts
    ...Object.fromEntries(
      Object.entries(presetShortcuts).map(([key, preset]) => [
        preset.toUpperCase(),
        [key],
      ]),
    ),
  });

  function toggleExpanded() {
    isExpanded = !isExpanded;

    if (isExpanded) {
      focusManager.saveFocus();
      // Announce to screen readers
      focusManager.announce("Theme controls panel opened");

      // Setup focus management for expanded panel
      setTimeout(() => {
        if (controlsRef) {
          focusManager.focusFirst(controlsRef);
        }
      }, 100);
    } else {
      focusManager.announce("Theme controls panel closed");
      if (activeColorPicker) {
        closeColorPicker();
      }
    }
  }

  function openColorPicker(colorKey, currentColor) {
    activeColorPicker = colorKey;
    colorPickerValue = currentColor;
    focusManager.saveFocus();

    // Setup focus trap for color picker modal
    setTimeout(() => {
      const colorPickerModal = document.querySelector(
        ".color-picker-container .color-picker-modal",
      );
      if (colorPickerModal) {
        focusTrap = focusManager.setupFocusTrap(colorPickerModal);
      }
    }, 50);

    focusManager.announce(
      `Color picker opened for ${colorKeys.find((c) => c.key === colorKey)?.label}`,
    );
  }

  function handleColorChange(event) {
    const newColor = event.target.value;
    colorPickerValue = newColor;
    if (activeColorPicker) {
      updateThemeColor(activeColorPicker, newColor);
      focusManager.announce(
        `${colorKeys.find((c) => c.key === activeColorPicker)?.label} color changed to ${newColor}`,
      );
    }
  }

  function closeColorPicker() {
    if (focusTrap) {
      focusTrap.destroy();
      focusTrap = null;
    }

    const colorName = colorKeys.find((c) => c.key === activeColorPicker)?.label;
    activeColorPicker = null;

    focusManager.restoreFocus();
    focusManager.announce(`Color picker closed for ${colorName}`);
  }

  function handleIconThemeChange(event) {
    const newIconTheme = event.target.value;
    updateIconTheme(newIconTheme);
    focusManager.announce(`Icon theme changed to ${newIconTheme}`);
  }

  function applyPreset(presetKey) {
    const preset = themePresets[presetKey];
    if (preset) {
      loadThemePreset(preset);
      currentPresetIndex = presetKeys.indexOf(presetKey);
      focusManager.announce(`Applied ${preset.name} theme preset`);
    }
  }

  function nextPreset() {
    const nextIndex = (currentPresetIndex + 1) % presetKeys.length;
    applyPreset(presetKeys[nextIndex]);
  }

  function previousPreset() {
    const prevIndex =
      currentPresetIndex === 0 ? presetKeys.length - 1 : currentPresetIndex - 1;
    applyPreset(presetKeys[prevIndex]);
  }

  function handleResetTheme() {
    resetTheme();
    focusManager.announce("Theme reset to default Rose Pine");
  }

  async function handleExportTheme() {
    if (!validateTheme($currentTheme)) {
      addNotification(
        "Invalid theme configuration. Please check all colors.",
        "error",
        4000,
      );
      focusManager.announce("Export failed: Invalid theme configuration");
      return;
    }

    isExporting.set(true);
    addNotification("Preparing theme export...", "info", 2000);
    focusManager.announce("Preparing theme export");

    try {
      await exportTheme($currentTheme, $themeName);
      addNotification(
        `✅ ${$themeName} theme exported successfully!`,
        "success",
        4000,
      );
      focusManager.announce(`${$themeName} theme exported successfully`);
    } catch (error) {
      console.error("Export failed:", error);
      addNotification(
        "❌ Failed to export theme. Please try again.",
        "error",
        4000,
      );
      focusManager.announce("Export failed. Please try again");
    } finally {
      isExporting.set(false);
    }
  }

  // Global keyboard event handler
  function handleGlobalKeydown(event) {
    const result = handleKeyboard(event);
    if (!result) return;

    const { action } = result;

    // Don't handle shortcuts if typing in input field
    if (event.target.tagName === "INPUT" && event.target.type === "text") {
      return;
    }

    event.preventDefault();

    switch (action) {
      case "TOGGLE_THEME_CONTROLS":
        toggleExpanded();
        break;

      case "EXPORT_THEME":
        if (isExpanded && !$isExporting) {
          handleExportTheme();
        }
        break;

      case "RESET_THEME":
        if (isExpanded) {
          handleResetTheme();
        }
        break;

      case "NEXT_PRESET":
        if (isExpanded) {
          nextPreset();
        }
        break;

      case "PREV_PRESET":
        if (isExpanded) {
          previousPreset();
        }
        break;

      case "CLOSE_COLOR_PICKER":
      case "ESCAPE":
        if (activeColorPicker) {
          closeColorPicker();
        } else if (isExpanded) {
          toggleExpanded();
        }
        break;

      // Preset shortcuts
      case "ROSE_PINE":
      case "ROSEPINE":
        applyPreset("rosePine");
        break;
      case "CATPPUCCIN":
        applyPreset("catppuccin");
        break;
      case "NORD":
        applyPreset("nord");
        break;
      case "TOKYO_NIGHT":
      case "TOKYONIGHT":
        applyPreset("tokyoNight");
        break;
      case "EVERFOREST":
        applyPreset("everforest");
        break;
      case "GRUVBOX":
        applyPreset("gruvbox");
        break;
      case "KANAGAWA":
        applyPreset("kanagawa");
        break;

      // Color shortcuts
      default:
        const colorAction = action.replace("COLOR_", "").toLowerCase();
        const colorDef = colorKeys.find((c) => c.key === colorAction);
        if (colorDef && isExpanded) {
          openColorPicker(colorDef.key, $currentTheme.colors[colorDef.key]);
        }
        break;
    }
  }

  // Close color picker when clicking outside
  function handleDocumentClick(event) {
    if (activeColorPicker && !event.target.closest(".color-picker-container")) {
      closeColorPicker();
    }
  }

  // Handle focus events for better keyboard navigation
  function handleFocus(event) {
    if ($keyboardMode) {
      focusedElement.set(event.target);
    }
  }

  onMount(() => {
    // Update current preset index based on current theme
    const currentPresetEntry = Object.entries(themePresets).find(
      ([, preset]) => preset.name === $currentTheme.name,
    );
    if (currentPresetEntry) {
      currentPresetIndex = presetKeys.indexOf(currentPresetEntry[0]);
    }

    // Add global keyboard listeners
    document.addEventListener("keydown", handleGlobalKeydown);
    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("focus", handleFocus, true);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeydown);
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("focus", handleFocus, true);

      if (focusTrap) {
        focusTrap.destroy();
      }
    };
  });

  onDestroy(() => {
    if (focusTrap) {
      focusTrap.destroy();
    }
  });
</script>

<div class="theme-controls fixed bottom-4 right-4 z-50">
  <!-- Main Controls Panel -->
  <div
    bind:this={controlsRef}
    class="controls-panel frosted-panel shadow-2xl border overflow-hidden transition-all duration-300"
    class:expanded={isExpanded}
    role="region"
    aria-label="Theme controls"
    style="
      background: rgba(31, 29, 46, 0.85);
      border-color: rgba(38, 35, 58, 0.5);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05);
      {isExpanded
      ? 'width: 320px; height: 400px;'
      : 'width: 240px; height: 50px;'}
    "
  >
    <!-- Header -->
    <div
      class="controls-header flex items-center justify-between p-3 border-b cursor-pointer"
      style="border-color: rgba(38, 35, 58, 0.3);"
      on:click={toggleExpanded}
      on:keydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleExpanded();
        }
      }}
      role="button"
      tabindex="0"
      aria-expanded={isExpanded}
      aria-label="{isExpanded ? 'Collapse' : 'Expand'} theme controls"
      aria-describedby="theme-controls-description"
    >
      <div class="flex items-center space-x-2">
        <div
          class="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
          style="background: linear-gradient(135deg, var(--omarchy-iris), var(--omarchy-love));"
          aria-hidden="true"
        >
          🎨
        </div>
        <div>
          <h3 class="text-xs font-semibold" style="color: var(--omarchy-fg);">
            Theme Editor
          </h3>
          <div id="theme-controls-description" class="sr-only">
            Press T to toggle, or use arrow keys to navigate presets
          </div>
        </div>
      </div>
      <div
        class="transform transition-transform duration-300"
        class:rotate-180={isExpanded}
        aria-hidden="true"
      >
        <svg
          class="w-5 h-5"
          style="color: var(--omarchy-muted);"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
          />
        </svg>
      </div>
    </div>

    {#if isExpanded}
      <!-- Controls Content -->
      <div
        class="controls-content p-3 h-full overflow-y-auto text-sm"
        role="tabpanel"
        aria-label="Theme customization options"
      >
        <!-- Theme Presets -->
        <div class="section mb-3">
          <h4
            class="text-xs font-bold mb-2 tracking-wide"
            style="color: var(--omarchy-iris);"
            id="presets-heading"
          >
            PRESETS
            <span class="sr-only">(Use number keys 1-7 for quick access)</span>
          </h4>
          <div
            class="grid grid-cols-2 gap-1"
            role="group"
            aria-labelledby="presets-heading"
          >
            {#each Object.entries(themePresets) as [key, preset], index}
              <button
                class="preset-btn px-2 py-1.5 text-xs font-medium text-left transition-all"
                class:active={$currentTheme.name === preset.name}
                style="
                  background: {$currentTheme.name === preset.name
                  ? 'var(--omarchy-iris)'
                  : 'var(--omarchy-highlight-low)'};
                  color: {$currentTheme.name === preset.name
                  ? 'var(--omarchy-bg)'
                  : 'var(--omarchy-fg)'};
                  border: 1px solid {$currentTheme.name === preset.name
                  ? 'var(--omarchy-iris)'
                  : 'var(--omarchy-overlay)'};
                "
                on:click={() => applyPreset(key)}
                on:keydown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    applyPreset(key);
                  }
                }}
                aria-pressed={$currentTheme.name === preset.name}
                aria-label={`Apply ${preset.name} theme preset${index < 7 ? `, shortcut key ${index + 1}` : ""}`}
              >
                {preset.name}
                {#if index < 7}
                  <span class="sr-only">Press {index + 1}</span>
                {/if}
              </button>
            {/each}
          </div>
        </div>

        <!-- Color Customization -->
        <div class="section mb-3">
          <h4
            class="text-xs font-bold mb-2 tracking-wide"
            style="color: var(--omarchy-iris);"
            id="colors-heading"
          >
            COLORS
            <span class="sr-only">(Press Enter to open color picker)</span>
          </h4>
          <div
            class="color-grid grid grid-cols-1 gap-1"
            role="group"
            aria-labelledby="colors-heading"
          >
            {#each colorKeys.slice(0, 8) as colorDef}
              <div class="color-item">
                <button
                  class="color-swatch-btn w-full flex items-center space-x-2 p-2 hover:bg-gray-800 transition-colors"
                  style="hover:background: var(--omarchy-highlight-low);"
                  on:click={() =>
                    openColorPicker(
                      colorDef.key,
                      $currentTheme.colors[colorDef.key],
                    )}
                  on:keydown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openColorPicker(
                        colorDef.key,
                        $currentTheme.colors[colorDef.key],
                      );
                    }
                  }}
                  aria-label={`${colorDef.label} color: ${$currentTheme.colors[colorDef.key]}. ${colorDef.description}. Press ${colorDef.shortcut} or Enter to edit`}
                >
                  <div
                    class="color-swatch w-3 h-3 border"
                    style="background: {$currentTheme.colors[
                      colorDef.key
                    ]}; border-color: var(--omarchy-overlay);"
                    aria-hidden="true"
                  ></div>
                  <div class="text-left flex-1">
                    <div
                      class="text-xs font-medium"
                      style="color: var(--omarchy-fg);"
                    >
                      {colorDef.label}
                    </div>
                  </div>
                  <div
                    class="text-xs font-mono"
                    style="color: var(--omarchy-muted);"
                  >
                    {$currentTheme.colors[colorDef.key]}
                  </div>
                </button>
              </div>
            {/each}
          </div>
        </div>

        <!-- Theme Name Input -->
        <div class="section mb-3">
          <label class="sr-only" for="theme-name-input">Theme name</label>
          <input
            id="theme-name-input"
            type="text"
            class="theme-name-input w-full px-2 py-1.5 border text-xs"
            style="
              background: var(--omarchy-highlight-low);
              color: var(--omarchy-fg);
              border-color: var(--omarchy-overlay);
            "
            bind:value={$themeName}
            placeholder="Theme name..."
            aria-label="Enter theme name for export"
          />
        </div>

        <!-- Actions -->
        <div class="section">
          <button
            class="action-btn w-full px-3 py-2 text-xs font-bold transition-all flex items-center justify-center space-x-2 mb-2"
            style="
              background: {$isExporting
              ? 'var(--omarchy-muted)'
              : 'var(--omarchy-iris)'};
              color: var(--omarchy-bg);
              opacity: {$isExporting ? '0.7' : '1'};
            "
            on:click={handleExportTheme}
            on:keydown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (!$isExporting) handleExportTheme();
              }
            }}
            disabled={$isExporting}
            aria-label="Export theme as ZIP file (shortcut: E)"
          >
            {#if $isExporting}
              <span aria-hidden="true">⏳</span>
              <span>EXPORTING...</span>
            {:else}
              <span aria-hidden="true">📦</span>
              <span>EXPORT THEME</span>
              <span class="sr-only">Press E</span>
            {/if}
          </button>

          <button
            class="reset-btn w-full px-3 py-2 text-xs font-medium transition-all"
            style="
              background: var(--omarchy-highlight-low);
              color: var(--omarchy-subtle);
              border: 1px solid var(--omarchy-overlay);
            "
            on:click={handleResetTheme}
            on:keydown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleResetTheme();
              }
            }}
            aria-label="Reset theme to default Rose Pine (shortcut: R)"
          >
            🔄 RESET THEME
            <span class="sr-only">Press R</span>
          </button>
        </div>
      </div>
    {/if}
  </div>

  <!-- Color Picker Modal -->
  {#if activeColorPicker}
    <div
      class="color-picker-container fixed inset-0 z-60 flex items-center justify-center"
      style="background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px);"
      role="dialog"
      aria-modal="true"
      aria-labelledby="color-picker-title"
    >
      <div
        class="color-picker-modal frosted-panel p-6 border shadow-2xl"
        style="
          background: rgba(31, 29, 46, 0.9);
          border-color: rgba(38, 35, 58, 0.5);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        "
      >
        <h3
          id="color-picker-title"
          class="text-lg font-semibold mb-4"
          style="color: var(--omarchy-fg);"
        >
          Pick {colorKeys.find((c) => c.key === activeColorPicker)?.label} Color
        </h3>

        <div class="space-y-4">
          <div>
            <label class="sr-only" for="color-picker-input">
              Color picker for {colorKeys.find(
                (c) => c.key === activeColorPicker,
              )?.label}
            </label>
            <input
              id="color-picker-input"
              type="color"
              bind:value={colorPickerValue}
              on:input={handleColorChange}
              class="color-input w-full h-20 border-2 cursor-pointer"
              style="border-color: var(--omarchy-overlay);"
              aria-label="Visual color picker"
            />
          </div>

          <div>
            <label class="sr-only" for="color-hex-input">
              Hex color code
            </label>
            <input
              id="color-hex-input"
              type="text"
              bind:value={colorPickerValue}
              on:input={handleColorChange}
              class="color-hex w-full px-3 py-2 border font-mono text-sm"
              style="
                background: var(--omarchy-highlight-low);
                color: var(--omarchy-fg);
                border-color: var(--omarchy-overlay);
              "
              placeholder="#191724"
              aria-label="Hex color code input"
            />
          </div>

          <div class="flex space-x-3">
            <button
              class="btn-primary flex-1 px-4 py-2 font-medium"
              style="
                background: var(--omarchy-iris);
                color: var(--omarchy-bg);
              "
              on:click={closeColorPicker}
              on:keydown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  closeColorPicker();
                }
              }}
            >
              Done
            </button>
            <button
              class="btn-secondary px-4 py-2 font-medium"
              style="
                background: var(--omarchy-highlight-low);
                color: var(--omarchy-fg);
                border: 1px solid var(--omarchy-overlay);
              "
              on:click={closeColorPicker}
              on:keydown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  closeColorPicker();
                }
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .controls-panel {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 12px;
  }

  .frosted-panel {
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.05);
  }

  .controls-content::-webkit-scrollbar {
    width: 4px;
  }

  .controls-content::-webkit-scrollbar-track {
    background: var(--omarchy-surface);
  }

  .controls-content::-webkit-scrollbar-thumb {
    background: var(--omarchy-muted);
    border-radius: 2px;
  }

  .preset-btn {
    border-radius: 6px;
  }

  .preset-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .color-swatch-btn {
    border-radius: 8px;
  }

  .color-swatch-btn:hover .color-swatch {
    transform: scale(1.1);
    border-color: var(--omarchy-iris);
  }

  .color-swatch {
    transition: all 0.2s ease;
    border-radius: 2px;
  }

  .action-btn,
  .reset-btn {
    border-radius: 8px;
  }

  .action-btn:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  .reset-btn:hover {
    background: var(--omarchy-highlight-med) !important;
  }

  .color-input {
    appearance: none;
    -webkit-appearance: none;
    border-radius: 8px;
  }

  .color-input::-webkit-color-swatch-wrapper {
    padding: 0;
    border: none;
    border-radius: 8px;
  }

  .color-input::-webkit-color-swatch {
    border: none;
    border-radius: 6px;
  }

  .theme-name-input {
    border-radius: 6px;
  }

  .theme-name-input:focus {
    outline: none;
    border-color: var(--omarchy-iris);
    box-shadow: 0 0 0 2px rgba(196, 167, 231, 0.2);
  }

  .action-btn:disabled {
    cursor: not-allowed;
    transform: none;
  }

  .action-btn:disabled:hover {
    transform: none;
  }

  .color-picker-modal {
    border-radius: 12px;
  }

  /* Enhanced keyboard focus styles */
  :global(.keyboard-mode) button:focus,
  :global(.keyboard-mode) input:focus,
  :global(.keyboard-mode) [role="button"]:focus {
    outline: 2px solid var(--omarchy-iris);
    outline-offset: 2px;
  }

  :global(.keyboard-mode) .preset-btn:focus {
    box-shadow:
      0 0 0 2px var(--omarchy-iris),
      0 4px 12px rgba(0, 0, 0, 0.15);
  }

  :global(.keyboard-mode) .color-swatch-btn:focus {
    outline: 2px solid var(--omarchy-iris);
    outline-offset: 2px;
    background: var(--omarchy-highlight-low) !important;
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

  @media (max-width: 768px) {
    .theme-controls {
      bottom: 1rem;
      right: 1rem;
      left: 1rem;
    }

    .controls-panel.expanded {
      width: 100% !important;
      height: 520px !important;
    }

    .color-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
