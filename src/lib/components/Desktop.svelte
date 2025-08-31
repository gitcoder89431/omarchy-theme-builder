<script>
  import { onMount } from "svelte";
  import { currentTheme, cssVariables } from "../stores/theme.js";
  import NotificationToast from "./NotificationToast.svelte";
  import ThemeControls from "./ThemeControls.svelte";

  let desktopRef;
  let currentTime = "";

  function updateTime() {
    const now = new Date();
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayName =
      days[now.getDay()].charAt(0).toUpperCase() + days[now.getDay()].slice(1);
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    currentTime = `${dayName} ${hours}:${minutes}`;
  }

  onMount(() => {
    // Apply theme variables
    cssVariables.subscribe((variables) => {
      if (desktopRef) {
        Object.entries(variables).forEach(([key, value]) => {
          desktopRef.style.setProperty(key, value);
        });
      }
    });

    // Update time immediately and then every second
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    // Cleanup interval on component destroy
    return () => {
      clearInterval(timeInterval);
    };
  });
</script>

<div
  bind:this={desktopRef}
  class="desktop-container w-screen h-screen overflow-hidden relative"
  style="font-family: 'JetBrains Mono', monospace;"
>
  <!-- Desktop Background -->
  <div class="desktop-background absolute inset-0">
    <!-- Background gradient -->
    <div
      class="absolute inset-0"
      style="
        background: linear-gradient(135deg, var(--omarchy-bg) 0%, var(--omarchy-surface) 100%);
      "
    ></div>
    <!-- Subtle pattern overlay -->
    <div
      class="absolute inset-0 opacity-5"
      style="background-image: repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px);"
    ></div>
  </div>
  <!-- Top Bar -->
  <div
    class="top-bar h-8 flex items-center justify-between px-4 text-xs border-b frosted-glass relative z-20"
    style="
      background: rgba(31, 29, 46, 0.8);
      border-color: rgba(38, 35, 58, 0.6);
      color: var(--omarchy-fg);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    "
  >
    <!-- Left: Workspaces -->
    <div class="flex items-center space-x-2">
      <div class="flex space-x-1">
        <div
          class="w-6 h-6 flex items-center justify-center text-xs"
          style="background: var(--omarchy-iris); color: var(--omarchy-bg);"
        >
          1
        </div>
        <div
          class="w-6 h-6 flex items-center justify-center text-xs"
          style="background: var(--omarchy-overlay); color: var(--omarchy-subtle);"
        >
          2
        </div>
        <div
          class="w-6 h-6 flex items-center justify-center text-xs"
          style="background: var(--omarchy-overlay); color: var(--omarchy-subtle);"
        >
          3
        </div>
        <div
          class="w-6 h-6 flex items-center justify-center text-xs"
          style="background: var(--omarchy-overlay); color: var(--omarchy-subtle);"
        >
          4
        </div>
        <div
          class="w-6 h-6 flex items-center justify-center text-xs"
          style="background: var(--omarchy-overlay); color: var(--omarchy-subtle);"
        >
          5
        </div>
      </div>
    </div>

    <!-- Center: Date/Time -->
    <div class="font-medium" style="color: var(--omarchy-subtle);">
      {currentTime}
    </div>

    <!-- Right: System Icons -->
    <div
      class="flex items-center space-x-2"
      style="color: var(--omarchy-subtle);"
    >
      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
        <path
          d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L9 7V9H21M12 23C15.31 23 18 20.31 18 17H14L12 19L10 17H6C6 20.31 8.69 23 12 23Z"
        />
      </svg>
      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
        <path
          d="M17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H17V18H20V8L12,13L4,8V18H7V20H4A2,2 0 0,1 2,18V6C2,4.89 2.9,4 4,4H7V6H4V6.5L12,11.5L20,6.5V6H17V4Z"
        />
      </svg>
      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
        <path
          d="M2,17H22V19H2V17M1.15,12.95L4,15.8L12,7.8L20,15.8L22.85,12.95L12,2.1L1.15,12.95Z"
        />
      </svg>
    </div>
  </div>

  <!-- Main Layout -->
  <div
    class="main-layout flex h-full gap-2 p-2 relative z-10"
    style="height: calc(100vh - 2rem);"
  >
    <!-- Left: File Manager -->
    <div
      class="file-manager w-80 frosted-panel"
      style="
        background: rgba(31, 29, 46, 0.85);
        border: 1px solid rgba(38, 35, 58, 0.5);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
      "
    >
      <!-- File Manager Header -->
      <div
        class="header h-8 flex items-center px-3 border-b text-xs"
        style="background: rgba(64, 61, 82, 0.4); border-color: rgba(38, 35, 58, 0.3);"
      >
        <svg
          class="w-3 h-3 mr-2"
          style="color: var(--omarchy-foam);"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"
          />
        </svg>
        <span style="color: var(--omarchy-fg);">~/.local/share/omarchy</span>
      </div>

      <!-- File List -->
      <div class="file-list p-3 text-xs">
        <div
          class="file-item flex items-center space-x-2 py-1"
          style="color: var(--omarchy-fg);"
        >
          <span>📁</span>
          <span>bin</span>
        </div>
        <div
          class="file-item flex items-center space-x-2 py-1"
          style="color: var(--omarchy-fg);"
        >
          <span>📁</span>
          <span>config</span>
        </div>
        <div
          class="file-item flex items-center space-x-2 py-1 px-2"
          style="color: var(--omarchy-fg); background: var(--omarchy-highlight-med);"
        >
          <span>📁</span>
          <span>themes</span>
        </div>
        <div
          class="file-item flex items-center space-x-2 py-1 pl-4"
          style="color: var(--omarchy-subtle);"
        >
          <span>🎨</span>
          <span>catppuccin</span>
        </div>
        <div
          class="file-item flex items-center space-x-2 py-1 pl-4"
          style="color: var(--omarchy-subtle);"
        >
          <span>🎨</span>
          <span>rose-pine</span>
        </div>
        <div
          class="file-item flex items-center space-x-2 py-1 pl-4"
          style="color: var(--omarchy-iris);"
        >
          <span>🎨</span>
          <span>custom-theme</span>
        </div>
        <div
          class="file-item flex items-center space-x-2 py-1"
          style="color: var(--omarchy-fg);"
        >
          <span>📁</span>
          <span>default</span>
        </div>
        <div
          class="file-item flex items-center space-x-2 py-1"
          style="color: var(--omarchy-fg);"
        >
          <span>📄</span>
          <span>README.md</span>
        </div>
      </div>
    </div>

    <!-- Center: Terminal -->
    <div
      class="terminal flex-1 frosted-panel"
      style="
        background: rgba(25, 23, 36, 0.9);
        border: 1px solid rgba(38, 35, 58, 0.5);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
      "
    >
      <!-- Terminal Header -->
      <div
        class="header h-8 flex items-center px-3 border-b text-xs"
        style="background: rgba(64, 61, 82, 0.6); border-color: rgba(38, 35, 58, 0.3);"
      >
        <svg
          class="w-3 h-3 mr-2"
          style="color: var(--omarchy-iris);"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M20,19V7H4V19H20M20,3A2,2 0 0,1 22,5V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V5C2,3.89 2.9,3 4,3H20M13,17V15H18V17H13M9.58,13L5.57,9H8.4L11.7,12.3C12.09,12.69 12.09,13.33 11.7,13.72L8.42,17H5.59L9.58,13Z"
          />
        </svg>
      </div>

      <!-- Terminal Content -->
      <div class="terminal-content p-4 text-xs font-mono">
        <div class="terminal-line mb-1">
          <span style="color: var(--omarchy-iris);">❯</span>
          <span style="color: var(--omarchy-fg);">
            cd ~/.config/omarchy/themes</span
          >
        </div>
        <div class="terminal-line mb-1">
          <span style="color: var(--omarchy-iris);">❯</span>
          <span style="color: var(--omarchy-fg);"> ls -la</span>
        </div>
        <div class="terminal-output mb-2" style="color: var(--omarchy-subtle);">
          <div>drwxr-xr-x 5 user user 4096 Jun 25 21:24 .</div>
          <div>drwxr-xr-x 8 user user 4096 Jun 25 21:20 ..</div>
          <div>drwxr-xr-x 2 user user 4096 Jun 25 21:24 catppuccin</div>
          <div style="color: var(--omarchy-iris);">
            drwxr-xr-x 2 user user 4096 Jun 25 21:24 custom-theme
          </div>
          <div>drwxr-xr-x 2 user user 4096 Jun 25 21:20 rose-pine</div>
        </div>
        <div class="terminal-line mb-1">
          <span style="color: var(--omarchy-iris);">❯</span>
          <span style="color: var(--omarchy-fg);">
            omarchy-theme preview custom-theme</span
          >
        </div>
        <div class="terminal-output mb-2" style="color: var(--omarchy-foam);">
          <div>✓ Loading theme: custom-theme</div>
          <div>✓ Applying colors...</div>
          <div>✓ Theme preview active</div>
        </div>
        <div class="terminal-line">
          <span style="color: var(--omarchy-iris);">❯</span>
          <span class="cursor">_</span>
        </div>
      </div>
    </div>

    <!-- Right: System Monitor -->
    <div
      class="monitor w-96 frosted-panel"
      style="
        background: rgba(31, 29, 46, 0.85);
        border: 1px solid rgba(38, 35, 58, 0.5);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
      "
    >
      <!-- Monitor Header -->
      <div
        class="header h-8 flex items-center px-3 border-b text-xs"
        style="background: rgba(64, 61, 82, 0.4); border-color: rgba(38, 35, 58, 0.3);"
      >
        <svg
          class="w-3 h-3 mr-2"
          style="color: var(--omarchy-gold);"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M11,15L9.5,13.5L11,12L12.5,13.5L11,15M13,19H5V17H13V19Z"
          />
        </svg>
        <span style="color: var(--omarchy-fg);">btop</span>
      </div>

      <!-- Monitor Content -->
      <div class="monitor-content p-3 text-xs font-mono">
        <!-- CPU Section -->
        <div class="section mb-4">
          <div
            class="section-title mb-2 font-bold"
            style="color: var(--omarchy-iris);"
          >
            CPU Usage
          </div>
          <div class="cpu-bars space-y-1">
            <div class="flex items-center space-x-2">
              <span style="color: var(--omarchy-subtle);">C0</span>
              <div
                class="flex-1 h-2 rounded"
                style="background: var(--omarchy-overlay);"
              >
                <div
                  class="h-full rounded"
                  style="width: 45%; background: var(--omarchy-foam);"
                ></div>
              </div>
              <span style="color: var(--omarchy-subtle);">45%</span>
            </div>
            <div class="flex items-center space-x-2">
              <span style="color: var(--omarchy-subtle);">C1</span>
              <div
                class="flex-1 h-2 rounded"
                style="background: var(--omarchy-overlay);"
              >
                <div
                  class="h-full rounded"
                  style="width: 23%; background: var(--omarchy-foam);"
                ></div>
              </div>
              <span style="color: var(--omarchy-subtle);">23%</span>
            </div>
            <div class="flex items-center space-x-2">
              <span style="color: var(--omarchy-subtle);">C2</span>
              <div
                class="flex-1 h-2 rounded"
                style="background: var(--omarchy-overlay);"
              >
                <div
                  class="h-full rounded"
                  style="width: 67%; background: var(--omarchy-gold);"
                ></div>
              </div>
              <span style="color: var(--omarchy-subtle);">67%</span>
            </div>
          </div>
        </div>

        <!-- Memory Section -->
        <div class="section mb-4">
          <div
            class="section-title mb-2 font-bold"
            style="color: var(--omarchy-love);"
          >
            Memory
          </div>
          <div class="flex items-center space-x-2 mb-1">
            <span style="color: var(--omarchy-subtle);">Used:</span>
            <div
              class="flex-1 h-2 rounded"
              style="background: var(--omarchy-overlay);"
            >
              <div
                class="h-full rounded"
                style="width: 68%; background: var(--omarchy-love);"
              ></div>
            </div>
            <span style="color: var(--omarchy-subtle);">6.8G</span>
          </div>
          <div class="text-xs" style="color: var(--omarchy-subtle);">
            Total: 16.0G | Free: 9.2G
          </div>
        </div>

        <!-- Process List -->
        <div class="section">
          <div
            class="section-title mb-2 font-bold"
            style="color: var(--omarchy-pine);"
          >
            Top Processes
          </div>
          <div class="process-list space-y-1 text-xs">
            <div
              class="flex justify-between"
              style="color: var(--omarchy-subtle);"
            >
              <span>hyprland</span>
              <span>12%</span>
            </div>
            <div
              class="flex justify-between"
              style="color: var(--omarchy-subtle);"
            >
              <span>firefox</span>
              <span>8%</span>
            </div>
            <div
              class="flex justify-between"
              style="color: var(--omarchy-iris);"
            >
              <span>theme-builder</span>
              <span>4%</span>
            </div>
            <div
              class="flex justify-between"
              style="color: var(--omarchy-subtle);"
            >
              <span>waybar</span>
              <span>2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Theme Controls -->
  <ThemeControls />

  <!-- Notifications -->
  <NotificationToast />
</div>

<style>
  .desktop-background {
    background: linear-gradient(
      135deg,
      var(--omarchy-bg) 0%,
      var(--omarchy-surface) 100%
    );
  }

  .frosted-glass {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .frosted-panel {
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.05);
  }

  .cursor {
    animation: blink 1s infinite;
    color: var(--omarchy-iris);
  }

  @keyframes blink {
    0%,
    50% {
      opacity: 1;
    }
    51%,
    100% {
      opacity: 0;
    }
  }

  .file-item:hover {
    background: rgba(64, 61, 82, 0.4);
  }

  .terminal-line {
    line-height: 1.4;
  }

  .section-title {
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  @media (max-width: 768px) {
    .main-layout {
      flex-direction: column;
      gap: 8px;
    }

    .file-manager,
    .monitor {
      width: 100%;
      height: 33.33%;
    }

    .terminal {
      height: 33.33%;
    }
  }
</style>
