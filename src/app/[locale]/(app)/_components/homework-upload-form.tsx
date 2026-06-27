"use client";

import { useState, useCallback, useRef, type DragEvent, type ChangeEvent, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { homeworkUploadSchema, type HomeworkUploadFormData } from "$/schemas/homework.schema";
import { formatFileSize } from "$/utils/file";
import type { HomeworkUploadResponse } from "$/types/homework.types";
import { LanguageSwitcher } from "./language-switcher";

export const HomeworkUploadForm = () => {
	const t = useTranslations("HomeworkUpload");
	const [pending, startTransition] = useTransition()
	const [uploadSuccess, setUploadSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [dragActive, setDragActive] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const dragCountRef = useRef(0);

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
		reset,
		setValue,
		watch,
	} = useForm<HomeworkUploadFormData>({
		resolver: zodResolver(homeworkUploadSchema),
		defaultValues: {
			fullName: "",
			group: "",
			file: undefined,
		},
	});

	const selectedFile = watch("file");
	const { ref: registerFileRef, ...fileRegister } = register("file");

	const setFileInputRef = useCallback(
		(element: HTMLInputElement | null) => {
			fileInputRef.current = element;
			if (registerFileRef && typeof registerFileRef === "function") {
				registerFileRef(element);
			}
		},
		[registerFileRef]
	);

	const handleDrag = useCallback(
		(e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();

			if (e.type === "dragenter" || e.type === "dragover") {
				dragCountRef.current += 1;
				setDragActive(true);
			} else if (e.type === "dragleave") {
				dragCountRef.current -= 1;
				if (dragCountRef.current === 0) {
					setDragActive(false);
				}
			}
		},
		[]
	);

	const handleSetFile = useCallback((file: File | null) => {
		if (!file) {
			setValue("file", undefined as unknown as File, {
				shouldValidate: true,
				shouldDirty: true,
			});
			setErrorMessage("");
			return;
		}

		setValue("file", file, {
			shouldValidate: true,
			shouldDirty: true,
		});
		setErrorMessage("");
	}, [setValue]);

	const handleDrop = useCallback(
		(e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setDragActive(false);
			dragCountRef.current = 0;

			const files = e.dataTransfer.files;
			if (files && files.length > 0) {
				handleSetFile(files.item(0));
			}
		},
		[handleSetFile]
	);

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			handleSetFile(files.item(0));
		}
	};

	const handleRemoveFile = () => {
		handleSetFile(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleClickUpload = () => {
		fileInputRef.current?.click();
	};

	const onSubmit = (data: HomeworkUploadFormData) => {
		startTransition(async () => {
			try {
				setErrorMessage("");
				setSuccessMessage("");

				const formData = new FormData();
				formData.append("fullName", data.fullName);
				formData.append("group", data.group);
				formData.append("file", data.file, data.file.name);

				const response = await fetch("/api/homework/upload", {
					method: "POST",
					body: formData,
				});

				const result = (await response.json()) as HomeworkUploadResponse;

				if (!response.ok || !result.success) {
					setErrorMessage(result.error?.details || result.message || "Failed to upload homework");
					return;
				}

				setUploadSuccess(true);
				setSuccessMessage(result.message);
				reset();
				if (fileInputRef.current) {
					fileInputRef.current.value = "";
				}

				// Auto-hide success message and reset form after 5 seconds
				setTimeout(() => {
					setUploadSuccess(false);
					setSuccessMessage("");
				}, 5000);
			} catch (error) {
				const errorMsg = error instanceof Error ? error.message : "An error occurred";
				setErrorMessage(errorMsg);
			}
		})
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
			<div className="w-full max-w-md">
				<div className="mb-6 flex justify-end">
					<LanguageSwitcher />
				</div>

				{uploadSuccess && (
					<div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm">
						<div className="flex items-start gap-3">
							<div className="text-emerald-600 text-2xl flex-shrink-0">✓</div>
							<div>
								<h3 className="font-semibold text-emerald-900">{t("success")}</h3>
								<p className="text-emerald-700 text-sm mt-1">{successMessage}</p>
							</div>
						</div>
					</div>
				)}

				<form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl shadow-2xl p-8">
					<h1 className="text-3xl font-bold text-slate-900 mb-2">{t("title")}</h1>
					<p className="text-slate-600 text-sm mb-8">{t("subtitle")}</p>

					{/* Full Name Field */}
					<div className="mb-6">
						<label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">
							{t("fullName")} <span className="text-red-500">*</span>
						</label>
						<input
							{...register("fullName")}
							type="text"
							id="fullName"
							placeholder={t("fullNamePlaceholder")}
							className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-400 text-slate-900"
							aria-describedby={errors.fullName ? "fullName-error" : undefined}
						/>
						{errors.fullName && (
							<p id="fullName-error" className="mt-2 text-sm text-red-500">
								{errors.fullName.message}
							</p>
						)}
					</div>

					{/* Group Field */}
					<div className="mb-6">
						<label htmlFor="group" className="block text-sm font-semibold text-slate-700 mb-2">
							{t("group")} <span className="text-red-500">*</span>
						</label>
						<input
							{...register("group")}
							type="text"
							id="group"
							placeholder={t("groupPlaceholder")}
							className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-400 text-slate-900"
							aria-describedby={errors.group ? "group-error" : undefined}
						/>
						{errors.group && (
							<p id="group-error" className="mt-2 text-sm text-red-500">
								{errors.group.message}
							</p>
						)}
					</div>

					{/* File Upload Area */}
					<div className="mb-6">
						<label htmlFor="file" className="block text-sm font-semibold text-slate-700 mb-3">
							{t("file")} <span className="text-red-500">*</span>
						</label>

						<div
							onDragEnter={handleDrag}
							onDragLeave={handleDrag}
							onDragOver={handleDrag}
							onDrop={handleDrop}
							onClick={handleClickUpload}
							onKeyDown={(event) => {
								if (event.key === "Enter" || event.key === " ") {
									event.preventDefault();
									handleClickUpload();
								}
							}}
							role="button"
							tabIndex={0}
							className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer ${dragActive
								? "border-blue-500 bg-blue-50"
								: "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"
							}`}
						>
							<input
								id="file"
								ref={setFileInputRef}
								{...fileRegister}
								onChange={handleFileChange}
								accept=".zip,.rar,.7z"
								className="sr-only"
								style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
								aria-label={t("fileAriaLabel")}
							/>

							{!selectedFile ? (
								<>
									<div className="pointer-events-none">
										<svg
											className="mx-auto h-12 w-12 text-slate-400 mb-3"
											stroke="currentColor"
											fill="none"
											viewBox="0 0 48 48"
										>
											<path
												d="M28 8H12a4 4 0 00-4 4v24a4 4 0 004 4h24a4 4 0 004-4V20m-20-12v12m0 0l-4-4m4 4l4-4"
												strokeWidth={2}
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
										<p className="text-slate-700 font-medium mb-1">{t("dragDrop")}</p>
										<p className="text-slate-500 text-sm">{t("supportedFormats")}</p>
									</div>

									{/* <button
										type="button"
										onClick={(event) => {
											event.stopPropagation();
											handleClickUpload();
										}}
										className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium text-sm"
									>
										{t("selectFile")}
									</button> */}
								</>
							) : (
								<div className="border-2 border-emerald-300 rounded-2xl bg-emerald-50 p-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3 flex-1 min-w-0">
											<div className="flex-shrink-0 text-emerald-600 text-lg">📦</div>
											<div className="min-w-0 flex-1">
												<p className="font-medium text-slate-900 truncate">{selectedFile?.name ?? t("file")}</p>
												<p className="text-sm text-slate-600">{formatFileSize(selectedFile?.size)}</p>
											</div>
										</div>
										<button
											type="button"
											onClick={(event) => {
												event.stopPropagation();
												handleRemoveFile();
											}}
											className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition ml-3"
											aria-label={t("removeFile")}
										>
											✕
										</button>
									</div>
									<button
										type="button"
										onClick={(event) => {
											event.stopPropagation();
											handleClickUpload();
										}}
										className="mt-3 w-full text-sm text-blue-600 hover:text-blue-700 font-medium transition"
									>
										{t("replaceFile")}
									</button>
								</div>
							)}
						</div>

						{errors.file && (
							<p className="mt-2 text-sm text-red-500">{errors.file.message}</p>
						)}
					</div>

					{/* Error Message */}
					{errorMessage && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
							<div className="flex items-start gap-3">
								<div className="text-red-600 text-lg flex-shrink-0">⚠</div>
								<div>
									<p className="font-medium text-red-900 text-sm">{t("errorTitle")}</p>
									<p className="text-red-700 text-sm mt-1">{errorMessage}</p>
								</div>
							</div>
						</div>
					)}

					{/* Submit Button */}
					<button
						type="submit"
						disabled={pending || !isDirty}
						className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
					>
						{pending && (
							<svg
								className="h-5 w-5 animate-spin"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
						)}
						{pending ? t("uploading") : t("submit")}
					</button>

					<p className="text-xs text-slate-500 text-center mt-4">{t("maxFileSize")}</p>
				</form>
			</div>
		</div>
	);
}
