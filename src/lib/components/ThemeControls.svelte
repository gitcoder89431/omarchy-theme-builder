<script>
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

  let isExpanded = false;
  let activeColorPicker = null;
  let colorPickerValue = "#191724";

  const colorKeys = [
    {
      key: "background",
      label: "Background",
      description: "Main desktop background",
    },
    {
      key: "foreground",
      label: "Foreground",
      description: "Primary text color",
    },
    { key: "surface", label: "Surface", description: "Window backgrounds" },
    { key: "accent", label: "Accent", description: "Highlight color" },
    { key: "love", label: "Love", description: "Error/critical color" },
    { key: "gold", label: "Gold", description: "Warning color" },
    { key: "foam", label: "Foam", description: "Success color" },
    { key: "iris", label: "Iris", description: "Primary accent" },
    { key: "pine", label: "Pine", description: "Info color" },
    { key: "rose", label: "Rose", description: "Secondary color" },
  ];

  function toggleExpanded() {
    isExpanded = !isExpanded;
  }

  function openColorPicker(colorKey, currentColor) {
    activeColorPicker = colorKey;
    colorPickerValue = currentColor;
  }

  function handleColorChange(event) {
    const newColor = event.target.value;
    colorPickerValue = newColor;
    if (activeColorPicker) {
      updateThemeColor(activeColorPicker, newColor);
    }
  }

  function closeColorPicker() {
    activeColorPicker = null;
  }

  function handleIconThemeChange(event) {
    const newIconTheme = event.target.value;
    updateIconTheme(newIconTheme);
  }

  function applyPreset(presetKey) {
    const preset = themePresets[presetKey];
    if (preset) {
      loadThemePreset(preset);
    }
  }

  function handleResetTheme() {
    resetTheme();
  }

  async function handleExportTheme() {
    if (!validateTheme($currentTheme)) {
      addNotification(
        "Invalid theme configuration. Please check all colors.",
        "error",
        4000,
      );
      return;
    }

    isExporting.set(true);
    addNotification("Preparing theme export...", "info", 2000);

    try {
      await exportTheme($currentTheme, $themeName);
      addNotification(
        `✅ ${$themeName} theme exported successfully!`,
        "success",
        4000,
      );
    } catch (error) {
      console.error("Export failed:", error);
      addNotification(
        "❌ Failed to export theme. Please try again.",
        "error",
        4000,
      );
    } finally {
      isExporting.set(false);
    }
  }

  // Close color picker when clicking outside
  function handleDocumentClick(event) {
    if (activeColorPicker && !event.target.closest(".color-picker-container")) {
      closeColorPicker();
    }
  }
</script>

<svelte:document on:click={handleDocumentClick} />

<div class="theme-controls fixed bottom-4 right-4 z-50">
  <!-- Main Controls Panel -->
  <div
    class="controls-panel frosted-panel shadow-2xl border overflow-hidden transition-all duration-300"
    class:expanded={isExpanded}
    style="
			background: rgba(31, 29, 46, 0.85);
			border-color: rgba(38, 35, 58, 0.5);
			backdrop-filter: blur(16px);
			-webkit-backdrop-filter: blur(16px);
			box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05);
			{isExpanded ? 'width: 320px; height: 400px;' : 'width: 240px; height: 50px;'}
		"
  >
    <!-- Header -->
    <div
      class="controls-header flex items-center justify-between p-3 border-b cursor-pointer"
      style="border-color: rgba(38, 35, 58, 0.3);"
      on:click={toggleExpanded}
      role="button"
      tabindex="0"
    >
      <div class="flex items-center space-x-2">
        <div
          class="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
          style="background: linear-gradient(135deg, var(--omarchy-iris), var(--omarchy-love));"
        >
          🎨
        </div>
        <div>
          <h3 class="text-xs font-semibold" style="color: var(--omarchy-fg);">
            Theme Editor
          </h3>
        </div>
      </div>
      <div
        class="transform transition-transform duration-300"
        class:rotate-180={isExpanded}
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
      <div class="controls-content p-3 h-full overflow-y-auto text-sm">
        <!-- Theme Presets -->
        <div class="section mb-3">
          <h4
            class="text-xs font-bold mb-2 tracking-wide"
            style="color: var(--omarchy-iris);"
          >
            PRESETS
          </h4>
          <div class="grid grid-cols-2 gap-1">
            {#each Object.entries(themePresets) as [key, preset]}
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
              >
                {preset.name}
              </button>
            {/each}
          </div>
        </div>

        <!-- Color Customization -->
        <div class="section mb-3">
          <h4
            class="text-xs font-bold mb-2 tracking-wide"
            style="color: var(--omarchy-iris);"
          >
            COLORS
          </h4>
          <div class="color-grid grid grid-cols-1 gap-1">
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
                >
                  <div
                    class="color-swatch w-3 h-3 border"
                    style="background: {$currentTheme.colors[
                      colorDef.key
                    ]}; border-color: var(--omarchy-overlay);"
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
          <input
            type="text"
            class="theme-name-input w-full px-2 py-1.5 border text-xs"
            style="
							background: var(--omarchy-highlight-low);
							color: var(--omarchy-fg);
							border-color: var(--omarchy-overlay);
						"
            bind:value={$themeName}
            placeholder="Theme name..."
          />
        </div>

        <!-- Actions -->
        <div class="section">
          <button
            class="action-btn w-full px-3 py-2 text-xs font-bold transition-all flex items-center justify-center space-x-2"
            style="
							background: {$isExporting ? 'var(--omarchy-muted)' : 'var(--omarchy-iris)'};
							color: var(--omarchy-bg);
							opacity: {$isExporting ? '0.7' : '1'};
						"
            on:click={handleExportTheme}
            disabled={$isExporting}
          >
            {#if $isExporting}
              <span>⏳</span>
              <span>EXPORTING...</span>
            {:else}
              <span>📦</span>
              <span>EXPORT THEME</span>
            {/if}
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
          class="text-lg font-semibold mb-4"
          style="color: var(--omarchy-fg);"
        >
          Pick {colorKeys.find((c) => c.key === activeColorPicker)?.label} Color
        </h3>

        <div class="space-y-4">
          <input
            type="color"
            bind:value={colorPickerValue}
            on:input={handleColorChange}
            class="color-input w-full h-20 border-2 cursor-pointer"
            style="border-color: var(--omarchy-overlay);"
          />

          <input
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
          />

          <div class="flex space-x-3">
            <button
              class="btn-primary flex-1 px-4 py-2 font-medium"
              on:click={closeColorPicker}
            >
              Done
            </button>
            <button
              class="btn-secondary px-4 py-2 font-medium"
              on:click={closeColorPicker}
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

  .preset-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .color-swatch-btn:hover .color-swatch {
    transform: scale(1.1);
    border-color: var(--omarchy-iris);
  }

  .color-swatch {
    transition: all 0.2s ease;
  }

  .action-btn:hover {
    transform: translateY(-1px);
  }

  .color-input {
    appearance: none;
    -webkit-appearance: none;
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
