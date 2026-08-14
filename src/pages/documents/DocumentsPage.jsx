import { useState } from "react";
import { motion } from "framer-motion";
import { FilePlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DocumentCard from "@/components/documents/DocumentCard";
import DocumentEmptyState from "@/components/documents/DocumentEmptyState";
import DocumentFilters from "@/components/documents/DocumentFilters";
import DocumentSearch from "@/components/documents/DocumentSearch";
import DocumentSkeleton from "@/components/documents/DocumentSkeleton";
import DocumentTable from "@/components/documents/DocumentTable";
import EditDocumentDialog from "@/features/documents/components/EditDocumentDialog";
import UploadDocumentDialog from "@/features/documents/components/UploadDocumentDialog";
import { useDeleteDocument, useDocuments } from "@/hooks/useDocuments";
import { getDocumentDownloadUrl } from "@/services/documents/index";

const PAGE_SIZE = 10;

export default function DocumentsPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editDocument, setEditDocument] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    projectId: "all",
    sortBy: "uploaded_desc",
    page: 1,
    limit: PAGE_SIZE,
  });
  const { data, isLoading, error } = useDocuments(filters);
  const deleteDocument = useDeleteDocument();

  const documents = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  const updateFilters = (nextFilters) => {
    setFilters((current) => ({ ...current, ...nextFilters }));
  };

  const handleDownload = async (document) => {
    const url = await getDocumentDownloadUrl(document);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDelete = async (document) => {
    const confirmed = window.confirm(`Delete "${document.file_name}"?`);
    if (!confirmed) return;
    await deleteDocument.mutateAsync(document.id);
  };

  if (isLoading) return <DocumentSkeleton />;

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        <p className="font-medium">Failed loading documents.</p>
        <p className="mt-1">{error?.message || "Unknown error"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-background/70 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Documents</p>
          <h2 className="mt-1 text-2xl font-semibold">Document management</h2>
          <p className="mt-2 text-sm text-muted-foreground">Upload, preview, and manage project documents.</p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)}>
          <FilePlus2 className="h-4 w-4" />
          Upload document
        </Button>
      </motion.div>

      <div className="space-y-4">
        <div className="grid gap-3 xl:grid-cols-[minmax(220px,320px)_1fr] xl:items-center">
          <DocumentSearch
            value={filters.search}
            onChange={(search) => updateFilters({ search, page: 1 })}
            onSearch={(search) => updateFilters({ search, page: 1 })}
          />
          <DocumentFilters
            category={filters.category}
            projectId={filters.projectId}
            sortBy={filters.sortBy}
            onChange={updateFilters}
          />
        </div>

        {documents.length === 0 ? (
          <DocumentEmptyState actionLabel="Upload document" onAction={() => setIsUploadOpen(true)} />
        ) : (
          <>
            <div className="hidden lg:block">
              <DocumentTable documents={documents} onEdit={setEditDocument} onDelete={handleDelete} onDownload={handleDownload} />
            </div>

            <div className="grid gap-4 lg:hidden">
              {documents.map((document) => (
                <DocumentCard key={document.id} document={document} onEdit={setEditDocument} onDelete={handleDelete} onDownload={handleDownload} />
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {documents.length} of {total} documents
              </p>
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filters.page <= 1}
                  onClick={() => updateFilters({ page: Math.max(filters.page - 1, 1) })}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {filters.page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filters.page >= totalPages}
                  onClick={() => updateFilters({ page: Math.min(filters.page + 1, totalPages) })}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <UploadDocumentDialog open={isUploadOpen} onOpenChange={setIsUploadOpen} />
      <EditDocumentDialog open={Boolean(editDocument)} onOpenChange={() => setEditDocument(null)} document={editDocument} />
    </div>
  );
}
