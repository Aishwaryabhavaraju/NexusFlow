import React, { useEffect, useRef } from 'react';

/**
 * GlowingPipeline — SVG canvas that draws animated glowing lines
 * between three "sensor" nodes and a central "dashboard" hub.
 * Lines pulse when new data arrives (dataTimestamp changes).
 */
export default function GlowingPipeline({ dataTimestamp, wsStatus, activeDevice }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const pulseRef  = useRef(0); // 0–1 pulse intensity

  const isLive = wsStatus === 'connected' || wsStatus === 'disconnected'; // always animate in sim mode

  useEffect(() => {
    // bump pulse on new data
    pulseRef.current = 1;
  }, [dataTimestamp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Node positions (relative to canvas 400×120)
    const nodes = [
      { x: 50,  y: 60, label: 'Temp',      color: '#f97316' },
      { x: 50,  y: 20, label: 'Pressure',  color: '#38bdf8' },
      { x: 50,  y: 100,label: 'Vibration', color: '#a78bfa' },
    ];
    const hub = { x: 350, y: 60, label: 'Engine Hub', color: '#22d3ee' };

    let particleOffset = 0;

    function drawGlowLine(x1, y1, x2, y2, color, pulse) {
      // glow layers
      [12, 6, 2].forEach((blur, i) => {
        ctx.save();
        ctx.shadowBlur  = blur * (1 + pulse);
        ctx.shadowColor = color;
        ctx.strokeStyle = color;
        ctx.globalAlpha = [0.08, 0.15, 0.6 + pulse * 0.4][i];
        ctx.lineWidth   = [4, 2, 1.5][i];
        ctx.beginPath();
        // curve through midpoint
        const mx = (x1 + x2) / 2;
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(mx, y1, mx, y2, x2, y2);
        ctx.stroke();
        ctx.restore();
      });
    }

    function drawParticle(x1, y1, x2, y2, color, t) {
      // t = 0–1 along the bezier
      const mx = (x1 + x2) / 2;
      // evaluate cubic bezier
      const bx = (1-t)**3*x1 + 3*(1-t)**2*t*mx + 3*(1-t)*t**2*mx + t**3*x2;
      const by = (1-t)**3*y1 + 3*(1-t)**2*t*y1  + 3*(1-t)*t**2*y2  + t**3*y2;

      ctx.save();
      ctx.shadowBlur  = 12;
      ctx.shadowColor = color;
      ctx.fillStyle   = color;
      ctx.globalAlpha = Math.sin(t * Math.PI) * 0.9;
      ctx.beginPath();
      ctx.arc(bx, by, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawNode(x, y, color, label, isHub = false) {
      // outer glow ring
      ctx.save();
      ctx.shadowBlur  = 20;
      ctx.shadowColor = color;
      ctx.strokeStyle = color;
      ctx.lineWidth   = 1.5;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.arc(x, y, isHub ? 18 : 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // inner fill
      ctx.save();
      ctx.shadowBlur  = 8;
      ctx.shadowColor = color;
      ctx.fillStyle   = color;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(x, y, isHub ? 10 : 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // label
      ctx.save();
      ctx.fillStyle   = '#94a3b8';
      ctx.font        = '9px Inter, sans-serif';
      ctx.textAlign   = isHub ? 'center' : 'left';
      ctx.globalAlpha = 0.8;
      ctx.fillText(label, isHub ? x : x + 14, y + 3);
      ctx.restore();
    }

    function frame() {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      particleOffset = (particleOffset + 0.008) % 1;
      pulseRef.current = Math.max(0, pulseRef.current - 0.02);
      const pulse = pulseRef.current;

      nodes.forEach(n => {
        drawGlowLine(n.x, n.y, hub.x, hub.y, n.color, pulse);
        // 3 staggered particles per line
        [0, 0.33, 0.66].forEach(offset => {
          drawParticle(n.x, n.y, hub.x, hub.y, n.color, (particleOffset + offset) % 1);
        });
        drawNode(n.x, n.y, n.color, n.label);
      });
      drawNode(hub.x, hub.y, hub.color, hub.label, true);

      animRef.current = requestAnimationFrame(frame);
    }

    frame();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="bg-slate-800/60 border border-slate-700 dark:bg-slate-800/60 light-card rounded-xl p-4 flex flex-col justify-between gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-semibold text-slate-200 dark:text-slate-200 light-text uppercase tracking-wider">
            Telemetry Pipeline
          </h2>
          {activeDevice && (
            <span className="text-[10px] text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/50">
              {activeDevice.tag}
            </span>
          )}
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium
          ${wsStatus === 'connected'
            ? 'border-emerald-700 text-emerald-400 bg-emerald-900/20'
            : 'border-cyan-700 text-cyan-400 bg-cyan-900/20'}`}>
          {wsStatus === 'connected' ? '● WebSocket Live' : '◉ Continuous Stream'}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={115}
        className="w-full"
        style={{ imageRendering: 'crisp-edges' }}
      />
      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-700/40">
        <span>Glow pulses upon each sensor packet reception</span>
        <span className="text-slate-400 font-mono">
          {activeDevice?.location || 'Sector A'}
        </span>
      </div>
    </div>
  );
}
