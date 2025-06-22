'use client';

import { useState, useEffect } from 'react';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

interface StatsChartProps {
  title: string;
  data: ChartData;
  type: 'bar' | 'line' | 'doughnut';
  height?: number;
}

export default function StatsChart({ title, data, type, height = 300 }: StatsChartProps) {
  const [chartId] = useState(`chart-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // This is a simplified chart implementation
    // In a real app, you'd use a library like Chart.js or Recharts
    const canvas = document.getElementById(chartId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Simple bar chart implementation
    if (type === 'bar' && data.datasets.length > 0) {
      const dataset = data.datasets[0];
      const barWidth = (canvas.width - 100) / data.labels.length;
      const maxValue = Math.max(...dataset.data);
      const scale = (canvas.height - 80) / maxValue;

      ctx.fillStyle = dataset.backgroundColor;
      ctx.strokeStyle = dataset.borderColor;
      ctx.lineWidth = dataset.borderWidth;

      data.labels.forEach((label, index) => {
        const value = dataset.data[index];
        const barHeight = value * scale;
        const x = 50 + index * barWidth + barWidth * 0.1;
        const y = canvas.height - 30 - barHeight;

        // Draw bar
        ctx.fillRect(x, y, barWidth * 0.8, barHeight);
        ctx.strokeRect(x, y, barWidth * 0.8, barHeight);

        // Draw label
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label, x + barWidth * 0.4, canvas.height - 10);
        
        // Draw value
        ctx.fillText(value.toString(), x + barWidth * 0.4, y - 5);
      });
    }
  }, [data, type, chartId]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="relative" style={{ height }}>
        <canvas
          id={chartId}
          width={600}
          height={height}
          className="w-full h-full"
        />
      </div>
    </div>
  );
} 