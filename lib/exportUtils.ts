import * as htmlToImage from "html-to-image";

interface ExportOptions {
  element: HTMLElement;
  filename?: string;
  format?: "png" | "jpeg";
  quality?: number;
  backgroundColor?: string;
  pixelRatio?: number;
  width?: number;
  height?: number;
}

/**
 * Exports an HTML element as an image
 * @param options - Configuration options for the export
 * @returns Promise that resolves when export is complete
 */
export const exportElementAsImage = async (
  options: ExportOptions
): Promise<void> => {
  const {
    element,
    filename = `export_${new Date().toISOString().split("T")[0]}`,
    format = "png",
    quality = 1,
    backgroundColor = "#0f172a",
    pixelRatio = 1.5,
    width,
    height,
  } = options;

  if (!element) {
    throw new Error("Element is required for export");
  }

  // Validate container dimensions
  const elementRect = element.getBoundingClientRect();
  if (elementRect.width === 0 || elementRect.height === 0) {
    throw new Error("Element has no dimensions - cannot export");
  }

  // Set default font styles to prevent html-to-image font errors
  const prevFontFamily = element.style.fontFamily;
  const prevFont = element.style.font;

  // Ensure font properties are properly set
  if (!element.style.fontFamily) {
    element.style.fontFamily = "Inter, Arial, sans-serif";
  }

  // Remove any undefined font property to prevent html-to-image errors
  if (!element.style.font || element.style.font === "undefined") {
    element.style.removeProperty("font");
  }

  // Add capture class for special styling
  element.classList.add("capturing-screenshot");

  try {
    // Wait for all charts and content to fully render
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Get actual content dimensions including scrollable content
    const fullHeight = Math.max(
      element.scrollHeight,
      element.offsetHeight,
      element.clientHeight,
      800
    );
    const fullWidth = Math.max(
      element.scrollWidth,
      element.offsetWidth,
      element.clientWidth,
      1200
    );

    const captureOptions = {
      quality,
      backgroundColor,
      width: width || fullWidth,
      height: height || fullHeight,
      style: {
        transform: "scale(1)",
        transformOrigin: "top left",
        width: `${width || fullWidth}px`,
        height: `${height || fullHeight}px`,
        overflow: "visible",
        position: "static",
        maxHeight: "none",
        fontFamily: "Inter, Arial, sans-serif",
        fontSize: "16px",
        fontWeight: "400",
        lineHeight: "1.5",
      },
      pixelRatio,
      skipFonts: true, // Skip font loading to avoid font-related errors
      useCORS: true,
      allowTaint: true,
      cacheBust: true,
      scrollX: 0,
      scrollY: 0,
    };

    let dataUrl: string;

    // Try PNG first, fallback to JPEG
    if (format === "png") {
      try {
        dataUrl = await htmlToImage.toPng(element, captureOptions);

        if (
          !dataUrl ||
          typeof dataUrl !== "string" ||
          !dataUrl.startsWith("data:")
        ) {
          throw new Error("Invalid PNG data URL generated");
        }
      } catch {
        // Fallback to JPEG
        const jpegOptions = {
          ...captureOptions,
          quality: Math.min(quality, 0.9),
        };
        dataUrl = await htmlToImage.toJpeg(element, jpegOptions);

        if (
          !dataUrl ||
          typeof dataUrl !== "string" ||
          !dataUrl.startsWith("data:")
        ) {
          throw new Error("Invalid JPEG data URL generated");
        }
      }
    } else {
      // Direct JPEG export
      const jpegOptions = {
        ...captureOptions,
        quality: Math.min(quality, 0.9),
      };
      dataUrl = await htmlToImage.toJpeg(element, jpegOptions);

      if (
        !dataUrl ||
        typeof dataUrl !== "string" ||
        !dataUrl.startsWith("data:")
      ) {
        throw new Error("Invalid JPEG data URL generated");
      }
    }

    // Create and trigger download
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${filename}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Export failed:", error);

    let errorMessage = "Export failed. ";
    if (error instanceof Error) {
      errorMessage += error.message;
    } else {
      errorMessage += "Unknown error occurred.";
    }

    throw new Error(errorMessage);
  } finally {
    // Remove capture class and restore font styles
    element.classList.remove("capturing-screenshot");

    // Restore previous font family
    if (prevFontFamily) {
      element.style.fontFamily = prevFontFamily;
    } else {
      element.style.removeProperty("fontFamily");
    }

    // Restore previous font property
    if (prevFont && prevFont !== "undefined") {
      element.style.font = prevFont;
    } else {
      element.style.removeProperty("font");
    }
  }
};

/**
 * Exports a dashboard specifically with optimized settings
 * @param element - The dashboard container element
 * @param filename - Optional filename (defaults to dashboard_YYYY-MM-DD)
 * @returns Promise that resolves when export is complete
 */
export const exportDashboard = async (
  element: HTMLElement,
  filename?: string
): Promise<void> => {
  const defaultFilename =
    filename || `dashboard_${new Date().toISOString().split("T")[0]}`;

  // Get the full scrollable content dimensions
  const scrollHeight = element.scrollHeight;
  const scrollWidth = element.scrollWidth;
  const clientHeight = element.clientHeight;
  const clientWidth = element.clientWidth;

  // Use the larger of the two dimensions to capture all content
  const captureHeight = Math.max(scrollHeight, clientHeight, 800);
  const captureWidth = Math.max(scrollWidth, clientWidth, 1200);

  return exportElementAsImage({
    element,
    filename: defaultFilename,
    format: "png",
    quality: 1,
    backgroundColor: "rgba(18,20,24,0.95)", // Match dashboard background
    pixelRatio: 1.5,
    width: captureWidth,
    height: captureHeight,
  });
};
