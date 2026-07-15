import { z } from "zod";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FILE_TYPES = ["application/zip", "application/x-rar-compressed", "application/x-7z-compressed"];
const ALLOWED_EXTENSIONS = [".zip", ".rar", ".7z"];

const projectLinkSchema = z
	.string()
	.trim()
	.optional()
	.refine(
		(value) => !value || URL.canParse(value),
		"Project link must be a valid URL"
	);

const fileSchema = z
	.instanceof(File)
	.refine(
		(file) => file.size <= MAX_FILE_SIZE,
		`File size must be at most 50MB`
	)
	.refine(
		(file) => {
			const extension = "." + file.name.split(".").pop()?.toLowerCase();
			return ALLOWED_EXTENSIONS.includes(extension);
		},
		"Only .zip, .rar, and .7z files are allowed"
	);

const serverFileSchema = fileSchema.refine(
	(file) => ALLOWED_FILE_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes("." + file.name.split(".").pop()?.toLowerCase()),
	"Invalid file type"
);

export const homeworkUploadSchema = z.object({
	fullName: z
		.string()
		.min(1, "Full name is required")
		.min(3, "Full name must be at least 3 characters")
		.max(100, "Full name must be at most 100 characters")
		.transform((val) => val.trim()),
	homework: z
		.string()
		.min(1, "Homework is required")
		.min(2, "Homework must be at least 2 characters")
		.max(100, "Homework must be at most 100 characters")
		.transform((val) => val.trim()),
	group: z
		.string()
		.min(1, "Group is required")
		.min(2, "Group must be at least 2 characters")
		.max(50, "Group must be at most 50 characters")
		.transform((val) => val.trim()),
	projectLink: projectLinkSchema,
	file: fileSchema.optional(),
});

export type HomeworkUploadFormData = z.infer<typeof homeworkUploadSchema>;

export const serverHomeworkUploadSchema = z.object({
	fullName: z
		.string()
		.min(1, "Full name is required")
		.min(3, "Full name must be at least 3 characters")
		.max(100, "Full name must be at most 100 characters")
		.trim(),
	homework: z
		.string()
		.min(1, "Homework is required")
		.min(2, "Homework must be at least 2 characters")
		.max(100, "Homework must be at most 100 characters")
		.trim(),
	group: z
		.string()
		.min(1, "Group is required")
		.min(2, "Group must be at least 2 characters")
		.max(50, "Group must be at most 50 characters")
		.trim(),
	projectLink: projectLinkSchema,
	file: serverFileSchema.optional(),
});

export type ServerHomeworkUploadData = z.infer<typeof serverHomeworkUploadSchema>;
