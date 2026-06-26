import type { Locale } from "next-intl";
import type { FC, ReactNode } from "react";

type SearchParams = { [key: string]: string | string[] | undefined };

interface ParamsWithLocale {
	locale: Locale;
	[key: string]: string;
}

export interface PageProps<Params extends ParamsWithLocale = ParamsWithLocale> {
	params: Promise<Params>;
	searchParams: Promise<SearchParams>;
}

export interface LayoutProps<
	Params extends ParamsWithLocale = ParamsWithLocale,
> {
	params: Promise<Params>;
	children: ReactNode;
}

export type ErrorRouteComponent = FC<{
	error: Error;
	reset: () => void;
}>;

export interface DynamicMetadata<
	Params extends ParamsWithLocale = ParamsWithLocale,
	SearchParams extends object = object,
> {
	params: Promise<Params>;
	searchParams: Promise<SearchParams>;
}