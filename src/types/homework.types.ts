export interface HomeworkUploadResponse {
	success: boolean;
	message: string;
	data?: {
		id: string;
		fullName: string;
		group: string;
		fileName: string;
		fileSize: number;
		uploadedAt: string;
	};
	error?: {
		code: string;
		details: string;
	};
}

export interface TelegramMessagePayload {
	chat_id: string | number;
	text: string;
	parse_mode?: "HTML" | "Markdown";
}

export interface TelegramDocumentPayload {
	chat_id: string | number;
	document: Buffer;
	filename: string;
	caption?: string;
	parse_mode?: "HTML" | "Markdown";
}

export interface FileUploadRequest {
	fullName: string;
	group: string;
	file: File;
}
