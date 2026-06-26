export class ValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ValidationError";
	}
}

export class TelegramError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "TelegramError";
	}
}

export class FileError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "FileError";
	}
}

export function getErrorMessage(error: unknown): string {
	if (error instanceof ValidationError) {
		return error.message;
	}
	if (error instanceof TelegramError) {
		return "Failed to send to Telegram. Please try again.";
	}
	if (error instanceof FileError) {
		return error.message;
	}
	if (error instanceof Error) {
		return error.message;
	}
	return "An unknown error occurred";
}

export function getErrorCode(error: unknown): string {
	if (error instanceof ValidationError) {
		return "VALIDATION_ERROR";
	}
	if (error instanceof TelegramError) {
		return "TELEGRAM_ERROR";
	}
	if (error instanceof FileError) {
		return "FILE_ERROR";
	}
	return "UNKNOWN_ERROR";
}
