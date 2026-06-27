const TELEGRAM_API_URL = "https://api.telegram.org";

interface TelegramApiResponse {
	ok: boolean;
	result?: Record<string, unknown>;
	error_code?: number;
	description?: string;
}

async function callTelegramApi(
	method: string,
	payload: Record<string, unknown>,
	file?: Buffer | File
): Promise<TelegramApiResponse> {
	const botToken = process.env.TELEGRAM_BOT_TOKEN;

	if (!botToken) {
		throw new Error("TELEGRAM_BOT_TOKEN is not configured");
	}

	const url = `${TELEGRAM_API_URL}/bot${botToken}/${method}`;

	try {
		let body: FormData | string;
		let headers: Record<string, string> = {};

		if (file) {
			const formData = new FormData();
			for (const [key, value] of Object.entries(payload)) {
				if (value !== undefined && value !== null && key !== "filename") {
					formData.append(key, String(value));
				}
			}
			const filename =
				typeof payload.filename === "string" && payload.filename
					? payload.filename
					: file instanceof File
						? file.name
						: "file";
			const uploadFile = Buffer.isBuffer(file)
				? new Blob([new Uint8Array(file)])
				: file;
			formData.append("document", uploadFile, filename);
			body = formData;
		} else {
			body = JSON.stringify(payload);
			headers["Content-Type"] = "application/json";
		}

		const response = await fetch(url, {
			method: "POST",
			headers,
			body,
		});

		if (!response.ok) {
			const errorData = (await response.json()) as TelegramApiResponse;
			throw new Error(
				`Telegram API error: ${errorData.description || response.statusText}`
			);
		}

		return (await response.json()) as TelegramApiResponse;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Telegram API call failed: ${error.message}`);
		}
		throw error;
	}
}

export async function sendTelegramMessage(
	text: string,
	parseMode: "HTML" | "Markdown" = "HTML"
): Promise<void> {
	const chatId = process.env.TELEGRAM_CHAT_ID;

	if (!chatId) {
		throw new Error("TELEGRAM_CHAT_ID is not configured");
	}

	const response = await callTelegramApi("sendMessage", {
		chat_id: chatId,
		text,
		parse_mode: parseMode,
	});

	if (!response.ok) {
		throw new Error(
			`Failed to send Telegram message: ${response.description || "Unknown error"}`
		);
	}
}

export async function sendTelegramDocument(
	file: Buffer | File,
	fileName: string,
	caption?: string
): Promise<void> {
	const chatId = process.env.TELEGRAM_CHAT_ID;

	if (!chatId) {
		throw new Error("TELEGRAM_CHAT_ID is not configured");
	}

	const payload: Record<string, unknown> = {
		chat_id: chatId,
		filename: fileName,
	};

	if (caption) {
		payload.caption = caption;
		payload.parse_mode = "HTML";
	}

	const response = await callTelegramApi("sendDocument", payload, file);

	if (!response.ok) {
		throw new Error(
			`Failed to send Telegram document: ${response.description || "Unknown error"}`
		);
	}
}

export async function sendHomeworkNotification(
	fullName: string,
	group: string,
	fileName: string,
	fileSize: number
): Promise<void> {
	const message = `📚 <b>Проверка ДЗ</b>

👤 <b>ФИО:</b> ${escapeHtml(fullName)}

🎓 <b>Группа:</b> ${escapeHtml(group)}

📄 <b>Файл:</b> ${escapeHtml(fileName)}

💾 <b>Размер:</b> ${formatFileSize(fileSize)}

⏰ <b>Отправлено:</b> ${new Date().toLocaleString("ru-RU")}`;

	await sendTelegramMessage(message);
}

function escapeHtml(text: string): string {
	const map: Record<string, string> = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#039;",
	};
	return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

function formatFileSize(bytes: number): string {
	const units = ["B", "KB", "MB"];
	let size = bytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return `${size.toFixed(2)} ${units[unitIndex]}`;
}
