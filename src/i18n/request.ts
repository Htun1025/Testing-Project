
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const locales = ["eng", "mm", "jap", "china"] as const;

export default getRequestConfig(async () => {
  const cookieStore = await cookies();

  const savedLocale = cookieStore.get("NEXT_LOCALE")?.value;

  const locale = locales.includes(
    savedLocale as (typeof locales)[number],
  )
    ? (savedLocale as (typeof locales)[number])
    : "eng";

  const messages = (
    await import(`../../messages/${locale}.json`)
  ).default;

  return {
    locale,
    messages,
  };
});
