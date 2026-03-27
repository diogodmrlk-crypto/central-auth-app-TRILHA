import React, { useEffect, useRef } from 'react';
import { ChartData } from '@/types';

interface ChartProps {
  data: ChartData;
}

export default function Chart({ data }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth || 340;
    const H = 170;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // Constrói dados dos últimos 7 dias
    const chartData: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      chartData[k] = data[k] || 0;
    }

    const labels = Object.keys(chartData).map((d) => d.slice(5));
    const values = Object.values(chartData);
    const maxV = Math.max(...values, 5);

    const pad = { l: 36, r: 14, t: 14, b: 30 };
    const W2 = W - pad.l - pad.r;
    const H2 = H - pad.t - pad.b;

    // Limpa canvas
    ctx.clearRect(0, 0, W, H);

    // Desenha grid
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = '#e9ecf3';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
      const y = pad.t + (H2 / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(W - pad.r, y);
      ctx.stroke();

      ctx.fillStyle = '#9ca3af';
      ctx.font = '9px DM Sans';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxV - (maxV / 4) * i).toString(), pad.l - 4, y + 4);
    }

    ctx.setLineDash([]);

    // Calcula pontos
    const pts = values.map((v, i) => ({
      x: pad.l + (W2 / (values.length - 1 || 1)) * i,
      y: pad.t + H2 - (v / maxV) * H2,
    }));

    // Desenha área preenchida
    const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + H2);
    grad.addColorStop(0, 'rgba(26,86,232,0.18)');
    grad.addColorStop(1, 'rgba(26,86,232,0)');

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.forEach((p, i) => {
      if (i > 0) ctx.lineTo(p.x, p.y);
    });
    ctx.lineTo(pts[pts.length - 1].x, pad.t + H2);
    ctx.lineTo(pts[0].x, pad.t + H2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Desenha linha
    ctx.beginPath();
    ctx.strokeStyle = '#1a56e8';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();

    // Desenha pontos
    pts.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#1a56e8';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
    });

    // Desenha labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '9px DM Sans';
    ctx.textAlign = 'center';
    labels.forEach((l, i) => ctx.fillText(l, pts[i].x, H - 6));
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-44 bg-white rounded-lg shadow-sm"
    />
  );
}
