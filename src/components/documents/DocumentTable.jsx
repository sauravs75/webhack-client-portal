import { Link } from "react-router-dom";
import { Download, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DOCUMENT_CATEGORY_LABELS } from "@/features/documents/schemas";
import { formatFileSize, formatFileType } from "@/features/documents/formatters";
import { formatDate } from "@/lib/utils";

export default function DocumentTable({ documents, onEdit, onDelete, onDownload }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/80">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Uploaded By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id}>
              <TableCell>
                <div>
                  <p className="max-w-[220px] truncate font-medium">{document.file_name}</p>
                </div>
              </TableCell>
              <TableCell>{DOCUMENT_CATEGORY_LABELS[document.category] || "Other"}</TableCell>
              <TableCell>{document.project?.name || "-"}</TableCell>
              <TableCell>{formatFileSize(document.file_size)}</TableCell>
              <TableCell>
                <span className="block max-w-[140px] truncate">{formatFileType(document.file_type, document.file_name)}</span>
              </TableCell>
              <TableCell>{formatDate(document.created_at)}</TableCell>
              <TableCell>
                <span className="block max-w-[140px] truncate">{document.uploaded_by_name || "-"}</span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/dashboard/documents/${document.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onDownload?.(document)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onEdit?.(document)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete?.(document)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
