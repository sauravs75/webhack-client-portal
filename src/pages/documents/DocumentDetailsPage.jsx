import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Download, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DocumentPreview from "@/components/documents/DocumentPreview";
import DocumentSkeleton from "@/components/documents/DocumentSkeleton";
import EditDocumentDialog from "@/features/documents/components/EditDocumentDialog";
import { DOCUMENT_CATEGORY_LABELS } from "@/features/documents/schemas";
import { formatFileSize, formatFileType } from "@/features/documents/formatters";
import { useDeleteDocument, useDocument } from "@/hooks/useDocuments";
import { getDocumentDownloadUrl } from "@/services/documents/index";
import { formatDateTime } from "@/lib/utils";

export default function DocumentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { data: document, isLoading, error } = useDocument(id);
  const deleteDocument = useDeleteDocument();

  const handleDownload = async () => {
    const url = await getDocumentDownloadUrl(document);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete "${document.file_name}"?`);
    if (!confirmed) return;
    await deleteDocument.mutateAsync(document.id);
    navigate("/dashboard/documents");
  };

  if (isLoading) return <DocumentSkeleton />;

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        <p className="font-medium">Failed loading document.</p>
        <p className="mt-1">{error?.message || "Unknown error"}</p>
      </div>
    );
  }

  if (!document) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-background/70 p-6 shadow-sm lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Button asChild variant="ghost" className="-ml-3 mb-3">
            <Link to="/dashboard/documents">
              <ArrowLeft className="h-4 w-4" />
              Back to documents
            </Link>
          </Button>
          <p className="text-sm font-medium text-primary">{DOCUMENT_CATEGORY_LABELS[document.category] || "Other"}</p>
          <h2 className="mt-1 break-words text-2xl font-semibold">{document.file_name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{document.project?.name || "No linked project"}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" onClick={() => setIsEditOpen(true)}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete} isLoading={deleteDocument.isPending}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
          <p className="text-xs text-muted-foreground">File Size</p>
          <p className="mt-1 font-medium">{formatFileSize(document.file_size)}</p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
          <p className="text-xs text-muted-foreground">File Type</p>
          <p className="mt-1 truncate font-medium">{formatFileType(document.file_type, document.file_name)}</p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
          <p className="text-xs text-muted-foreground">Upload Date</p>
          <p className="mt-1 font-medium">{formatDateTime(document.created_at)}</p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
          <p className="text-xs text-muted-foreground">Uploaded By</p>
          <p className="mt-1 truncate font-medium">{document.uploaded_by_name || "-"}</p>
        </div>
      </div>

      <DocumentPreview document={document} />
      <EditDocumentDialog open={isEditOpen} onOpenChange={setIsEditOpen} document={document} />
    </div>
  );
}
