// components/Mandatory.tsx
import React from "react";

interface MandatoryProps {
  size?: number;
  className?: string;
}

export default function Mandatory({ size = 12, className }: MandatoryProps) {
  return (
    <span
      className={className}
      style={{
        color: "#ff6666",
        fontSize: size,
        marginLeft: 4,
        lineHeight: 1,
      }}
    >
      *
    </span>
  );
}
