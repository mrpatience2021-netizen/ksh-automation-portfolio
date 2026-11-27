'use client';

import React from 'react';

export const WIRE_ON = '#004ac6';
export const WIRE_OFF = '#94a3b8';
export const HL_FILL = '#dbe1ff';
export const HL_STROKE = '#004ac6';

export type TagTheme = 'blue' | 'red' | 'amber' | 'green' | 'purple' | 'slate';

export interface SimState {
  X: Record<'X00' | 'X01' | 'X02' | 'X03', boolean>;
  prevX: Record<'X00' | 'X01' | 'X02' | 'X03', boolean>;
  Y: Record<'Y20' | 'Y21' | 'Y22' | 'Y23', boolean>;
  M: Record<'M0' | 'M1' | 'M2', boolean>;
  T: Record<'T0' | 'T1', { acc: number; preset: number; done: boolean; coil: boolean }>;
  C: Record<'C0', { acc: number; preset: number; done: boolean }>;
  D: Record<'D0' | 'D1' | 'D2' | 'D3', number>;
  SM400: boolean;
  SM402: boolean;
  SM412: boolean;
  prevSM412: boolean;
  clockTick: number;
  fl: Record<'sm402' | 'p1' | 'p2' | 'p3' | 'p4', number>;
  shiftPulse: { block: 'X00' | 'X01' | null; branch: number | null; ticks: number };
}

export interface MotorInfo {
  mode: 'cw' | 'ccw' | 'stop';
  speed?: string;
  badge: string;
  freq: string;
  desc: string;
}

export interface CircuitInputDef {
  dev: 'X00' | 'X01' | 'X02' | 'X03';
  label: string;
  color: 'blue' | 'emerald' | 'rose' | 'amber' | 'purple';
}

export interface CircuitOutputDef {
  dev: 'Y20' | 'Y21' | 'Y22' | 'Y23' | 'M0' | 'M1' | 'M2';
  label: string;
  color: 'blue' | 'emerald' | 'rose' | 'amber' | 'purple';
}

export interface CircuitDef {
  id: number;
  category: string;
  title: string;
  initData?: Partial<SimState['D']>;
  sliders?: { dev: 'D0' | 'D1' | 'D2' | 'D3'; label: string; min: number; max: number }[];
  inputs: CircuitInputDef[];
  outputs: CircuitOutputDef[];
  hasMotor?: boolean;
  getMotor?: (s: SimState) => MotorInfo;
  scan: (s: SimState) => void;
  renderLadder: (s: SimState) => React.ReactNode;
  note: {
    principle: string;
    analogy: string;
    shortcuts: string[];
    field: string;
    test: string[];
  };
}

export function LadderRails({ height }: { height: number }) {
  return (
    <g>
      <line x1="36" y1="16" x2="36" y2={height - 16} stroke="#213145" strokeWidth="3.5" />
      <line x1="784" y1="16" x2="784" y2={height - 16} stroke="#213145" strokeWidth="3.5" />
      <text x="36" y="11" textAnchor="middle" fontSize="10" fontWeight="700" fill="#575e6e">
        L
      </text>
      <text x="784" y="11" textAnchor="middle" fontSize="10" fontWeight="700" fill="#575e6e">
        N
      </text>
    </g>
  );
}

export function Wire({
  x1,
  y1,
  x2,
  y2,
  on = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  on?: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={on ? WIRE_ON : WIRE_OFF}
      strokeWidth={on ? 3.2 : 2}
      strokeLinecap="square"
    />
  );
}

export function Dot({ x, y, on = false }: { x: number; y: number; on?: boolean }) {
  return <circle cx={x} cy={y} r="3.6" fill={on ? WIRE_ON : WIRE_OFF} />;
}

export function RungNum({ y, num }: { y: number; num: string }) {
  return (
    <text
      x="16"
      y={y + 4}
      textAnchor="middle"
      fontSize="10.5"
      fontWeight="700"
      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
      fill="#575e6e"
    >
      {num}
    </text>
  );
}

