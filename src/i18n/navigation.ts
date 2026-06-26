import { createNavigation } from "next-intl/navigation";

export const {
	Link,
	redirect,
	usePathname,
	useRouter,
	permanentRedirect,
	getPathname,
} = createNavigation();