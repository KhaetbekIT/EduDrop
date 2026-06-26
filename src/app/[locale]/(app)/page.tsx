import type { PageProps } from "$/types/components.type";
import { setRequestLocale } from "next-intl/server";
import { AppContent } from "./_components/app-content";

const Page = async ({ params }: PageProps) => {
	const { locale } = await params;
	setRequestLocale(locale);

	return <AppContent />;
};

export default Page;