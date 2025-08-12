"use client";

interface ToothIconProps {
  className?: string;
}

export const ToothIcon = ({ className = "" }: ToothIconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Silueta principal */}
      <path
        d="
          M12 2.8
          C8.2 2.8,4.8 5.4,4.8 9.2
          c0 2.6 1 4.1 2.2 5.3
          c1.1 1.1 1.6 1.9 1.6 3.7
          c0 3.2 1.1 6 2.4 6
          c1.2 0 1.9-2.6 2.9-4.8
          c1 2.2 1.7 4.8 2.9 4.8
          c1.3 0 2.4-2.8 2.4-6
          c0-1.8 0.5-2.6 1.6-3.7
          c1.2-1.2 2.2-2.7 2.2-5.3
          C19.2 5.4,15.8 2.8,12 2.8Z"
      />
      {/* Curvatura de la corona */}
      <path
        d="M7.2 8.4c1.5-1 3.3-1.4 4.8-1.4c1.5 0 3.3.4 4.8 1.4"
      />
    </svg>
  );
};
