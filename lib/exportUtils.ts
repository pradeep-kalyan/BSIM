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

  // Add capture class for special styling
  element.classList.add("capturing-screenshot");

  try {
    // Wait for all charts and content to fully render
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const captureOptions = {
      quality,
      backgroundColor,
      width: width || Math.max(elementRect.width, 1200),
      height: height || Math.max(elementRect.height, 800),
      style: {
        transform: "scale(1)",
        transformOrigin: "top left",
        width: `${width || Math.max(elementRect.width, 1200)}px`,
        height: `${height || Math.max(elementRect.height, 800)}px`,
      },
      pixelRatio,
      skipFonts: true,
      useCORS: true,
      allowTaint: true,
      cacheBust: true,
    };

    let dataUrl: string;

    // Try PNG first, fallback to JPEG
    if (format === "png") {
      try {
        console.log("Attempting PNG capture with options:", captureOptions);
        dataUrl = await htmlToImage.toPng(element, captureOptions);

        if (
          !dataUrl ||
          typeof dataUrl !== "string" ||
          !dataUrl.startsWith("data:")
        ) {
          throw new Error("Invalid PNG data URL generated");
        }
      } catch (pngError) {
        console.log("PNG method failed, trying JPEG method:", pngError);

        // Fallback to JPEG
        const jpegOptions = {
          ...captureOptions,
          quality: Math.min(quality, 0.9),
        };
        console.log("Attempting JPEG capture with options:", jpegOptions);
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
      console.log("Attempting JPEG capture with options:", jpegOptions);
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

    console.log(`${format.toUpperCase()} capture successful`);
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
    // Remove capture class
    element.classList.remove("capturing-screenshot");
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

  return exportElementAsImage({
    element,
    filename: defaultFilename,
    format: "png",
    quality: 1,
    backgroundColor: "#0f172a",
    pixelRatio: 1.5,
  });
};
