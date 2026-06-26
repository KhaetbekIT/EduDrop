import { NextRequest, NextResponse } from "next/server";
import { serverHomeworkUploadSchema } from "$/schemas/homework.schema";
import { sendHomeworkNotification, sendTelegramDocument } from "$/lib/telegram";
import { generateUploadId } from "$/utils/file";
import { getErrorMessage, getErrorCode, TelegramError, FileError } from "$/utils/errors";
import type { HomeworkUploadResponse } from "$/types/homework.types";

export async function POST(request: NextRequest): Promise<NextResponse<HomeworkUploadResponse>> {
	try {
		const formData = await request.formData();

		const fullName = formData.get("fullName");
		const group = formData.get("group");
		const file = formData.get("file");

		// Validate required fields
		if (typeof fullName !== "string" || typeof group !== "string" || !(file instanceof File)) {
			return NextResponse.json(
				{
					success: false,
					message: "Missing required fields",
					error: {
						code: "INVALID_REQUEST",
						details: "fullName, group, and file are required",
					},
				},
				{ status: 400 }
			);
		}

		// Validate using schema
		const validationResult = await serverHomeworkUploadSchema.safeParseAsync({
			fullName,
			group,
			file,
		});

		if (!validationResult.success) {
			const errorMessages = validationResult.error.issues
				.map((issue) => issue.message)
				.join(", ");

			return NextResponse.json(
				{
					success: false,
					message: "Validation failed",
					error: {
						code: "VALIDATION_ERROR",
						details: errorMessages,
					},
				},
				{ status: 400 }
			);
		}

		const { fullName: validatedName, group: validatedGroup, file: validatedFile } = validationResult.data;

		const uploadId = generateUploadId();
		const originalFileName = validatedFile.name;
		const fileSize = validatedFile.size;

		// Send notification and file to Telegram
		try {
			await sendHomeworkNotification(
				validatedName,
				validatedGroup,
				originalFileName,
				fileSize
			);
			await sendTelegramDocument(validatedFile, originalFileName);
		} catch (telegramError) {
			const errorMessage = telegramError instanceof Error ? telegramError.message : "Failed to send to Telegram";
			console.error("Telegram error:", errorMessage);

			return NextResponse.json(
				{
					success: false,
					message: "Failed to process submission",
					error: {
						code: "TELEGRAM_ERROR",
						details: "Could not send submission to Telegram. Please try again.",
					},
				},
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{
				success: true,
				message: "Homework submitted successfully",
				data: {
					id: uploadId,
					fullName: validatedName,
					group: validatedGroup,
					fileName: originalFileName,
					fileSize,
					uploadedAt: new Date().toISOString(),
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Upload error:", error);

		const errorMessage = getErrorMessage(error);
		const errorCode = getErrorCode(error);

		return NextResponse.json(
			{
				success: false,
				message: "Server error occurred",
				error: {
					code: errorCode,
					details: errorMessage,
				},
			},
			{ status: 500 }
		);
	}
}
