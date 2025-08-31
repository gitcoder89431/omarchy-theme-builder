/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace']
			},
			colors: {
				omarchy: {
					bg: 'var(--omarchy-bg)',
					fg: 'var(--omarchy-fg)',
					accent: 'var(--omarchy-accent)',
					muted: 'var(--omarchy-muted)',
					border: 'var(--omarchy-border)'
				}
			},
			animation: {
				'fade-in': 'fadeIn 0.3s ease-in-out',
				'slide-up': 'slideUp 0.3s ease-out',
				'pulse-soft': 'pulseSoft 2s ease-in-out infinite'
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				slideUp: {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				pulseSoft: {
					'0%, 100%': { opacity: '0.8' },
					'50%': { opacity: '1' }
				}
			}
		}
	},
	plugins: []
};
