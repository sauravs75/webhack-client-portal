import { useEffect, useState } from "react";
import {
  ExternalLink,
  FileText,
  Presentation,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getDocumentDownloadUrl } from "@/services/documents/index";

/**
 * Check image files
 */
function isImage(fileType = "", fileName = "") {
  const type = String(fileType).toLowerCase();
  const name = String(fileName).toLowerCase();

  return (
    type.startsWith("image/") ||
    /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(name)
  );
}

/**
 * Check PDF files
 */
function isPdf(fileType = "", fileName = "") {
  const type = String(fileType).toLowerCase();
  const name = String(fileName).toLowerCase();

  return (
    type === "application/pdf" ||
    type.includes("pdf") ||
    name.endsWith(".pdf")
  );
}

/**
 * Check PowerPoint files
 */
function isPowerPoint(fileType = "", fileName = "") {
  const type = String(fileType).toLowerCase();
  const name = String(fileName).toLowerCase();

  return (
    type === "application/vnd.ms-powerpoint" ||
    type ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    type.includes("powerpoint") ||
    type.includes("presentation") ||
    name.endsWith(".ppt") ||
    name.endsWith(".pptx")
  );
}

/**
 * Create Microsoft Office Online Viewer URL
 */
function getOfficeViewerUrl(fileUrl) {
  return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
    fileUrl
  )}`;
}

export default function DocumentPreview({ document }) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadPreview() {
      setLoading(true);
      setError("");
      setPreviewUrl("");

      if (!document) {
        setLoading(false);
        return;
      }

      const fileType = document.file_type || "";
      const fileName = document.file_name || "";

      const image = isImage(fileType, fileName);
      const pdf = isPdf(fileType, fileName);
      const powerpoint = isPowerPoint(fileType, fileName);

      console.log("Document:", document);
      console.log("File name:", fileName);
      console.log("File type:", fileType);
      console.log("Is image:", image);
      console.log("Is PDF:", pdf);
      console.log("Is PowerPoint:", powerpoint);

      /**
       * Only load preview for supported files
       */
      if (!image && !pdf && !powerpoint) {
        setLoading(false);
        return;
      }

      try {
        const url = await getDocumentDownloadUrl(document);

        if (!url) {
          throw new Error("Unable to generate document URL.");
        }

        console.log("Document URL:", url);

        if (active) {
          setPreviewUrl(url);
        }
      } catch (err) {
        console.error("Document preview error:", err);

        if (active) {
          setError(
            err?.message || "Unable to load document preview."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPreview();

    return () => {
      active = false;
    };
  }, [document]);

  /**
   * No document
   */
  if (!document) {
    return null;
  }

  const fileType = document.file_type || "";
  const fileName = document.file_name || "";

  const image = isImage(fileType, fileName);
  const pdf = isPdf(fileType, fileName);
  const powerpoint = isPowerPoint(fileType, fileName);

  /**
   * Loading
   */
  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-border/70 bg-card/80 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />

        <h3 className="mt-4 text-lg font-semibold">
          Loading preview...
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Please wait while the document is loading.
        </p>
      </div>
    );
  }

  /**
   * Error
   */
  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-card/80 px-6 text-center">
        <FileText className="h-10 w-10 text-destructive" />

        <h3 className="mt-4 text-lg font-semibold">
          Unable to preview document
        </h3>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {error}
        </p>

        {previewUrl && (
          <Button asChild className="mt-5" variant="outline">
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open file
            </a>
          </Button>
        )}
      </div>
    );
  }

  /**
   * =========================
   * IMAGE PREVIEW
   * =========================
   */
  if (previewUrl && image) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/80">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />

            <span
              className="truncate text-sm font-medium"
              title={fileName}
            >
              {fileName}
            </span>
          </div>

          <Button asChild size="sm" variant="outline">
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open
            </a>
          </Button>
        </div>

        {/* Image */}
        <div className="flex min-h-[400px] items-center justify-center p-4">
          <img
            src={previewUrl}
            alt={fileName}
            className="max-h-[680px] max-w-full object-contain"
            onError={() => {
              setError("The image could not be loaded.");
            }}
          />
        </div>
      </div>
    );
  }

  /**
   * =========================
   * PDF PREVIEW
   * =========================
   */
  if (previewUrl && pdf) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/80">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />

            <span
              className="truncate text-sm font-medium"
              title={fileName}
            >
              {fileName}
            </span>
          </div>

          <Button asChild size="sm" variant="outline">
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open PDF
            </a>
          </Button>
        </div>

        {/* PDF Viewer */}
        <iframe
          title={`PDF Preview - ${fileName}`}
          src={previewUrl}
          className="h-[680px] w-full border-0"
        />
      </div>
    );
  }

  /**
   * =========================
   * POWERPOINT PREVIEW
   * =========================
   */
  if (previewUrl && powerpoint) {
    const officeViewerUrl = getOfficeViewerUrl(previewUrl);

    return (
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/80">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <Presentation className="h-5 w-5 shrink-0 text-muted-foreground" />

            <span
              className="truncate text-sm font-medium"
              title={fileName}
            >
              {fileName}
            </span>
          </div>

          <Button asChild size="sm" variant="outline">
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open PPT
            </a>
          </Button>
        </div>

        {/* PowerPoint Viewer */}
        <iframe
          title={`PowerPoint Preview - ${fileName}`}
          src={officeViewerUrl}
          className="h-[680px] w-full border-0"
          allowFullScreen
        />
      </div>
    );
  }

  /**
   * =========================
   * UNSUPPORTED FILE
   * =========================
   */
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-border/70 bg-card/80 px-6 py-16 text-center">
      <FileText className="h-10 w-10 text-muted-foreground" />

      <h3 className="mt-4 text-lg font-semibold">
        Preview unavailable
      </h3>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Preview is supported for PDF, PowerPoint, and image files.
      </p>

      {previewUrl && (
        <Button asChild className="mt-5" variant="outline">
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open file
          </a>
        </Button>
      )}
    </div>
  );
}