<script>
	import { onMount } from 'svelte';
	import { currentTheme } from '../stores/theme.js';

	let cpuUsage = 45;
	let memoryUsage = 62;
	let diskUsage = 78;
	let networkDown = 125;
	let networkUp = 45;
	let temperature = 58;
	let processes = [
		{ pid: 1847, name: 'Hyprland', cpu: 12.4, memory: 247, user: 'user' },
		{ pid: 2156, name: 'alacritty', cpu: 8.7, memory: 67, user: 'user' },
		{ pid: 2234, name: 'code', cpu: 6.2, memory: 156, user: 'user' },
		{ pid: 2456, name: 'firefox', cpu: 15.8, memory: 892, user: 'user' },
		{ pid: 2789, name: 'waybar', cpu: 2.1, memory: 34, user: 'user' }
	];

	let uptime = { days: 0, hours: 2, minutes: 42 };
	let loadAverage = [1.25, 1.18, 1.03];

	function updateStats() {
		// Simulate realistic system stats changes
		cpuUsage = Math.max(10, Math.min(95, cpuUsage + (Math.random() - 0.5) * 8));
		memoryUsage = Math.max(30, Math.min(90, memoryUsage + (Math.random() - 0.5) * 4));
		diskUsage = Math.max(50, Math.min(95, diskUsage + (Math.random() - 0.5) * 2));

		networkDown = Math.max(0, Math.min(1000, networkDown + (Math.random() - 0.5) * 50));
		networkUp = Math.max(0, Math.min(500, networkUp + (Math.random() - 0.5) * 20));

		temperature = Math.max(35, Math.min(75, temperature + (Math.random() - 0.5) * 3));

		// Update process CPU usage
		processes = processes.map(proc => ({
			...proc,
			cpu: Math.max(0, Math.min(100, proc.cpu + (Math.random() - 0.5) * 4))
		}));

		// Update uptime
		uptime.minutes++;
		if (uptime.minutes >= 60) {
			uptime.minutes = 0;
			uptime.hours++;
			if (uptime.hours >= 24) {
				uptime.hours = 0;
				uptime.days++;
			}
		}
	}

	function getUsageColor(usage) {
		if (usage < 50) return 'var(--omarchy-foam)';
		if (usage < 75) return 'var(--omarchy-gold)';
		return 'var(--omarchy-love)';
	}

	function formatBytes(bytes) {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
	}

	onMount(() => {
		const interval = setInterval(updateStats, 2000);
		return () => clearInterval(interval);
	});
</script>

<div
	class="system-monitor h-full bg-gray-900 text-sm overflow-hidden"
	style="background: var(--omarchy-surface); color: var(--omarchy-fg);"
