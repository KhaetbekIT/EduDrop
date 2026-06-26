"use client";

import { useLocale, useTranslations, type Locale } from "next-intl";
import { Link, usePathname } from "$/i18n/navigation";

export function LanguageSwitcher() {
	const pathname = usePathname();
	const t = useTranslations("LanguageSwitcher");
	const locale = useLocale();

	return (
		<div className="flex gap-2">
			<Link
					href={pathname}
					locale={"ru"}
					className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
						 locale === "ru"
							? "bg-blue-600 text-white shadow-md"
							: "bg-slate-200 text-slate-700 hover:bg-slate-300"
					}`}
					aria-label={t(locale as Locale)}
					aria-current={locale === "ru" ? "page" : undefined}
				>
					RU
				</Link>

				<Link
					href={pathname}
					locale={"uz"}
					className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
						locale === "uz"
							? "bg-blue-600 text-white shadow-md"
							: "bg-slate-200 text-slate-700 hover:bg-slate-300"
					}`}
					aria-label={t(locale as Locale)}
					aria-current={locale === "uz" ? "page" : undefined}
				>
					UZ
				</Link>
		</div>
	);
}
