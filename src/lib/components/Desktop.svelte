<script>
  import { onMount } from "svelte";
  import { currentTheme, cssVariables } from "../stores/theme.js";
  import {
    helpModalOpen,
    focusManager,
    createKeyboardHandler,
    shortcuts,
  } from "../stores/keyboard.js";
  import NotificationToast from "./NotificationToast.svelte";
  import ThemeControls from "./ThemeControls.svelte";
  import KeyboardHelpModal from "./KeyboardHelpModal.svelte";

  let desktopRef;
  let currentTime = "";

  // Fake btop data
  let cpuCores = [
    { name: "C0", usage: 45, temp: 52 },
    { name: "C1", usage: 23, temp: 48 },
    { name: "C2", usage: 67, temp: 55 },
    { name: "C3", usage: 12, temp: 46 },
    { name: "C4", usage: 34, temp: 49 },
    { name: "C5", usage: 78, temp: 58 },
    { name: "C6", usage: 19, temp: 45 },
    { name: "C7", usage: 56, temp: 53 },
  ];

  let memUsage = { used: 6.8, total: 16.0, percent: 68 };
  let swapUsage = { used: 0.2, total: 4.0, percent: 5 };

  let processes = [
    { pid: 1234, user: "root", cpu: 12.3, mem: 4.2, name: "hyprland" },
    { pid: 5678, user: "user", cpu: 8.7, mem: 15.6, name: "firefox" },
    { pid: 9012, user: "user", cpu: 4.1, mem: 2.1, name: "theme-builder" },
    { pid: 3456, user: "user", cpu: 2.8, mem: 1.8, name: "waybar" },
    { pid: 7890, user: "user", cpu: 1.9, mem: 3.4, name: "alacritty" },
    { pid: 2468, user: "root", cpu: 0.8, mem: 0.9, name: "systemd" },
    { pid: 1357, user: "user", cpu: 0.5, mem: 2.7, name: "nvim" },
    { pid: 8642, user: "user", cpu: 0.3, mem: 1.2, name: "btop" },
  ];

  let networkUp = 1247;
  let networkDown = 8492;

  function updateBtopData() {
    // Animate CPU cores
    cpuCores = cpuCores.map((core) => ({
      ...core,
      usage: Math.max(5, Math.min(95, core.usage + (Math.random() - 0.5) * 10)),
      temp: Math.max(40, Math.min(70, core.temp + (Math.random() - 0.5) * 3)),
    }));

    // Animate memory
    memUsage.percent = Math.max(
      50,
      Math.min(85, memUsage.percent + (Math.random() - 0.5) * 5),
    );
    memUsage.used = (memUsage.percent / 100) * memUsage.total;

    // Animate processes
    processes = processes
      .map((proc) => ({
        ...proc,
        cpu: Math.max(0, Math.min(20, proc.cpu + (Math.random() - 0.5) * 2)),
        mem: Math.max(
          0.1,
          Math.min(20, proc.mem + (Math.random() - 0.5) * 0.5),
        ),
      }))
      .sort((a, b) => b.cpu - a.cpu);

    // Animate network
    networkUp += (Math.random() - 0.5) * 200;
    networkDown += (Math.random() - 0.5) * 500;
    networkUp = Math.max(500, Math.min(5000, networkUp));
    networkDown = Math.max(2000, Math.min(15000, networkDown));
  }

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

  // Keyboard handler for global shortcuts
  const handleKeyboard = createKeyboardHandler(shortcuts);

  function handleGlobalKeydown(event) {
    const result = handleKeyboard(event);
    if (!result) return;

    const { action } = result;

    switch (action) {
      case "TOGGLE_HELP":
        event.preventDefault();
        helpModalOpen.update((open) => !open);
        focusManager.announce(
          $helpModalOpen ? "Help modal opened" : "Help modal closed",
        );
        break;
    }
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

    // Add global keyboard listener
    document.addEventListener("keydown", handleGlobalKeydown);

    // Update time immediately and then every second
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    // Update btop data every 500ms for smooth animation
    updateBtopData();
    const btopInterval = setInterval(updateBtopData, 500);

    return () => {
      clearInterval(timeInterval);
      clearInterval(btopInterval);
      document.removeEventListener("keydown", handleGlobalKeydown);
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
    <!-- Left: Waybar-style modules -->
    <div class="flex items-center space-x-4">
      <!-- Workspaces -->
      <div class="flex space-x-1">
        <div
          class="px-2 h-5 flex items-center justify-center text-xs"
          style="background: var(--omarchy-iris); color: var(--omarchy-bg);"
        >
          1
        </div>
        <div
          class="px-2 h-5 flex items-center justify-center text-xs"
          style="background: var(--omarchy-overlay); color: var(--omarchy-subtle);"
        >
          2
        </div>
        <div
          class="px-2 h-5 flex items-center justify-center text-xs"
          style="background: var(--omarchy-overlay); color: var(--omarchy-subtle);"
        >
          3
        </div>
        <div
          class="px-2 h-5 flex items-center justify-center text-xs"
          style="background: var(--omarchy-overlay); color: var(--omarchy-subtle);"
        >
          4
        </div>
        <div
          class="px-2 h-5 flex items-center justify-center text-xs"
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

    <!-- Right: System modules -->
    <div class="flex items-center space-x-3 text-xs">
      <!-- Network -->
      <div class="flex items-center space-x-1">
        <svg
          class="w-3 h-3"
          style="color: var(--omarchy-foam);"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M1,9L23,9V7L1,7V9M1,13L23,13V11L1,11V13M1,17L23,17V15L1,15V17Z"
          />
        </svg>
        <span style="color: var(--omarchy-subtle);">wlan0</span>
      </div>
      <!-- Audio -->
      <div class="flex items-center space-x-1">
        <svg
          class="w-3 h-3"
          style="color: var(--omarchy-gold);"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"
          />
        </svg>
        <span style="color: var(--omarchy-subtle);">85%</span>
      </div>
      <!-- Battery -->
      <div class="flex items-center space-x-1">
        <svg
          class="w-3 h-3"
          style="color: var(--omarchy-pine);"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M16,20H8A2,2 0 0,1 6,18V6A2,2 0 0,1 8,4H11V2H13V4H16A2,2 0 0,1 18,6V18A2,2 0 0,1 16,20M8,6V18H16V6H8M10,16H14V8H10"
          />
        </svg>
        <span style="color: var(--omarchy-subtle);">92%</span>
      </div>
    </div>
  </div>

  <!-- Main Layout -->
  <div
    class="main-layout flex h-full gap-2 p-2 relative z-10"
    style="height: calc(100vh - 2rem);"
  >
    <!-- Left Column: Stacked Panels -->
    <div class="left-column flex flex-col gap-2 flex-1">
      <!-- Top Panel: File Manager (ranger-style) -->
      <div
        class="file-manager flex-1 frosted-panel"
        style="
          background: rgba(25, 23, 36, 0.9);
          border: 1px solid rgba(38, 35, 58, 0.5);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 0;
        "
      >
        <!-- Ranger Header -->
        <div
          class="header h-8 flex items-center px-3 border-b text-xs"
          style="background: rgba(64, 61, 82, 0.6); border-color: rgba(38, 35, 58, 0.3); border-radius: 0;"
        >
          <svg
            class="w-3 h-3 mr-2"
            style="color: var(--omarchy-foam);"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M20,19V7H4V19H20M20,3A2,2 0 0,1 22,5V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V5C2,3.89 2.9,3 4,3H20M13,17V15H18V17H13M9.58,13L5.57,9H8.4L11.7,12.3C12.09,12.69 12.09,13.33 11.7,13.72L8.42,17H5.59L9.58,13Z"
            />
          </svg>
          <span style="color: var(--omarchy-fg);" class="font-mono"
            >ranger ~/.config/omarchy</span
          >
        </div>

        <!-- Ranger Content -->
        <div class="ranger-content p-2 text-xs font-mono">
          <!-- Status line -->
          <div
            class="status-line mb-2 pb-1 border-b"
            style="border-color: var(--omarchy-overlay);"
          >
            <div class="flex justify-between">
              <span style="color: var(--omarchy-subtle);"
                >/home/user/.config/omarchy</span
              >
              <span style="color: var(--omarchy-muted);">12 items</span>
            </div>
          </div>

          <!-- File listing -->
          <div class="file-list space-y-0">
            <div class="flex">
              <span style="color: var(--omarchy-muted);" class="w-8">drwx</span>
              <span style="color: var(--omarchy-subtle);" class="w-12"
                >user</span
              >
              <span style="color: var(--omarchy-muted);" class="w-12">4.0K</span
              >
              <span style="color: var(--omarchy-iris);" class="flex-1">../</span
              >
            </div>
            <div class="flex">
              <span style="color: var(--omarchy-muted);" class="w-8">drwx</span>
              <span style="color: var(--omarchy-subtle);" class="w-12"
                >user</span
              >
              <span style="color: var(--omarchy-muted);" class="w-12">4.0K</span
              >
              <span style="color: var(--omarchy-foam);" class="flex-1"
                >bin/</span
              >
            </div>
            <div class="flex">
              <span style="color: var(--omarchy-muted);" class="w-8">drwx</span>
              <span style="color: var(--omarchy-subtle);" class="w-12"
                >user</span
              >
              <span style="color: var(--omarchy-muted);" class="w-12">4.0K</span
              >
              <span style="color: var(--omarchy-foam);" class="flex-1"
                >config/</span
              >
            </div>
            <div
              class="flex bg-opacity-40"
              style="background: var(--omarchy-highlight-med);"
            >
              <span style="color: var(--omarchy-muted);" class="w-8">drwx</span>
              <span style="color: var(--omarchy-subtle);" class="w-12"
                >user</span
              >
              <span style="color: var(--omarchy-muted);" class="w-12">4.0K</span
              >
              <span style="color: var(--omarchy-fg);" class="flex-1"
                >themes/</span
              >
            </div>
            <div class="flex pl-4">
              <span style="color: var(--omarchy-muted);" class="w-8">drwx</span>
              <span style="color: var(--omarchy-subtle);" class="w-12"
                >user</span
              >
              <span style="color: var(--omarchy-muted);" class="w-12">4.0K</span
              >
              <span style="color: var(--omarchy-subtle);" class="flex-1"
                >catppuccin/</span
              >
            </div>
            <div class="flex pl-4">
              <span style="color: var(--omarchy-muted);" class="w-8">drwx</span>
              <span style="color: var(--omarchy-subtle);" class="w-12"
                >user</span
              >
              <span style="color: var(--omarchy-muted);" class="w-12">4.0K</span
              >
              <span style="color: var(--omarchy-iris);" class="flex-1"
                >custom-theme/</span
              >
            </div>
            <div class="flex pl-4">
              <span style="color: var(--omarchy-muted);" class="w-8">drwx</span>
              <span style="color: var(--omarchy-subtle);" class="w-12"
                >user</span
              >
              <span style="color: var(--omarchy-muted);" class="w-12">4.0K</span
              >
              <span style="color: var(--omarchy-subtle);" class="flex-1"
                >rose-pine/</span
              >
            </div>
            <div class="flex">
              <span style="color: var(--omarchy-muted);" class="w-8">-rw-</span>
              <span style="color: var(--omarchy-subtle);" class="w-12"
                >user</span
              >
              <span style="color: var(--omarchy-muted);" class="w-12">2.1K</span
              >
              <span style="color: var(--omarchy-fg);" class="flex-1"
                >README.md</span
              >
            </div>
          </div>

          <!-- Bottom status -->
          <div
            class="mt-3 pt-2 border-t"
            style="border-color: var(--omarchy-overlay);"
          >
            <div class="flex justify-between text-xs">
              <span style="color: var(--omarchy-muted);">7/12</span>
              <span style="color: var(--omarchy-subtle);">themes/ [dir]</span>
              <span style="color: var(--omarchy-muted);">4.0K</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Panel: Terminal -->
      <div
        class="terminal flex-1 frosted-panel"
        style="
          background: rgba(25, 23, 36, 0.9);
          border: 1px solid rgba(38, 35, 58, 0.5);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 0;
        "
      >
        <!-- Terminal Header -->
        <div
          class="header h-8 flex items-center px-3 border-b text-xs"
          style="background: rgba(64, 61, 82, 0.6); border-color: rgba(38, 35, 58, 0.3); border-radius: 0;"
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
            <span style="color: var(--omarchy-fg);"> neofetch</span>
          </div>

          <!-- Hardware Section -->
          <div class="hardware-section mb-3">
            <div class="border-section">
              <div style="color: var(--omarchy-subtle);">
                ┌──────────────────────Hardware─────────────────────┐
              </div>
              <div style="color: var(--omarchy-fg); margin-left: 1ch;">
                <div>PC: ThinkStation P340</div>
                <div>│ ├: AMD Ryzen 7 5800X (16) @ 4.70 GHz</div>
                <div>│ ├: NVIDIA GeForce RTX 3070 @ 1.73 GHz</div>
                <div>│ ├󱄄: 2560x1440 @ 144 Hz in 27" [External]</div>
                <div>│ ├󰋊: 47.32 GiB / 512.00 GiB (9%) - ext4</div>
                <div>│ ├: 12.8 GiB / 32.0 GiB (40%)</div>
                <div>└ └󰓡 : 2.1 GiB / 8.00 GiB (26%)</div>
              </div>
              <div style="color: var(--omarchy-subtle);">
                └───────────────────────────────────────────────────┘
              </div>
            </div>
          </div>

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
          <div
            class="terminal-output mb-2"
            style="color: var(--omarchy-subtle);"
          >
            <div>drwxr-xr-x 5 user user 4096 Jun 25 21:24 .</div>
            <div>drwxr-xr-x 8 user user 4096 Jun 25 21:20 ..</div>
            <div>drwxr-xr-x 2 user user 4096 Jun 25 21:24 catppuccin</div>
            <div style="color: var(--omarchy-iris);">
              drwxr-xr-x 2 user user 4096 Jun 25 21:24 custom-theme
            </div>
            <div>drwxr-xr-x 2 user user 4096 Jun 25 21:20 rose-pine</div>
          </div>
          <div class="terminal-line">
            <span style="color: var(--omarchy-iris);">❯</span>
            <span class="cursor">_</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column: System Monitor -->
    <div
      class="monitor flex-1 frosted-panel"
      style="
        background: rgba(31, 29, 46, 0.85);
        border: 1px solid rgba(38, 35, 58, 0.5);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-radius: 0;
      "
    >
      <!-- Monitor Header -->
      <div
        class="header h-8 flex items-center px-3 border-b text-xs"
        style="background: rgba(64, 61, 82, 0.4); border-color: rgba(38, 35, 58, 0.3); border-radius: 0;"
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

      <!-- Btop Content -->
      <div class="btop-content p-2 text-xs font-mono overflow-hidden">
        <!-- Header -->
        <div class="btop-header mb-2 flex justify-between items-center">
          <span style="color: var(--omarchy-iris);" class="font-bold"
            >btop++</span
          >
          <span style="color: var(--omarchy-subtle);">v1.2.13</span>
        </div>

        <!-- CPU Section -->
        <div class="cpu-section mb-3">
          <div class="flex justify-between mb-1">
            <span style="color: var(--omarchy-iris);" class="font-bold"
              >CPU</span
            >
            <span style="color: var(--omarchy-subtle);">
              {Math.round(
                cpuCores.reduce((acc, core) => acc + core.usage, 0) /
                  cpuCores.length,
              )}%
            </span>
          </div>
          <div
            class="cpu-grid grid grid-cols-2 gap-x-1 gap-y-0 mb-2 text-xs font-mono"
          >
            {#each cpuCores as core}
              <div class="flex items-center space-x-1">
                <span style="color: var(--omarchy-subtle);" class="w-6"
                  >{core.name}</span
                >
                <span
                  class="flex-1 font-mono text-xs"
                  style="color: {core.usage > 70
                    ? 'var(--omarchy-love)'
                    : 'var(--omarchy-foam)'}; letter-spacing: -0.5px;"
                >
                  {#if core.usage > 87.5}⣿⣿⣿⣿⣿⣿⣿⣿
                  {:else if core.usage > 75}⣿⣿⣿⣿⣿⣿⡇⠀
                  {:else if core.usage > 62.5}⣿⣿⣿⣿⣿⠀⠀⠀
                  {:else if core.usage > 50}⣿⣿⣿⣿⠀⠀⠀⠀
                  {:else if core.usage > 37.5}⣿⣿⣿⠀⠀⠀⠀⠀
                  {:else if core.usage > 25}⣿⣿⠀⠀⠀⠀⠀⠀
                  {:else if core.usage > 12.5}⣿⠀⠀⠀⠀⠀⠀⠀
                  {:else}⡀⠀⠀⠀⠀⠀⠀⠀
                  {/if}
                </span>
                <span
                  style="color: var(--omarchy-muted);"
                  class="text-xs w-8 text-right"
                >
                  {Math.round(core.usage)}%
                </span>
              </div>
            {/each}
          </div>
          <div class="temp-info text-xs" style="color: var(--omarchy-subtle);">
            Temp: {Math.round(
              cpuCores.reduce((acc, core) => acc + core.temp, 0) /
                cpuCores.length,
            )}°C
          </div>
        </div>

        <!-- Software Section -->
        <div class="software-section mb-3">
          <div class="border-section">
            <div style="color: var(--omarchy-subtle);">
              ┌──────────────────────Software─────────────────────┐
            </div>
            <div style="color: var(--omarchy-fg); margin-left: 1ch;">
              <div>󰣇 OS: Arch Linux x86_64</div>
              <div>│ ├: Linux 6.16.1-arch1-1</div>
              <div>│ ├󰏖: 858 (pacman)</div>
              <div>└ └: bash 5.3.3</div>
            </div>
            <div style="color: var(--omarchy-subtle);">
              └───────────────────────────────────────────────────┘
            </div>
          </div>
        </div>

        <!-- Memory Section -->
        <div class="memory-section mb-3">
          <div class="flex justify-between mb-1">
            <span style="color: var(--omarchy-love);" class="font-bold"
              >Memory</span
            >
            <span style="color: var(--omarchy-subtle);">
              {memUsage.used.toFixed(1)}G / {memUsage.total}G
            </span>
          </div>
          <div class="flex items-center space-x-2 mb-1">
            <span
              class="flex-1 font-mono text-xs"
              style="color: {memUsage.percent > 80
                ? 'var(--omarchy-love)'
                : 'var(--omarchy-foam)'}; letter-spacing: -0.5px;"
            >
              {#if memUsage.percent > 93.75}⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
              {:else if memUsage.percent > 87.5}⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀
              {:else if memUsage.percent > 81.25}⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀
              {:else if memUsage.percent > 75}⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀
              {:else if memUsage.percent > 68.75}⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀
              {:else if memUsage.percent > 62.5}⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀
              {:else if memUsage.percent > 56.25}⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀
              {:else if memUsage.percent > 50}⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀
              {:else if memUsage.percent > 43.75}⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀
              {:else if memUsage.percent > 37.5}⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
              {:else if memUsage.percent > 31.25}⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
              {:else if memUsage.percent > 25}⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
              {:else if memUsage.percent > 18.75}⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
              {:else if memUsage.percent > 12.5}⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
              {:else if memUsage.percent > 6.25}⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
              {:else}⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
              {/if}
            </span>
            <span style="color: var(--omarchy-subtle);" class="text-xs">
              {memUsage.percent}%
            </span>
          </div>
          <div class="swap-info">
            <div class="flex justify-between text-xs">
              <span style="color: var(--omarchy-subtle);">Swap</span>
              <span style="color: var(--omarchy-subtle);"
                >{swapUsage.used}G / {swapUsage.total}G</span
              >
            </div>
            <div class="flex items-center space-x-2">
              <span
                class="flex-1 font-mono text-xs"
                style="color: {swapUsage.percent > 50
                  ? 'var(--omarchy-love)'
                  : 'var(--omarchy-gold)'}; letter-spacing: -0.5px;"
              >
                {#if swapUsage.percent > 87.5}⣿⣿⣿⣿⣿⣿⣿⣿
                {:else if swapUsage.percent > 75}⣿⣿⣿⣿⣿⣿⡇⠀
                {:else if swapUsage.percent > 62.5}⣿⣿⣿⣿⣿⠀⠀⠀
                {:else if swapUsage.percent > 50}⣿⣿⣿⣿⠀⠀⠀⠀
                {:else if swapUsage.percent > 37.5}⣿⣿⣿⠀⠀⠀⠀⠀
                {:else if swapUsage.percent > 25}⣿⣿⠀⠀⠀⠀⠀⠀
                {:else if swapUsage.percent > 12.5}⣿⠀⠀⠀⠀⠀⠀⠀
                {:else}⡀⠀⠀⠀⠀⠀⠀⠀
                {/if}
              </span>
              <span style="color: var(--omarchy-subtle);" class="text-xs w-6">
                {swapUsage.percent}%
              </span>
            </div>
          </div>
        </div>

        <!-- Uptime Section -->
        <div class="uptime-section mb-3">
          <div class="border-section">
            <div style="color: var(--omarchy-subtle);">
              ┌────────────────────Uptime / Age───────────────────┐
            </div>
            <div style="color: var(--omarchy-fg); margin-left: 1ch;">
              <div>OS Age : 9 days</div>
              <div>Uptime : 3 mins</div>
            </div>
            <div style="color: var(--omarchy-subtle);">
              └───────────────────────────────────────────────────┘
            </div>
          </div>
        </div>

        <!-- Processes Section -->
        <div class="processes-section">
          <div class="flex justify-between mb-1">
            <span style="color: var(--omarchy-gold);" class="font-bold"
              >Processes</span
            >
            <span style="color: var(--omarchy-subtle);" class="text-xs"
              >{processes.length}</span
            >
          </div>
          <div
            class="process-header flex text-xs mb-1 pb-1 border-b"
            style="border-color: var(--omarchy-overlay);"
          >
            <span style="color: var(--omarchy-muted);" class="w-12">PID</span>
            <span style="color: var(--omarchy-muted);" class="w-12">User</span>
            <span style="color: var(--omarchy-muted);" class="w-12">CPU%</span>
            <span style="color: var(--omarchy-muted);" class="w-12">MEM%</span>
            <span style="color: var(--omarchy-muted);" class="flex-1"
              >Command</span
            >
          </div>
          <div class="process-list space-y-0 text-xs">
            {#each processes.slice(0, 6) as proc}
              <div
                class="flex items-center hover:bg-opacity-20"
                style="background: rgba(64, 61, 82, 0.2);"
              >
                <span style="color: var(--omarchy-subtle);" class="w-12"
                  >{proc.pid}</span
                >
                <span style="color: var(--omarchy-muted);" class="w-12"
                  >{proc.user}</span
                >
                <span
                  style="color: {proc.cpu > 10
                    ? 'var(--omarchy-love)'
                    : proc.cpu > 5
                      ? 'var(--omarchy-gold)'
                      : 'var(--omarchy-foam)'};"
                  class="w-12"
                >
                  {proc.cpu.toFixed(1)}
                </span>
                <span
                  style="color: {proc.mem > 10
                    ? 'var(--omarchy-love)'
                    : 'var(--omarchy-subtle)'};"
                  class="w-12"
                >
                  {proc.mem.toFixed(1)}
                </span>
                <span style="color: var(--omarchy-fg);" class="flex-1 truncate"
                  >{proc.name}</span
                >
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Theme Controls -->
  <div id="theme-controls">
    <ThemeControls />
  </div>

  <!-- Keyboard Help Modal -->
  <KeyboardHelpModal />

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
    border-radius: 0;
  }

  .left-column {
    min-height: 0; /* Allow flex children to shrink */
  }

  .left-column .file-manager,
  .left-column .terminal {
    min-height: 45%; /* Ensure minimum height for each panel */
    max-height: 55%; /* Prevent one panel from dominating */
  }

  .cursor {
    animation: blink 1s infinite;
    color: var(--omarchy-iris);
  }

  .btop-content {
    font-size: 10px;
    line-height: 1.2;
  }

  .cpu-grid {
    font-size: 9px;
  }

  .process-list {
    font-size: 9px;
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

    .left-column {
      width: 100%;
      flex-direction: row;
      height: 50%;
    }

    .left-column .file-manager,
    .left-column .terminal {
      flex: 1;
      height: 100%;
    }

    .monitor {
      width: 100%;
      height: 50%;
    }
  }
</style>
