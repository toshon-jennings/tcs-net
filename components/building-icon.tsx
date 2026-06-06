type BuildingIconProps = {
  className?: string;
};

/**
 * Simple line illustration of the Lux Urbi facade — two brick wings, the
 * central glass tower with its grid, the canopy entrance, and the rainbow
 * arc mark above the doors. Used as the Home button in the site nav.
 */
export function BuildingIcon({ className }: BuildingIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Left wing */}
      <rect x="2" y="10" width="8.5" height="18" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4.3 13.5h4M4.3 17h4M4.3 20.5h4M4.3 24h4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.55" />
      {/* Right wing */}
      <rect x="21.5" y="10" width="8.5" height="18" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M23.7 13.5h4M23.7 17h4M23.7 20.5h4M23.7 24h4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.55" />
      {/* Central glass tower */}
      <rect x="11" y="4" width="10" height="24" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14.3 6.5v15M17.7 6.5v15M11.5 9.5h9M11.5 13h9M11.5 16.5h9M11.5 20h9" stroke="currentColor" strokeWidth="0.9" opacity="0.45" />
      {/* Rainbow arc mark (raised up the tower) */}
      <path d="M13.2 18.5c0-1.55 1.26-2.8 2.8-2.8s2.8 1.25 2.8 2.8" stroke="#efc547" strokeWidth="1.4" strokeLinecap="round" />
      {/* Entrance / double doors */}
      <rect x="13" y="22" width="6" height="6" rx="0.4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M16 22.4v5.2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
