"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

function isValidImageSrc(src: unknown): src is string {
  return (
    typeof src === "string" &&
    (src.startsWith("https://") ||
      src.startsWith("http://") ||
      src.startsWith("data:image/") ||
      src.startsWith("/"))
  );
}

interface LogoPreviewProps {
  src: string;
}

const LogoPreview: React.FC<LogoPreviewProps> = ({ src }) => {
  const [hasError, setHasError] = useState(false);

  // Reset error state on src change so new URLs retrigger loading logic
  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!isValidImageSrc(src)) {
    return (
      <div className="flex flex-col items-center text-center text-slate-500 text-xs">
        <span>Invalid image URL</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center text-center text-slate-500 text-xs">
        <span>Failed to load image</span>
      </div>
    );
  }

  if (src.startsWith("data:image/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt="Logo Preview"
        width={96}
        height={96}
        style={{ objectFit: "contain" }}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt="Logo Preview"
      width={96}
      height={96}
      style={{ objectFit: "contain" }}
      onError={() => setHasError(true)}
      unoptimized={src.startsWith("http")}
    />
  );
};

export default LogoPreview;
