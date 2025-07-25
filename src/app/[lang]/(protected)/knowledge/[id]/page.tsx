import KnowledgeDetailPage from "@/_modules/knowledge-detail";
import { getDictionary, Locale } from "@/i18n";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>; // dynamic route params
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <KnowledgeDetailPage dictionary={dictionary} />;
}
