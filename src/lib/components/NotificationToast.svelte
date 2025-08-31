<script>
  import { notifications, removeNotification } from "../stores/theme.js";
  import { fly } from "svelte/transition";

  function getNotificationIcon(type) {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
      default:
        return "ℹ";
    }
  }

  function getNotificationColor(type) {
    switch (type) {
      case "success":
        return "var(--omarchy-foam)";
      case "error":
        return "var(--omarchy-love)";
      case "warning":
        return "var(--omarchy-gold)";
      case "info":
      default:
        return "var(--omarchy-iris)";
    }
  }

  function handleNotificationClick(id) {
    removeNotification(id);
  }
</script>

<!-- Notifications Container -->
<div class="notifications-container fixed top-16 right-6 z-50 space-y-2">
  {#each $notifications as notification (notification.id)}
    <div
      class="notification-toast flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg cursor-pointer"
      style="
				background: rgba(25, 23, 36, 0.95);
				border: 1px solid var(--omarchy-overlay);
				backdrop-filter: blur(12px);
				box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
			"
      transition:fly={{ x: 300, duration: 300 }}
      on:click={() => handleNotificationClick(notification.id)}
      role="button"
      tabindex="0"
    >
      <!-- Icon -->
      <div
        class="notification-icon w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
        style="background: {getNotificationColor(
          notification.type,
        )}; color: var(--omarchy-bg);"
      >
        {getNotificationIcon(notification.type)}
      </div>

      <!-- Content -->
      <div class="notification-content flex-1">
        <p class="text-sm font-medium" style="color: var(--omarchy-fg);">
          {notification.message}
        </p>
      </div>

      <!-- Close Button -->
      <button
        class="notification-close w-5 h-5 rounded flex items-center justify-center hover:bg-gray-700 transition-colors"
        style="color: var(--omarchy-muted);"
        on:click|stopPropagation={() =>
          handleNotificationClick(notification.id)}
        aria-label="Close notification"
      >
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
          />
        </svg>
      </button>
    </div>
  {/each}
</div>

<style>
  .notification-toast {
    max-width: 320px;
    min-width: 280px;
    animation: slideInRight 0.3s ease-out;
  }

  .notification-toast:hover {
    transform: translateX(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    .notifications-container {
      top: 4rem;
      left: 1rem;
      right: 1rem;
    }

    .notification-toast {
      max-width: none;
      min-width: 0;
    }
  }
</style>
