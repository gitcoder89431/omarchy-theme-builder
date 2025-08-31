<script>
  import { onMount } from "svelte";
  import { currentTheme } from "../stores/theme.js";
  import { focusManager } from "../stores/keyboard.js";

  let currentTime = "";
  let currentDate = "";

  function updateTime() {
    const now = new Date();
    currentTime = now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    currentDate = now.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  onMount(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  });

  const workspaces = [1, 2, 3, 4, 5];
  let activeWorkspace = 1;

  const quickLaunchApps = [
    { name: "Terminal", icon: "⌨️", active: true },
    { name: "Files", icon: "📁", active: false },
    { name: "Browser", icon: "🌐", active: false },
    { name: "Code", icon: "💻", active: true },
    { name: "Settings", icon: "⚙️", active: false },
  ];

  function switchWorkspace(workspace) {
    activeWorkspace = workspace;
    focusManager.announce(`Switched to workspace ${workspace}`);
  }
</script>

<div
  class="panel-bg fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-2 h-12"
  style="background: rgba(25, 23, 36, 0.95); border-bottom: 1px solid var(--omarchy-overlay); backdrop-filter: blur(12px);"
>
  <!-- Left Section: Workspaces -->
  <div class="flex items-center space-x-3">
    <!-- Logo/Menu -->
    <button
      class="flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm hover:scale-105 transition-transform"
      style="background: linear-gradient(135deg, var(--omarchy-iris), var(--omarchy-love));"
      aria-label="Application menu"
    >
      ○
    </button>

    <!-- Workspaces -->
    <div class="flex items-center space-x-1">
      {#each workspaces as workspace}
        <button
          class="w-8 h-6 rounded text-xs font-medium transition-all duration-200 flex items-center justify-center"
          class:active={workspace === activeWorkspace}
          style="
						background: {workspace === activeWorkspace
            ? 'var(--omarchy-iris)'
            : 'var(--omarchy-surface)'};
						color: {workspace === activeWorkspace
            ? 'var(--omarchy-bg)'
            : 'var(--omarchy-muted)'};
						border: 1px solid {workspace === activeWorkspace
            ? 'var(--omarchy-iris)'
            : 'var(--omarchy-overlay)'};
					"
          on:click={() => switchWorkspace(workspace)}
          on:keydown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              switchWorkspace(workspace);
            }
          }}
          aria-label="Switch to workspace {workspace}"
          aria-pressed={workspace === activeWorkspace}
        >
          {workspace}
        </button>
      {/each}
    </div>

    <!-- Separator -->
    <div
      class="w-px h-6 bg-gray-600"
      style="background: var(--omarchy-overlay);"
    ></div>

    <!-- Quick Launch Apps -->
    <div class="flex items-center space-x-2">
      {#each quickLaunchApps as app}
        <button
          class="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-700 transition-colors relative"
          style="background: {app.active
            ? 'var(--omarchy-highlight-med)'
            : 'transparent'};"
          on:click={() => focusManager.announce(`Launched ${app.name}`)}
          on:keydown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              focusManager.announce(`Launched ${app.name}`);
            }
          }}
          aria-label="Launch {app.name}"
        >
          <span class="text-base">{app.icon}</span>
          {#if app.active}
            <div
              class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
              style="background: var(--omarchy-iris);"
            ></div>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <!-- Center Section: Window Title (when focused) -->
  <div class="flex-1 flex justify-center">
    <span
      class="text-sm font-medium text-gray-400 max-w-md truncate"
      style="color: var(--omarchy-muted);"
    >
      Omarchy Theme Builder
    </span>
  </div>

  <!-- Right Section: System Indicators -->
  <div class="flex items-center space-x-4">
    <!-- System Stats -->
    <div class="flex items-center space-x-3 text-xs">
      <!-- CPU Usage -->
      <div class="flex items-center space-x-1">
        <div class="flex items-center space-x-0.5">
          <div
            class="w-1 h-3 bg-green-400 rounded-sm"
            style="background: var(--omarchy-foam);"
          ></div>
          <div
            class="w-1 h-4 bg-green-400 rounded-sm"
            style="background: var(--omarchy-foam);"
          ></div>
          <div
            class="w-1 h-2 bg-gray-600 rounded-sm"
            style="background: var(--omarchy-muted);"
          ></div>
          <div
            class="w-1 h-1 bg-gray-600 rounded-sm"
            style="background: var(--omarchy-muted);"
          ></div>
        </div>
        <span class="text-gray-400" style="color: var(--omarchy-subtle);"
          >42%</span
        >
      </div>

      <!-- Memory Usage -->
      <div class="flex items-center space-x-1">
        <div
          class="w-6 h-1.5 bg-gray-700 rounded-full overflow-hidden"
          style="background: var(--omarchy-overlay);"
        >
          <div
            class="h-full bg-yellow-400 rounded-full"
            style="width: 65%; background: var(--omarchy-gold);"
          ></div>
        </div>
        <span class="text-gray-400" style="color: var(--omarchy-subtle);"
          >6.2G</span
        >
      </div>
    </div>

    <!-- Separator -->
    <div
      class="w-px h-6 bg-gray-600"
      style="background: var(--omarchy-overlay);"
    ></div>

    <!-- Network -->
    <button
      class="flex items-center space-x-1 text-xs hover:bg-gray-700 px-2 py-1 rounded transition-colors"
      style="color: var(--omarchy-subtle);"
      on:keydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          focusManager.announce("Network settings opened");
        }
      }}
      aria-label="Network status - Connected"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path
          d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"
        />
      </svg>
      <span>WiFi</span>
    </button>

    <!-- Audio -->
    <button
      class="flex items-center space-x-1 text-xs hover:bg-gray-700 px-2 py-1 rounded transition-colors"
      style="color: var(--omarchy-subtle);"
      on:keydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          focusManager.announce("Audio settings opened");
        }
      }}
      aria-label="Audio settings - Volume 85%"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path
          d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"
        />
      </svg>
      <span>75%</span>
    </button>

    <!-- Battery -->
    <button
      class="flex items-center space-x-1 text-xs hover:bg-gray-700 px-2 py-1 rounded transition-colors"
      style="color: var(--omarchy-subtle);"
      on:keydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          focusManager.announce("Power settings opened");
        }
      }}
      aria-label="Battery status - 87% charged"
    >
      <div class="relative w-6 h-3 border border-current rounded-sm">
        <div
          class="absolute right-0 top-1/2 transform -translate-y-1/2 w-0.5 h-1 bg-current rounded-r"
        ></div>
        <div
          class="absolute left-0 top-0 bottom-0 bg-green-400 rounded-l"
          style="width: 85%; background: var(--omarchy-foam);"
        ></div>
      </div>
      <span>85%</span>
    </button>

    <!-- Separator -->
    <div
      class="w-px h-6 bg-gray-600"
      style="background: var(--omarchy-overlay);"
    ></div>

    <!-- Date & Time -->
    <div class="flex flex-col items-end text-xs">
      <span class="font-medium text-gray-200" style="color: var(--omarchy-fg);">
        {currentTime}
      </span>
      <span class="text-gray-400" style="color: var(--omarchy-muted);">
        {currentDate}
      </span>
    </div>

    <!-- User Menu -->
    <button
      class="flex items-center space-x-2 hover:bg-gray-700 px-2 py-1 rounded transition-colors"
      on:keydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          focusManager.announce("User menu opened");
        }
      }}
      aria-label="User menu - omarchy user"
    >
      <div
        class="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold"
        style="background: linear-gradient(135deg, var(--omarchy-iris), var(--omarchy-love));"
      >
        U
      </div>
    </button>
  </div>
</div>