export function CommentTag({
  x,
  y,
  text,
  theme = 'blue',
}: {
  x: number;
  y: number;
  text?: string;
  theme?: TagTheme;
}) {
  if (!text) return null;
  const palettes: Record<TagTheme, { bg: string; bd: string; fg: string }> = {
    blue: { bg: '#eff4ff', bd: '#93c5fd', fg: '#004ac6' },
    red: { bg: '#fef2f2', bd: '#fca5a5', fg: '#b91c1c' },
    amber: { bg: '#fffbeb', bd: '#fcd34d', fg: '#b45309' },
    green: { bg: '#ecfdf5', bd: '#6ee7b7', fg: '#047857' },
    purple: { bg: '#f5f3ff', bd: '#c4b5fd', fg: '#632ecd' },
    slate: { bg: '#f1f5f9', bd: '#cbd5e1', fg: '#334155' },
  };
  const p = palettes[theme] || palettes.blue;
  const w = Math.max(78, text.length * 9.2 + 14);
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y + 20}
        width={w}
        height="19"
        rx="4"
        fill={p.bg}
        stroke={p.bd}
        strokeWidth="1"
      />
      <text x={x} y={y + 33} textAnchor="middle" fontSize="10" fontWeight="600" fill={p.fg}>
        {text}
      </text>
    </g>
  );
}

export function ContactA({
  x,
  y,
  dev,
  label,
  on = false,
  theme = 'blue',
}: {
  x: number;
  y: number;
  dev: string;
  label?: string;
  on?: boolean;
  theme?: TagTheme;
}) {
  return (
    <g>
      {on && (
        <rect
          x={x - 16}
          y={y - 14}
          width="32"
          height="28"
          rx="3"
          fill={HL_FILL}
          stroke="#93c5fd"
          strokeWidth="1"
        />
      )}
      <line x1={x - 18} y1={y - 14} x2={x - 18} y2={y + 14} stroke={on ? HL_STROKE : '#213145'} strokeWidth="2.4" />
      <line x1={x + 18} y1={y - 14} x2={x + 18} y2={y + 14} stroke={on ? HL_STROKE : '#213145'} strokeWidth="2.4" />
      <text
        x={x}
        y={y - 19}
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fill={on ? '#004ac6' : '#0b1c30'}
      >
        {dev}
      </text>
      <CommentTag x={x} y={y} text={label} theme={theme} />
    </g>
  );
}

export function ContactB({
  x,
  y,
  dev,
  label,
  on = false,
  theme = 'red',
}: {
  x: number;
  y: number;
  dev: string;
  label?: string;
  on?: boolean;
  theme?: TagTheme;
}) {
  return (
    <g>
      {on && (
        <rect
          x={x - 16}
          y={y - 14}
          width="32"
          height="28"
          rx="3"
          fill={HL_FILL}
          stroke="#93c5fd"
          strokeWidth="1"
        />
      )}
      <line x1={x - 18} y1={y - 14} x2={x - 18} y2={y + 14} stroke={on ? HL_STROKE : '#213145'} strokeWidth="2.4" />
      <line x1={x + 18} y1={y - 14} x2={x + 18} y2={y + 14} stroke={on ? HL_STROKE : '#213145'} strokeWidth="2.4" />
      <line x1={x - 12} y1={y + 12} x2={x + 12} y2={y - 12} stroke={on ? HL_STROKE : '#dc2626'} strokeWidth="2.2" />
      <text
        x={x}
        y={y - 19}
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fill={on ? '#004ac6' : '#0b1c30'}
      >
        {dev}
      </text>
      <CommentTag x={x} y={y} text={label} theme={theme} />
    </g>
  );
}

