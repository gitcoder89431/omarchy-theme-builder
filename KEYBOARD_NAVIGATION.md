# 🎯 Keyboard Navigation Guide

Complete keyboard accessibility implementation for the Omarchy Theme Builder.

## 📋 Overview

The Omarchy Theme Builder features comprehensive keyboard navigation support, making it fully accessible to users who prefer or require keyboard interaction. This implementation follows WCAG 2.1 AA guidelines and provides an intuitive, efficient navigation experience.

## 🚀 Quick Start

1. **Enable Keyboard Mode**: Press `Tab` to automatically enable keyboard navigation mode
2. **Open Help**: Press `?` or `H` to view all available keyboard shortcuts
3. **Navigate**: Use `Tab` and `Shift+Tab` to move between focusable elements
4. **Activate**: Press `Enter` or `Space` to activate buttons and controls

## ⌨️ Global Keyboard Shortcuts

### Navigation
| Key Combination | Action |
|----------------|---------|
| `Tab` | Move to next focusable element |
| `Shift + Tab` | Move to previous focusable element |
| `Enter` | Activate focused element |
| `Space` | Activate button or toggle |
| `Escape` | Close modal/dialog or collapse panel |

### Theme Controls
| Key | Action |
|-----|---------|
| `T` | Toggle theme controls panel |
| `E` | Export current theme |
| `R` | Reset theme to default |
| `→` / `←` | Navigate between theme presets |

### Quick Theme Access
| Key | Theme |
|-----|-------|
| `1` | Rose Pine |
| `2` | Catppuccin |
| `3` | Nord |
| `4` | Tokyo Night |
| `5` | Everforest |
| `6` | Gruvbox |
| `7` | Kanagawa |

### Help & Information
| Key | Action |
|-----|---------|
| `?` or `H` | Toggle keyboard shortcuts help modal |

## 🎨 Theme Controls Navigation

### Panel Controls
- **Toggle Panel**: Press `T` or click the theme controls button
- **Navigate Within Panel**: Use `Tab` to move between controls
- **Close Panel**: Press `Escape` or click outside

### Color Customization
- **Open Color Picker**: Press `Enter` or `Space` on any color swatch
- **Navigate Colors**: Use `Tab` to move between color options
- **Quick Color Access**: Press the letter shortcut for each color:
  - `B` - Background
  - `F` - Foreground
  - `S` - Surface
  - `A` - Accent
  - `L` - Love (Error)
  - `G` - Gold (Warning)
  - `O` - Foam (Success)
  - `I` - Iris (Primary)
  - `P` - Pine (Info)
  - `R` - Rose (Secondary)

### Color Picker Modal
- **Navigate**: `Tab` between color picker and hex input
- **Confirm**: `Enter` on "Done" button
- **Cancel**: `Escape` or `Enter` on "Cancel" button
- **Focus Trap**: Focus stays within the modal while open

### Theme Presets
- **Navigate Presets**: Use `Tab` to move between preset buttons
- **Apply Preset**: Press `Enter` or `Space` on focused preset
- **Quick Access**: Use number keys `1-7` for instant preset application
- **Navigate with Arrows**: Use `←` and `→` to cycle through presets

## 🖥️ Desktop Simulation Navigation

### Top Panel
- **Application Menu**: `Tab` to focus, `Enter` to activate
- **Workspaces**: `Tab` to navigate, `Enter` to switch
- **Quick Launch**: `Tab` through app icons, `Enter` to launch
- **System Indicators**: `Tab` to focus, `Enter` for settings

### Window Management
- **Navigate Windows**: Use `Tab` to move focus between simulated windows
- **Window Controls**: Access minimize, maximize, close with `Tab` + `Enter`

## 🔧 Accessibility Features

### Focus Management
- **Visual Focus Indicators**: Clear outlines show focused elements
- **Focus Trapping**: Modals trap focus within their boundaries
- **Focus Restoration**: Focus returns to trigger element when modals close
- **Skip Links**: Quick navigation to main content areas

### Screen Reader Support
- **ARIA Labels**: Comprehensive labeling for all interactive elements
- **Live Regions**: Announces status changes and notifications
- **Semantic Markup**: Proper heading structure and landmarks
- **Alt Text**: Descriptive text for all visual elements

