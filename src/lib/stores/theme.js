import { writable, derived } from "svelte/store";

// Default Rose Pine theme colors (matching actual Omarchy theme structure)
export const defaultTheme = {
  name: "Rose Pine",
  colors: {
    background: "#191724",
    foreground: "#e0def4",
    surface: "#1f1d2e",
    overlay: "#26233a",
    muted: "#6e6a86",
    subtle: "#908caa",
    text: "#e0def4",
    love: "#eb6f92",
    gold: "#f6c177",
    rose: "#ebbcba",
    pine: "#31748f",
    foam: "#9ccfd8",
    iris: "#c4a7e7",
    highlightLow: "#21202e",
    highlightMed: "#403d52",
    highlightHigh: "#524f67",
  },
};

// Create writable stores
export const currentTheme = writable(defaultTheme);
export const notifications = writable([]);
export const themeName = writable("My Theme");
export const isExporting = writable(false);

// Derived store for CSS custom properties
export const cssVariables = derived(currentTheme, ($theme) => {
  return {
    "--omarchy-bg": $theme.colors.background,
    "--omarchy-fg": $theme.colors.foreground,
    "--omarchy-surface": $theme.colors.surface,
    "--omarchy-overlay": $theme.colors.overlay,
    "--omarchy-muted": $theme.colors.muted,
    "--omarchy-subtle": $theme.colors.subtle,
    "--omarchy-text": $theme.colors.text,
    "--omarchy-love": $theme.colors.love,
    "--omarchy-gold": $theme.colors.gold,
    "--omarchy-rose": $theme.colors.rose,
    "--omarchy-pine": $theme.colors.pine,
    "--omarchy-foam": $theme.colors.foam,
    "--omarchy-iris": $theme.colors.iris,
    "--omarchy-highlight-low": $theme.colors.highlightLow,
    "--omarchy-highlight-med": $theme.colors.highlightMed,
    "--omarchy-highlight-high": $theme.colors.highlightHigh,
    "--omarchy-accent": $theme.colors.iris, // Main accent color
    "--omarchy-border": $theme.colors.overlay,
  };
});

// Theme manipulation functions
export function updateThemeColor(colorKey, newColor) {
  currentTheme.update((theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      [colorKey]: newColor,
    },
  }));
}

export function loadThemePreset(preset) {
  currentTheme.set(preset);
}

export function resetTheme() {
  currentTheme.set(defaultTheme);
}

// Notification system
export function addNotification(message, type = "info", duration = 3000) {
  const id = Date.now() + Math.random();
  const notification = { id, message, type, timestamp: Date.now() };

  notifications.update((n) => [...n, notification]);

  if (duration > 0) {
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }

  return id;
}

export function removeNotification(id) {
  notifications.update((n) =>
    n.filter((notification) => notification.id !== id),
  );
}

export function clearNotifications() {
  notifications.set([]);
}

// Icon theme support
export const iconThemes = {
  papirus: "Papirus",
  adwaita: "Adwaita",
  breeze: "Breeze",
  numix: "Numix Circle",
  flatRemix: "Flat Remix",
  tela: "Tela",
};

export const currentIconTheme = writable("papirus");

export function updateIconTheme(iconTheme) {
  currentIconTheme.set(iconTheme);
}

