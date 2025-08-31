import { writable, derived, get } from "svelte/store";

// Keyboard navigation state
export const keyboardMode = writable(false);
export const focusedElement = writable(null);
export const helpModalOpen = writable(false);

// Focus trap management for modals
export const focusTrap = writable(null);

// Keyboard shortcuts registry
export const shortcuts = {
  // Global shortcuts
  TOGGLE_THEME_CONTROLS: ["t"],
  TOGGLE_HELP: ["?", "h"],
  ESCAPE: ["Escape"],

  // Theme controls shortcuts
  EXPORT_THEME: ["e"],
  RESET_THEME: ["r"],
  NEXT_PRESET: ["ArrowRight"],
  PREV_PRESET: ["ArrowLeft"],

  // Color picker shortcuts
  OPEN_COLOR_PICKER: ["Enter", " "],
  CLOSE_COLOR_PICKER: ["Escape"],

  // Navigation
  TAB_FORWARD: ["Tab"],
  TAB_BACKWARD: ["Shift+Tab"],

  // Quick preset access
  ROSE_PINE: ["1"],
  CATPPUCCIN: ["2"],
  NORD: ["3"],
  TOKYO_NIGHT: ["4"],
  EVERFOREST: ["5"],
  GRUVBOX: ["6"],
  KANAGAWA: ["7"],
};

// Focusable element selectors
export const FOCUSABLE_SELECTORS = [
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "a[href]",
  '[tabindex]:not([tabindex="-1"])',
  '[role="button"]:not([disabled])',
  '[role="menuitem"]:not([disabled])',
  '[role="tab"]:not([disabled])',
].join(", ");

// Focus management utilities
export class FocusManager {
  constructor() {
    this.previousFocus = null;
    this.keyboardModeEnabled = false;

    // Track keyboard usage
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);

    if (typeof window !== "undefined") {
      document.addEventListener("keydown", this.handleKeyDown);
      document.addEventListener("mousedown", this.handleMouseDown);
    }
  }

  handleKeyDown(event) {
    // Enable keyboard mode on Tab key
    if (event.key === "Tab") {
      this.enableKeyboardMode();
    }
  }

  handleMouseDown() {
    // Disable keyboard mode on mouse interaction
    this.disableKeyboardMode();
  }

  enableKeyboardMode() {
    if (!this.keyboardModeEnabled) {
      this.keyboardModeEnabled = true;
      keyboardMode.set(true);
      document.body.classList.add("keyboard-mode");
    }
  }

  disableKeyboardMode() {
    if (this.keyboardModeEnabled) {
      this.keyboardModeEnabled = false;
      keyboardMode.set(false);
      document.body.classList.remove("keyboard-mode");
    }
  }

  // Get all focusable elements within a container
  getFocusableElements(container = document) {
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS)).filter(
      (el) => this.isVisible(el),
    );
  }

  // Check if element is visible
  isVisible(element) {
    const style = window.getComputedStyle(element);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      element.offsetParent !== null
    );
  }

  // Focus first focusable element in container
  focusFirst(container) {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
      focusedElement.set(focusableElements[0]);
      return true;
    }
    return false;
  }

  // Focus last focusable element in container
  focusLast(container) {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length > 0) {
      const lastElement = focusableElements[focusableElements.length - 1];
      lastElement.focus();
      focusedElement.set(lastElement);
      return true;
    }
    return false;
  }

  // Move focus to next focusable element
  focusNext(currentElement, container = document) {
    const focusableElements = this.getFocusableElements(container);
    const currentIndex = focusableElements.indexOf(currentElement);

    if (currentIndex > -1) {
      const nextIndex = (currentIndex + 1) % focusableElements.length;
      focusableElements[nextIndex].focus();
      focusedElement.set(focusableElements[nextIndex]);
      return true;
    }
    return false;
  }

  // Move focus to previous focusable element
  focusPrevious(currentElement, container = document) {
    const focusableElements = this.getFocusableElements(container);
    const currentIndex = focusableElements.indexOf(currentElement);

    if (currentIndex > -1) {
      const prevIndex =
        currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
      focusableElements[prevIndex].focus();
      focusedElement.set(focusableElements[prevIndex]);
      return true;
    }
    return false;
  }

  // Store current focus and set new focus
  saveFocus() {
    this.previousFocus = document.activeElement;
  }

  // Restore previously focused element
  restoreFocus() {
    if (this.previousFocus && this.isVisible(this.previousFocus)) {
      this.previousFocus.focus();
      focusedElement.set(this.previousFocus);
    }
  }

  // Setup focus trap for modals
  setupFocusTrap(container) {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length === 0) return null;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event) => {
      if (event.key === "Tab") {
        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    // Focus first element
    firstElement.focus();
    focusedElement.set(firstElement);

    const trap = {
      destroy: () => {
        container.removeEventListener("keydown", handleKeyDown);
      },
    };

    focusTrap.set(trap);
    return trap;
  }

  // Remove focus trap
  removeFocusTrap() {
    const currentTrap = get(focusTrap);
    if (currentTrap) {
      currentTrap.destroy();
      focusTrap.set(null);
    }
  }

  // Announce to screen readers
  announce(message) {
    if (typeof window !== "undefined") {
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("aria-atomic", "true");
      announcement.setAttribute("class", "sr-only");
      announcement.textContent = message;

      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }

  destroy() {
    if (typeof window !== "undefined") {
      document.removeEventListener("keydown", this.handleKeyDown);
      document.removeEventListener("mousedown", this.handleMouseDown);
    }
    this.removeFocusTrap();
  }
}

// Global focus manager instance
export const focusManager = new FocusManager();

// Keyboard event handlers
export function createKeyboardHandler(shortcuts) {
  return function handleKeyboard(event) {
    const key = event.key;
    const modifiers = [];

    if (event.ctrlKey) modifiers.push("Ctrl");
    if (event.altKey) modifiers.push("Alt");
    if (event.shiftKey) modifiers.push("Shift");
    if (event.metaKey) modifiers.push("Meta");

    const keyCombo =
      modifiers.length > 0 ? `${modifiers.join("+")}+${key}` : key;

    // Check if any shortcut matches
    for (const [action, keys] of Object.entries(shortcuts)) {
      if (keys.includes(key) || keys.includes(keyCombo)) {
        return { action, event };
      }
    }

    return null;
  };
}

// Utility to check if element is focused
export const isFocused = derived(focusedElement, ($focusedElement) => {
  return (element) => $focusedElement === element;
});

// Skip link utilities for accessibility
export function createSkipLinks() {
  return [
    { href: "#theme-controls", text: "Skip to theme controls" },
    { href: "#desktop-preview", text: "Skip to desktop preview" },
    { href: "#main-content", text: "Skip to main content" },
  ];
}

// ARIA live region utilities
export function createLiveRegion(id, politeness = "polite") {
  if (typeof window === "undefined") return null;

  let region = document.getElementById(id);
  if (!region) {
    region = document.createElement("div");
    region.id = id;
    region.setAttribute("aria-live", politeness);
    region.setAttribute("aria-atomic", "true");
    region.className = "sr-only";
    document.body.appendChild(region);
  }

  return {
    announce: (message) => {
      region.textContent = message;
    },
    destroy: () => {
      if (region.parentNode) {
        region.parentNode.removeChild(region);
      }
    },
  };
}

// Export for cleanup
export function cleanup() {
  focusManager.destroy();
}
