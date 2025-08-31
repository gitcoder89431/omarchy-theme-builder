# 🎨 Omarchy Theme Builder

An interactive, real-time theme builder for the Omarchy Linux desktop environment. Create beautiful desktop themes with instant visual feedback, just like Realtime Colors but for your entire desktop.

![Omarchy Theme Builder](https://img.shields.io/badge/Omarchy-Theme%20Builder-blueviolet)
![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?logo=svelte&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwind-css&logoColor=white)

## ✨ Features

### 🖥️ High-Fidelity Desktop Simulation
- Realistic Omarchy/Hyprland desktop preview in your browser
- Simulated windows: terminals, code editors, system monitors
- Interactive panels with workspaces, system stats, and notifications
- Live updating UI components that reflect real desktop behavior

### 🎨 Real-Time Theme Editing
- **Instant Visual Feedback**: Changes appear immediately across all components
- **Color Palette Editor**: Customize background, foreground, accent, and semantic colors
- **Icon Theme Selection**: Choose from popular Linux icon themes
- **Preset Themes**: Quick-start with Rose Pine, Tokyo Night, Catppuccin, Nord, and more

### 📦 Complete Theme Export
Generate a ready-to-use theme package containing:
- `hyprland.conf` - Window manager configuration
- `waybar.css` - Status bar styling
- `alacritty.toml` - Terminal colors
- `mako.ini` - Notification daemon
- `neovim.lua` - Editor theme
- `btop.theme` - System monitor colors
- Plus configurations for Walker launcher, SwayOSD, and more!

### 🚀 Modern Tech Stack
- **SvelteKit** - Fast, reactive framework
- **Tailwind CSS** - Utility-first styling
- **JSZip** - Theme export functionality
- **Responsive Design** - Works on desktop and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/omarchy-theme-builder.git
cd omarchy-theme-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to start building themes!

### Building for Production

```bash
npm run build
npm run preview
```

## 🎯 How It Works

1. **Open the Theme Builder** - Load the app in your browser
2. **Customize Colors** - Click the theme controls in the bottom-right corner
3. **See Live Changes** - Watch your desktop simulation update in real-time
4. **Try Presets** - Quickly apply popular themes like Rose Pine or Tokyo Night
5. **Export Theme** - Download a ZIP file with all configuration files
6. **Apply to Omarchy** - Extract and apply the theme to your real desktop

## 🎨 Theme Structure

The exported theme follows Omarchy's standard structure:

```
omarchy-my-theme-theme/
├── hyprland.conf         # Window manager config
├── waybar.css           # Status bar styles
├── alacritty.toml       # Terminal colors
├── mako.ini             # Notifications
├── neovim.lua           # Editor theme
├── btop.theme           # System monitor
├── walker.css           # App launcher
├── swayosd.css          # Volume/brightness OSD
├── hyprlock.conf        # Screen locker
├── icons.theme          # Icon theme name
├── light.mode           # Light mode indicator (if applicable)
├── README.md            # Theme documentation
└── theme.conf           # Main theme configuration
```

## 🛠️ Development

### Project Structure

```
src/
├── lib/
│   ├── components/          # Svelte components
│   │   ├── Desktop.svelte   # Main desktop simulator
│   │   ├── TopPanel.svelte  # System panel
│   │   ├── TerminalWindow.svelte
│   │   ├── CodeEditor.svelte
│   │   ├── SystemMonitor.svelte
│   │   ├── ThemeControls.svelte
│   │   └── NotificationToast.svelte
│   ├── stores/
│   │   └── theme.js         # Theme state management
│   └── utils/
│       └── themeExport.js   # Theme export logic
├── routes/                  # SvelteKit routes
└── app.css                  # Global styles with CSS variables
```

### Key Design Principles

- **Real-time Updates**: All theme changes are applied instantly using Svelte stores
- **CSS Variables**: Dynamic theming through CSS custom properties
- **Component Isolation**: Each desktop component is self-contained and reactive
- **Responsive Design**: Works across different screen sizes
- **Accessibility**: Proper ARIA labels, keyboard navigation, and contrast considerations

## 🎨 Inspiration

This project draws inspiration from:
- [Realtime Colors](https://realtimecolors.com) - For the real-time preview concept
- [Rose Pine](https://rosepinetheme.com) - For color palette design
- Omarchy Desktop - The target Linux environment

## 🤝 Contributing

Contributions are welcome! Please feel free to:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Use conventional commits for clear history
- Add JSDoc comments for complex functions
- Test theme export functionality thoroughly
- Ensure responsive design works on mobile
- Follow existing code style and patterns

## 🐛 Troubleshooting

### Common Issues

**Theme export not working?**
- Ensure your browser supports the File API
- Check that all color values are valid hex codes
- Try refreshing the page and re-applying your changes

**Desktop simulation looks wrong?**
- Clear browser cache and reload
- Ensure CSS custom properties are supported (modern browsers)
- Check browser console for any JavaScript errors

**Performance issues?**
- Reduce animation frequency if needed
- Close other browser tabs to free up memory
- Use Chrome or Firefox for best performance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Omarchy Project** - For the amazing Linux desktop environment
- **Rose Pine Community** - For color palette inspiration  
- **SvelteKit Team** - For the excellent framework
- **All Contributors** - For making this project better

---

**Made with ❤️ for the Omarchy community**

*Want to contribute or report issues? Visit our [GitHub repository](https://github.com/your-username/omarchy-theme-builder)!*