>
	<!-- Monitor Header -->
	<div
		class="monitor-header flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700"
		style="background: var(--omarchy-highlight-med); border-color: var(--omarchy-overlay);"
	>
		<div class="flex items-center space-x-2">
			<svg class="w-4 h-4 text-green-400" style="color: var(--omarchy-foam);" fill="currentColor" viewBox="0 0 24 24">
				<path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z"/>
			</svg>
			<span class="font-medium">System Monitor</span>
		</div>
		<div class="text-xs text-gray-400" style="color: var(--omarchy-muted);">
			Live • {uptime.days}d {uptime.hours}h {uptime.minutes}m
		</div>
	</div>

	<!-- Monitor Content -->
	<div class="monitor-content p-4 overflow-y-auto h-full">
		<!-- System Overview -->
		<div class="grid grid-cols-2 gap-4 mb-6">
			<!-- CPU Usage -->
			<div class="stat-card p-3 rounded-lg border" style="background: var(--omarchy-highlight-low); border-color: var(--omarchy-overlay);">
				<div class="flex items-center justify-between mb-2">
					<span class="text-xs font-medium text-gray-400" style="color: var(--omarchy-muted);">CPU Usage</span>
					<span class="text-sm font-bold" style="color: {getUsageColor(cpuUsage)};">{cpuUsage.toFixed(1)}%</span>
				</div>
				<div class="w-full bg-gray-700 rounded-full h-2" style="background: var(--omarchy-overlay);">
					<div
						class="h-2 rounded-full transition-all duration-1000"
						style="width: {cpuUsage}%; background: {getUsageColor(cpuUsage)};"
					></div>
				</div>
				<div class="text-xs text-gray-500 mt-1" style="color: var(--omarchy-muted);">
					Load: {loadAverage.map(l => l.toFixed(2)).join(' ')}
				</div>
			</div>

			<!-- Memory Usage -->
			<div class="stat-card p-3 rounded-lg border" style="background: var(--omarchy-highlight-low); border-color: var(--omarchy-overlay);">
				<div class="flex items-center justify-between mb-2">
					<span class="text-xs font-medium text-gray-400" style="color: var(--omarchy-muted);">Memory</span>
					<span class="text-sm font-bold" style="color: {getUsageColor(memoryUsage)};">{memoryUsage.toFixed(1)}%</span>
				</div>
				<div class="w-full bg-gray-700 rounded-full h-2" style="background: var(--omarchy-overlay);">
					<div
						class="h-2 rounded-full transition-all duration-1000"
						style="width: {memoryUsage}%; background: {getUsageColor(memoryUsage)};"
					></div>
				</div>
				<div class="text-xs text-gray-500 mt-1" style="color: var(--omarchy-muted);">
					6.4G / 32.0G
				</div>
			</div>

			<!-- Disk Usage -->
			<div class="stat-card p-3 rounded-lg border" style="background: var(--omarchy-highlight-low); border-color: var(--omarchy-overlay);">
				<div class="flex items-center justify-between mb-2">
					<span class="text-xs font-medium text-gray-400" style="color: var(--omarchy-muted);">Disk (/)</span>
					<span class="text-sm font-bold" style="color: {getUsageColor(diskUsage)};">{diskUsage.toFixed(1)}%</span>
				</div>
				<div class="w-full bg-gray-700 rounded-full h-2" style="background: var(--omarchy-overlay);">
					<div
						class="h-2 rounded-full transition-all duration-1000"
						style="width: {diskUsage}%; background: {getUsageColor(diskUsage)};"
					></div>
				</div>
				<div class="text-xs text-gray-500 mt-1" style="color: var(--omarchy-muted);">
					395G / 512G
				</div>
			</div>

			<!-- Temperature -->
			<div class="stat-card p-3 rounded-lg border" style="background: var(--omarchy-highlight-low); border-color: var(--omarchy-overlay);">
				<div class="flex items-center justify-between mb-2">
					<span class="text-xs font-medium text-gray-400" style="color: var(--omarchy-muted);">Temperature</span>
					<span class="text-sm font-bold" style="color: {getUsageColor(temperature)};">{temperature.toFixed(1)}°C</span>
				</div>
				<div class="w-full bg-gray-700 rounded-full h-2" style="background: var(--omarchy-overlay);">
					<div
						class="h-2 rounded-full transition-all duration-1000"
						style="width: {temperature}%; background: {getUsageColor(temperature)};"
					></div>
				</div>
				<div class="text-xs text-gray-500 mt-1" style="color: var(--omarchy-muted);">
					CPU Package
				</div>
			</div>
		</div>

		<!-- Network Activity -->
		<div class="network-section mb-6">
			<h3 class="text-sm font-medium mb-3 text-gray-300" style="color: var(--omarchy-fg);">Network Activity</h3>
			<div class="grid grid-cols-2 gap-4">
				<div class="stat-card p-3 rounded-lg border" style="background: var(--omarchy-highlight-low); border-color: var(--omarchy-overlay);">
					<div class="flex items-center space-x-2">
						<svg class="w-4 h-4 text-blue-400" style="color: var(--omarchy-pine);" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/>
						</svg>
						<div>
							<div class="text-xs text-gray-400" style="color: var(--omarchy-muted);">Download</div>
							<div class="text-sm font-bold text-blue-400" style="color: var(--omarchy-pine);">{networkDown.toFixed(1)} KB/s</div>
						</div>
					</div>
				</div>
				<div class="stat-card p-3 rounded-lg border" style="background: var(--omarchy-highlight-low); border-color: var(--omarchy-overlay);">
					<div class="flex items-center space-x-2">
						<svg class="w-4 h-4 text-green-400" style="color: var(--omarchy-foam);" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/>
						</svg>
						<div>
							<div class="text-xs text-gray-400" style="color: var(--omarchy-muted);">Upload</div>
							<div class="text-sm font-bold text-green-400" style="color: var(--omarchy-foam);">{networkUp.toFixed(1)} KB/s</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Top Processes -->
		<div class="processes-section">
			<h3 class="text-sm font-medium mb-3 text-gray-300" style="color: var(--omarchy-fg);">Top Processes</h3>
			<div class="processes-table">
				<!-- Table Header -->
				<div class="grid grid-cols-4 gap-2 text-xs font-medium text-gray-400 mb-2 pb-2 border-b border-gray-700" style="color: var(--omarchy-muted); border-color: var(--omarchy-overlay);">
					<span>Process</span>
					<span>PID</span>
					<span>CPU%</span>
					<span>Memory</span>
				</div>

				<!-- Process Rows -->
				{#each processes as process}
					<div class="grid grid-cols-4 gap-2 text-xs py-2 hover:bg-gray-800 rounded transition-colors" style="hover:background: var(--omarchy-highlight-low);">
						<div class="flex items-center space-x-2">
							<div class="w-2 h-2 bg-green-400 rounded-full" style="background: var(--omarchy-foam);"></div>
							<span class="truncate text-gray-300" style="color: var(--omarchy-fg);">{process.name}</span>
						</div>
						<span class="text-gray-400" style="color: var(--omarchy-muted);">{process.pid}</span>
						<span class="font-mono" style="color: {getUsageColor(process.cpu)};">{process.cpu.toFixed(1)}%</span>
						<span class="text-gray-400 font-mono" style="color: var(--omarchy-muted);">{formatBytes(process.memory * 1024 * 1024)}</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- System Info -->
		<div class="system-info mt-6 pt-4 border-t border-gray-700" style="border-color: var(--omarchy-overlay);">
			<h3 class="text-sm font-medium mb-3 text-gray-300" style="color: var(--omarchy-fg);">System Information</h3>
			<div class="grid grid-cols-1 gap-2 text-xs">
				<div class="flex justify-between">
					<span class="text-gray-400" style="color: var(--omarchy-muted);">OS:</span>
					<span class="text-gray-300" style="color: var(--omarchy-fg);">Arch Linux x86_64</span>
				</div>
				<div class="flex justify-between">
					<span class="text-gray-400" style="color: var(--omarchy-muted);">Kernel:</span>
					<span class="text-gray-300" style="color: var(--omarchy-fg);">6.1.0-omarchy</span>
				</div>
				<div class="flex justify-between">
					<span class="text-gray-400" style="color: var(--omarchy-muted);">Desktop:</span>
					<span class="text-gray-300" style="color: var(--omarchy-fg);">Hyprland</span>
				</div>
				<div class="flex justify-between">
					<span class="text-gray-400" style="color: var(--omarchy-muted);">Theme:</span>
					<span class="text-purple-400" style="color: var(--omarchy-iris);">{$currentTheme.name}</span>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.system-monitor {
		font-family: 'Inter', system-ui, sans-serif;
	}

	.monitor-content::-webkit-scrollbar {
		width: 6px;
	}

	.monitor-content::-webkit-scrollbar-track {
		background: var(--omarchy-surface);
	}

	.monitor-content::-webkit-scrollbar-thumb {
		background: var(--omarchy-muted);
		border-radius: 3px;
	}

	.monitor-content::-webkit-scrollbar-thumb:hover {
		background: var(--omarchy-accent);
	}

	.stat-card {
		transition: all 0.3s ease;
	}

	.stat-card:hover {
		background: var(--omarchy-highlight-med) !important;
	}

	.processes-table {
		max-height: 200px;
		overflow-y: auto;
	}

	@media (max-width: 768px) {
		.grid-cols-2 {
			grid-template-columns: 1fr;
		}

		.grid-cols-4 {
			grid-template-columns: 2fr 1fr 1fr 1fr;
		}

		.system-monitor {
			font-size: 0.75rem;
		}
	}
</style>
