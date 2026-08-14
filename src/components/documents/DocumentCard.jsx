import { Link } from "react-router-dom";
import { Download, Eye, FileText, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DOCUMENT_CATEGORY_LABELS } from "@/features/documents/schemas";
import { formatFileSize, formatFileType } from "@/features/documents/formatters";
import { formatDate } from "@/lib/utils";

export default function DocumentCard({ document, onEdit, onDelete, onDownload }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{document.file_name}</p>
          <p className="mt-1 text-xs text-muted-foreground">{document.project?.name || "No project"}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Category</p>
          <p className="font-medium">{DOCUMENT_CATEGORY_LABELS[document.category] || "Other"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Size</p>
          <p className="font-medium">{formatFileSize(document.file_size)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Type</p>
          <p className="truncate font-medium">{formatFileType(document.file_type, document.file_name)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Uploaded</p>
          <p className="font-medium">{formatDate(document.created_at)}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-muted-foreground">Uploaded By</p>
          <p className="truncate font-medium">{document.uploaded_by_name || "-"}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Button asChild size="sm" variant="outline">
          <Link to={`/dashboard/documents/${document.id}`}>
            <Eye className="h-4 w-4" />
            View
          </Link>
        </Button>
        <Button size="sm" variant="outline" onClick={() => onDownload?.(document)}>
          <Download className="h-4 w-4" />
          Download
        </Button>
        <Button size="sm" variant="outline" onClick={() => onEdit?.(document)}>
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete?.(document)}>
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