### High Contrast Support
- **Enhanced Focus**: Stronger outlines in high contrast mode
- **Color Independence**: Navigation works without color perception
- **Reduced Motion**: Respects user's motion preferences

## 🎯 Testing Your Navigation

Visit `/keyboard-test` to access the comprehensive keyboard navigation test suite:

1. **Automated Testing**: Interactions automatically mark tests as passed
2. **Progress Tracking**: Visual progress bar shows completion status
3. **Test Categories**:
   - Tab navigation
   - Focus trapping
   - Keyboard shortcuts
   - Modal interactions
   - Skip links functionality

### Test Instructions
1. Navigate to the test page
2. Press `Tab` to enable keyboard mode
3. Use various keyboard shortcuts and navigation
4. Watch tests automatically pass as you interact
5. Check the results section for completion status

## 🛠️ Implementation Details

### Architecture
```
src/lib/stores/keyboard.js     # Keyboard navigation state management
src/lib/components/
├── KeyboardHelpModal.svelte   # Help modal with shortcuts
├── ThemeControls.svelte       # Enhanced with keyboard support
├── TopPanel.svelte            # Keyboard-accessible system panel
└── Desktop.svelte             # Main container with global handlers
```

### Key Features
- **Focus Manager**: Centralized focus state management
- **Keyboard Handler**: Unified shortcut processing
- **Focus Trapping**: Modal focus containment
- **Announcement System**: Screen reader notifications
- **Mode Detection**: Automatic keyboard/mouse mode switching

### Browser Compatibility
- **Modern Browsers**: Full support in Chrome, Firefox, Safari, Edge
- **Focus-Visible**: Polyfill included for older browsers
- **Screen Readers**: Tested with NVDA, JAWS, VoiceOver

## 🎨 Customization

### Styling
Focus indicators and keyboard navigation styles are defined in `src/app.css`:
- `.keyboard-mode` class applied when keyboard navigation is active
- Focus styles use CSS custom properties for theming
- High contrast mode support included

### Adding New Shortcuts
1. Add shortcut definition to `shortcuts` object in `keyboard.js`
2. Handle the shortcut in relevant component's keyboard handler
3. Update help modal with new shortcut documentation
4. Add appropriate ARIA labels and descriptions

### Custom Focus Behavior
Use the `FocusManager` class to implement custom focus behavior:
```javascript
import { focusManager } from '$lib/stores/keyboard.js';

// Focus first element in container
focusManager.focusFirst(containerElement);

// Set up focus trap for modal
const trap = focusManager.setupFocusTrap(modalElement);
```

## 🐛 Troubleshooting

### Common Issues
1. **Focus Not Visible**: Ensure `keyboard-mode` class is applied to body
2. **Shortcuts Not Working**: Check for input field focus preventing shortcuts
3. **Focus Trap Issues**: Verify modal has focusable elements
4. **Screen Reader Problems**: Check ARIA labels and live regions

### Debug Mode
Add `?debug=keyboard` to URL for enhanced keyboard navigation logging.

## 🤝 Contributing

When adding new interactive elements:
1. Ensure proper `tabindex` values
2. Add appropriate ARIA labels and descriptions
3. Include keyboard event handlers for `Enter` and `Space`
4. Test with screen readers
5. Update keyboard shortcuts help modal if adding new shortcuts

### Testing Checklist
- [ ] Tab navigation works in logical order
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are clearly visible
- [ ] Screen reader announces changes properly
- [ ] Shortcuts work as expected
- [ ] Focus trapping works in modals
- [ ] High contrast mode supported

## 📚 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Keyboard Navigation Best Practices](https://webaim.org/techniques/keyboard/)
- [Focus Management](https://developers.google.com/web/fundamentals/accessibility/focus)

## 📝 Changelog

### v1.0.0 - Initial Implementation
- Complete keyboard navigation system
- Focus management and trapping
- Keyboard shortcuts for all major functions
- Screen reader support with ARIA labels
- High contrast and reduced motion support
- Comprehensive test suite

---

**Made accessible with ❤️ for the Omarchy community**

*For issues or suggestions, please visit our [GitHub repository](https://github.com/your-username/omarchy-theme-builder)!*