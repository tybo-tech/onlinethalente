import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-system-health',
  imports: [CommonModule],
  template: `
  <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-indigo-100">
    <div class="flex items-center space-x-3 mb-4">
      <div class="text-2xl">📈</div>
      <h3 class="text-lg font-bold text-gray-900">System Health</h3>
    </div>
    <div class="space-y-2 text-sm text-gray-800">
      <div class="flex justify-between"><span>Uptime</span><span class="font-medium">99.97%</span></div>
      <div class="flex justify-between"><span>API Avg Latency</span><span class="font-medium">180 ms</span></div>
      <div class="flex justify-between"><span>Queue Depth</span><span class="font-medium text-emerald-700">6</span></div>
    </div>
    <div class="mt-4 text-xs text-gray-600">
      Tip: Keep an eye on queue depth; spikes usually mean batch tasks or delayed webhooks.
    </div>
  </div>
  `
})
export class SystemHealthComponent {}
