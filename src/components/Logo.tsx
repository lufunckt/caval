import React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  textColor?: string;
  iconOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  showText = true,
  textColor = "text-ivory",
  iconOnly = false,
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`} id="brand-logo-container">
      {/* Hand-drawn minimalist silhouette of human and canine connection */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 transition-transform duration-300 hover:scale-105"
        id="logo-brand-icon"
      >
        {/* Human Face Silhouette (Left side, facing right) */}
        <path
          d="M30 20C33 20 37 25 35 30C33 34 39 37 41 39C43 41 45 40 43 43C41 46 39 45 37 49C35 53 38 56 34 60C31 63 32 68 30 72C28 75 25 78 22 80"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-ivory"
        />

        {/* Central Relational Connection Point (Small circle) */}
        <circle cx="49" cy="45" r="3" fill="#ED4C87" className="animate-pulse" />

        {/* Canine/Dog Muzzle & Ears Silhouette (Right side, facing left) */}
        <path
          d="M74 25C76 28 72 34 68 36C64 38 61 36 57 41C54 44 55 48 57 52C59 55 64 56 63 60C62 63 56 66 59 70C61 73 66 76 68 79"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-forest animate-pulse-slow"
        />

        {/* Supporting artistic arc on lower right */}
        <path
          d="M52 74C61 74 68 67 68 59"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeDasharray="2 3"
          className="text-peach"
        />
      </svg>

      {showText && !iconOnly && (
        <div className="flex flex-col text-left justify-center" id="brand-logo-text-block">
          <div className={`font-display font-bold tracking-tight lowercase leading-[0.95] ${textColor}`}>
            <div style={{ fontSize: "28px" }} className="leading-none">érico</div>
            <div style={{ fontSize: "23px" }} className="leading-none mt-0.5">cavalheiro</div>
          </div>
          <span className="font-sans text-[9px] lowercase font-medium tracking-wider text-forest select-none mt-1 leading-none">
            educação relacional
          </span>
        </div>
      )}
    </div>
  );
};
