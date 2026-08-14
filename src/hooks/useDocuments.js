import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteDocument, getDocument, getDocuments, updateDocument, uploadDocument } from "@/services/documents/index";
import { useToast } from "@/components/ui/toast";

export function useDocuments(filters = {}) {
  return useQuery({
    queryKey: ["documents", filters],
    queryFn: () => getDocuments(filters),
  });
}

export function useDocument(documentId) {
  return useQuery({
    queryKey: ["document", documentId],
    queryFn: () => getDocument(documentId),
    enabled: Boolean(documentId),
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["documents"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      await queryClient.invalidateQueries({ queryKey: ["activityLogs"] });
      addToast({ variant: "success", title: "Document uploaded", message: "Document uploaded successfully." });
    },
    onError: (err) => {
      addToast({ variant: "destructive", title: "Upload failed", message: err?.message || "Failed to upload document." });
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ documentId, values }) => updateDocument(documentId, values),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["documents"] });
      await queryClient.invalidateQueries({ queryKey: ["document", variables.documentId] });
      addToast({ variant: "success", title: "Document updated", message: "Document details updated." });
    },
    onError: (err) => {
      addToast({ variant: "destructive", title: "Update failed", message: err?.message || "Failed to update document." });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["documents"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      await queryClient.invalidateQueries({ queryKey: ["activityLogs"] });
      addToast({ variant: "success", title: "Document deleted", message: "Document deleted successfully." });
    },
    onError: (err) => {
      addToast({ variant: "destructive", title: "Delete failed", message: err?.message || "Failed to delete document." });
    },
  });
}
