// Common card frame, dimensions and hover-tilt the host enforces. Everything
// inside the frame is the deck's to style.
import { useRef, type CSSProperties, type MouseEvent, type ReactNode } from 'react';

export function CardFrame({
  children,
  rarity = 'normal',
  glow = false,
  tint,
  onClick,
  style,
}: {
  children: ReactNode;
  rarity?: string;
  glow?: boolean;
  tint?: string;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${px * 12}deg) rotateX(${-py * 12}deg)`;
  }
  function reset() {
    if (ref.current) ref.current.style.transform = '';
  }

  return (
    <div
      ref={ref}
      className={`coach-card rarity-${rarity}${glow ? ' is-glowing' : ''}`}
      style={{
        ...(tint ? ({ ['--card-tint' as string]: tint } as CSSProperties) : {}),
        ...style,
      }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={onClick}
    >
      {rarity === 'foil' && <div className="coach-foil" />}
      <div className="coach-card-inner">{children}</div>
    </div>
  );
}

/** Pro/con stat chip. */
export function Chip({ label, kind = 'neutral' }: { label: string; kind?: 'pro' | 'con' | 'neutral' }) {
  return <span className={`coach-chip chip-${kind}`}>{label}</span>;
}
