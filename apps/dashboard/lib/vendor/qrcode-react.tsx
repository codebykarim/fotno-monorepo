"use client";

type Props = {
  value: string;
  size?: number;
  className?: string;
};

export function QRCodeSVG({ value, size = 164, className }: Props) {
  const short = value.slice(0, 32);

  return (
    <svg
      role="img"
      aria-label="QR code"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
    >
      <rect x="0" y="0" width="100" height="100" fill="white" />
      <rect x="8" y="8" width="24" height="24" fill="black" />
      <rect x="68" y="8" width="24" height="24" fill="black" />
      <rect x="8" y="68" width="24" height="24" fill="black" />
      <path d="M40 12h6v6h-6zM52 12h6v6h-6zM40 24h6v6h-6zM52 24h6v6h-6zM40 68h6v6h-6zM52 68h6v6h-6zM64 68h6v6h-6zM40 80h6v6h-6zM52 80h6v6h-6zM64 80h6v6h-6z" fill="black" />
      <text x="50" y="58" textAnchor="middle" fontSize="4" fill="black">
        {short}
      </text>
    </svg>
  );
}