// Accurate Omarchy theme presets (matching actual repository themes)
export const themePresets = {
  rosePine: {
    name: "Rose Pine",
    colors: {
      background: "#191724",
      foreground: "#e0def4",
      surface: "#1f1d2e",
      overlay: "#26233a",
      muted: "#6e6a86",
      subtle: "#908caa",
      text: "#e0def4",
      love: "#eb6f92",
      gold: "#f6c177",
      rose: "#ebbcba",
      pine: "#31748f",
      foam: "#9ccfd8",
      iris: "#c4a7e7",
      highlightLow: "#21202e",
      highlightMed: "#403d52",
      highlightHigh: "#524f67",
    },
  },
  rosePineDawn: {
    name: "Rose Pine Dawn",
    colors: {
      background: "#faf4ed",
      foreground: "#575279",
      surface: "#fffaf3",
      overlay: "#f2e9e1",
      muted: "#9893a5",
      subtle: "#797593",
      text: "#575279",
      love: "#b4637a",
      gold: "#ea9d34",
      rose: "#d7827e",
      pine: "#286983",
      foam: "#56949f",
      iris: "#907aa9",
      highlightLow: "#f4ede8",
      highlightMed: "#dfdad9",
      highlightHigh: "#cecacd",
    },
  },
  catppuccin: {
    name: "Catppuccin Mocha",
    colors: {
      background: "#1e1e2e",
      foreground: "#cdd6f4",
      surface: "#181825",
      overlay: "#313244",
      muted: "#6c7086",
      subtle: "#7f849c",
      text: "#cdd6f4",
      love: "#f38ba8",
      gold: "#f9e2af",
      rose: "#f5c2e7",
      pine: "#74c7ec",
      foam: "#89dceb",
      iris: "#cba6f7",
      highlightLow: "#11111b",
      highlightMed: "#1e1e2e",
      highlightHigh: "#313244",
    },
  },
  catppuccinLatte: {
    name: "Catppuccin Latte",
    colors: {
      background: "#eff1f5",
      foreground: "#4c4f69",
      surface: "#e6e9ef",
      overlay: "#dce0e8",
      muted: "#9ca0b0",
      subtle: "#8c8fa1",
      text: "#4c4f69",
      love: "#d20f39",
      gold: "#df8e1d",
      rose: "#ea76cb",
      pine: "#179299",
      foam: "#04a5e5",
      iris: "#8839ef",
      highlightLow: "#e6e9ef",
      highlightMed: "#dce0e8",
      highlightHigh: "#ccd0da",
    },
  },
  nord: {
    name: "Nord",
    colors: {
      background: "#2e3440",
      foreground: "#d8dee9",
      surface: "#3b4252",
      overlay: "#434c5e",
      muted: "#4c566a",
      subtle: "#616e88",
      text: "#eceff4",
      love: "#bf616a",
      gold: "#ebcb8b",
      rose: "#d08770",
      pine: "#8fbcbb",
      foam: "#88c0d0",
      iris: "#b48ead",
      highlightLow: "#2e3440",
      highlightMed: "#3b4252",
      highlightHigh: "#434c5e",
    },
  },
  tokyoNight: {
    name: "Tokyo Night",
    colors: {
      background: "#1a1b26",
      foreground: "#c0caf5",
      surface: "#24283b",
      overlay: "#414868",
      muted: "#565f89",
      subtle: "#787c99",
      text: "#c0caf5",
      love: "#f7768e",
      gold: "#e0af68",
      rose: "#bb9af7",
      pine: "#2ac3de",
      foam: "#7dcfff",
      iris: "#bb9af7",
      highlightLow: "#1f2335",
      highlightMed: "#292e42",
      highlightHigh: "#3b4261",
    },
  },
  everforest: {
    name: "Everforest",
    colors: {
      background: "#2d353b",
      foreground: "#d3c6aa",
      surface: "#343f44",
      overlay: "#3d484d",
      muted: "#859289",
      subtle: "#9da9a0",
      text: "#d3c6aa",
      love: "#e67e80",
      gold: "#dbbc7f",
      rose: "#d699b6",
      pine: "#83c092",
      foam: "#7fbbb3",
      iris: "#a7c080",
      highlightLow: "#2d353b",
      highlightMed: "#343f44",
      highlightHigh: "#3d484d",
    },
  },
  gruvbox: {
    name: "Gruvbox Dark",
    colors: {
      background: "#282828",
      foreground: "#ebdbb2",
      surface: "#3c3836",
      overlay: "#504945",
      muted: "#665c54",
      subtle: "#7c6f64",
      text: "#ebdbb2",
      love: "#cc241d",
      gold: "#d79921",
      rose: "#b16286",
      pine: "#458588",
      foam: "#689d6a",
      iris: "#d3869b",
      highlightLow: "#32302f",
      highlightMed: "#3c3836",
      highlightHigh: "#504945",
    },
  },
  kanagawa: {
    name: "Kanagawa",
    colors: {
      background: "#1f1f28",
      foreground: "#dcd7ba",
      surface: "#2a2a37",
      overlay: "#363646",
      muted: "#54546d",
      subtle: "#727169",
      text: "#dcd7ba",
      love: "#c34043",
      gold: "#c0a36e",
      rose: "#d27e99",
      pine: "#7e9cd8",
      foam: "#7fb4ca",
      iris: "#957fb8",
      highlightLow: "#223249",
      highlightMed: "#2d4f67",
      highlightHigh: "#49443c",
    },
  },
};

// Apply CSS variables to document root
export function applyCssVariables(variables) {
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }
}

// Auto-apply CSS variables when theme changes
if (typeof window !== "undefined") {
  cssVariables.subscribe((variables) => {
    applyCssVariables(variables);
  });
}
