export function formatFileSize(size = 0) {
  if (!size) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
  return `${(size / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function formatFileType(fileType = "", fileName = "") {
  const extension = fileName.includes(".") ? fileName.split(".").pop() : "";
  if (extension) return extension.toUpperCase();
  if (!fileType) return "-";
  if (fileType.includes("/")) return fileType.split("/").pop().toUpperCase();
  return fileType.toUpperCase();
}

