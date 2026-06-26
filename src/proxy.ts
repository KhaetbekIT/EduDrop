import createMiddleware from "next-intl/middleware";
import { locales,defaultLocale } from "$/configs/i18n.config";
import type { NextRequest } from "next/server";

export const intlMiddleware = createMiddleware({
	locales,
	defaultLocale,
	localePrefix: { mode: "as-needed" },
	localeDetection: false,
});

export const proxy = async (request: NextRequest) => {
	return intlMiddleware(request);
}


export const config = {
	matcher: [
		"/((?!api|_next|_vercel|favicon.ico|manifest.webmanifest|.*\\..*).*)",
	],
};