import { locales } from "$/configs/i18n.config";
import type { LayoutProps } from "$/types/components.type";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

const LocaleLayout = async ({ children, params }: LayoutProps) => {
	const { locale } = await params;
	setRequestLocale(locale);

	if (!hasLocale(locales, locale)) {
		return notFound();
	}

	return (
		<html
			lang={locale}
			translate="no"
			className={"scroll-smooth"}
			data-scroll-behavior="smooth"
			prefix="og: https://ogp.me/ns#"
		>
			<head>
				<meta name="apple-mobile-web-app-title" content="EduDrop" />
			</head>
			<body
				data-scroll="false"
				className={"flex flex-col justify-between"}
			>
				<NextIntlClientProvider>
					{children}
				</NextIntlClientProvider>
			</body>
		</html>
	);
};

export default LocaleLayout;