import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locales } from "$/configs/i18n.config";

export default getRequestConfig(async ({ requestLocale }) => {
	const requested = await requestLocale;
	const locale = hasLocale(locales, requested) ? requested : "ru";

	return {
		locale,
		messages: (await import(`../../messages/${locale}.json`)).default,
	};
});