export function ContactRise({
  x,
  y,
  dev,
  label,
  on = false,
  theme = 'purple',
}: {
  x: number;
  y: number;
  dev: string;
  label?: string;
  on?: boolean;
  theme?: TagTheme;
}) {
  return (
    <g>
      {on && (
        <rect
          x={x - 16}
          y={y - 14}
          width="32"
          height="28"
          rx="3"
          fill={HL_FILL}
          stroke="#93c5fd"
          strokeWidth="1"
        />
      )}
      <line x1={x - 18} y1={y - 14} x2={x - 18} y2={y + 14} stroke={on ? HL_STROKE : '#213145'} strokeWidth="2.4" />
      <line x1={x + 18} y1={y - 14} x2={x + 18} y2={y + 14} stroke={on ? HL_STROKE : '#213145'} strokeWidth="2.4" />
      <line x1={x} y1={y + 10} x2={x} y2={y - 9} stroke={on ? HL_STROKE : '#632ecd'} strokeWidth="2.1" />
      <polyline
        points={`${x - 5},${y - 3} ${x},${y - 10} ${x + 5},${y - 3}`}
        fill="none"
        stroke={on ? HL_STROKE : '#632ecd'}
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <text
        x={x}
        y={y - 19}
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fill={on ? '#004ac6' : '#0b1c30'}
      >
        {dev}
      </text>
      <CommentTag x={x} y={y} text={label} theme={theme} />
    </g>
  );
}

export function CompareBox({
  x,
  y,
  expr,
  label,
  on = false,
  theme = 'purple',
  width = 112,
}: {
  x: number;
  y: number;
  expr: string;
  label?: string;
  on?: boolean;
  theme?: TagTheme;
  width?: number;
}) {
  const w = Math.max(width, expr.length * 8.5 + 20);
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - 15}
        width={w}
        height="30"
        rx="5"
        fill={on ? '#004ac6' : '#ffffff'}
        stroke={on ? '#003ea8' : '#64748b'}
        strokeWidth="2"
      />
      <text
        x={x}
        y={y + 4.5}
        textAnchor="middle"
        fontSize="11.5"
        fontWeight="700"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fill={on ? '#ffffff' : '#0b1c30'}
      >
        {expr}
      </text>
      <CommentTag x={x} y={y} text={label} theme={theme} />
    </g>
  );
}

export function Coil({
  x,
  y,
  dev,
  label,
  on = false,
  theme = 'green',
}: {
  x: number;
  y: number;
  dev: string;
  label?: string;
  on?: boolean;
  theme?: TagTheme;
}) {
  return (
    <g>
      {on && (
        <rect
          x={x - 21}
          y={y - 15}
          width="42"
          height="30"
          rx="15"
          fill={HL_FILL}
          stroke="#93c5fd"
          strokeWidth="1"
        />
      )}
      <path
        d={`M ${x - 13} ${y - 15} Q ${x - 25} ${y} ${x - 13} ${y + 15}`}
        fill="none"
        stroke={on ? HL_STROKE : '#213145'}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d={`M ${x + 13} ${y - 15} Q ${x + 25} ${y} ${x + 13} ${y + 15}`}
        fill="none"
        stroke={on ? HL_STROKE : '#213145'}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <text
        x={x}
        y={y - 19}
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fill={on ? '#004ac6' : '#0b1c30'}
      >
        {dev}
      </text>
      <CommentTag x={x} y={y} text={label} theme={theme} />
    </g>
  );
}

export function InstBox({
  x,
  y,
  cmd,
  label,
  on = false,
  liveText = '',
  theme = 'green',
  width = 148,
}: {
  x: number;
  y: number;
  cmd: string;
  label?: string;
  on?: boolean;
  liveText?: string;
  theme?: TagTheme;
  width?: number;
}) {
  const w = Math.max(width, cmd.length * 8.4 + 22);
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - 16}
        width={w}
        height="32"
        rx="5"
        fill={on ? '#004ac6' : '#ffffff'}
        stroke={on ? '#003ea8' : '#475569'}
        strokeWidth="2"
      />
      <text
        x={x}
        y={y + 4.5}
        textAnchor="middle"
        fontSize="11.5"
        fontWeight="700"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fill={on ? '#ffffff' : '#0b1c30'}
      >
        {cmd}
      </text>
      {liveText && (
        <g>
          <rect
            x={x - 62}
            y={y - 37}
            width="124"
            height="17"
            rx="8.5"
            fill={on ? '#eff4ff' : '#f1f5f9'}
            stroke={on ? '#2563eb' : '#cbd5e1'}
            strokeWidth="1"
          />
          <text
            x={x}
            y={y - 25}
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fill={on ? '#004ac6' : '#475569'}
          >
            {liveText}
          </text>
        </g>
      )}
      <CommentTag x={x} y={y} text={label} theme={theme} />
    </g>
  );
}
