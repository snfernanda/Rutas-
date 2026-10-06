import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface RevenueChartProps {
  type: 'line' | 'bar' | 'doughnut';
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ type }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (type === 'line') {
      // 7-day revenue trend in Quetzales
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Lun 29', 'Mar 30', 'Mié 01', 'Jue 02', 'Vie 03', 'Sáb 04', 'Hoy 05'],
          datasets: [
            {
              label: 'Ingresos Totales (Q)',
              data: [3420, 3850, 4120, 4290, 5680, 4890, 4420],
              borderColor: '#1E3A8A',
              backgroundColor: 'rgba(30, 58, 138, 0.15)',
              tension: 0.35,
              fill: true,
              pointBackgroundColor: '#1E3A8A',
              pointRadius: 4
            },
            {
              label: 'Efectivo Recaudado (Q)',
              data: [1520, 1690, 1850, 1920, 2450, 2190, 1980],
              borderColor: '#10B981',
              backgroundColor: 'transparent',
              borderDash: [5, 5],
              tension: 0.35,
              pointBackgroundColor: '#10B981',
              pointRadius: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 12,
                font: { family: 'inherit', size: 11 },
                color: '#475569'
              }
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              grid: { color: 'rgba(226, 232, 240, 0.6)' },
              ticks: {
                color: '#64748b',
                font: { family: 'inherit', size: 10 },
                callback: (value) => `Q${value}`
              }
            },
            x: {
              grid: { display: false },
              ticks: {
                color: '#64748b',
                font: { family: 'inherit', size: 10 }
              }
            }
          }
        }
      });
    } else if (type === 'bar') {
      // Passengers by Route
      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['R-01 CENMA', 'R-02 Mixco', 'R-03 Petapa', 'R-04 Interna'],
          datasets: [
            {
              label: 'Pasajeros Transportados Hoy',
              data: [420, 290, 185, 140],
              backgroundColor: ['#1E3A8A', '#0D9488', '#D97706', '#10B981'],
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(226, 232, 240, 0.6)' },
              ticks: {
                color: '#64748b',
                font: { family: 'inherit', size: 10 }
              }
            },
            x: {
              grid: { display: false },
              ticks: {
                color: '#64748b',
                font: { family: 'inherit', size: 10 }
              }
            }
          }
        }
      });
    } else if (type === 'doughnut') {
      // Payment breakdown
      chartInstanceRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Tarjeta Débito/Crédito', 'Efectivo', 'Transferencia Bancaria'],
          datasets: [
            {
              data: [54, 32, 14],
              backgroundColor: ['#1E3A8A', '#10B981', '#F59E0B'],
              borderWidth: 2,
              borderColor: '#ffffff'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 10,
                font: { family: 'inherit', size: 11 },
                color: '#475569'
              }
            }
          },
          cutout: '65%'
        }
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [type]);

  return (
    <div className="relative h-full w-full">
      <canvas ref={canvasRef} />
    </div>
  );
};
