export function generateUploadId(): string {
	return `hw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function formatFileSize(bytes: number | undefined | null): string {
	if (typeof bytes !== "number" || Number.isNaN(bytes) || bytes < 0) {
		return "Unknown size";
	}

	const units = ["B", "KB", "MB", "GB"];
	let size = bytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return `${size.toFixed(2)} ${units[unitIndex]}`;
}

export function getFileExtension(fileName: string): string {
	return "." + fileName.split(".").pop()?.toLowerCase();
}

export function sanitizeFileName(fileName: string): string {
	return fileName;
}
