import KnowledgeDetailPage from "@/_modules/knowledge-detail";
import { getAllFileDatasets } from "@/app/actions/file-dataset";
import { getDictionary, Locale } from "@/i18n";
import { FileInfo } from "@/types/database.type";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; lang: Locale }>; // dynamic route params
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>; // query params
}) {
  const query = await searchParams;
  const page = query.page || "1";
  const name = query.name || "";

  const { id, lang } = await params;
  const dictionary = await getDictionary(lang);

  const respon = await getAllFileDatasets({
    datasetId: id,
  });
  const listFile = (respon.data.docs as FileInfo[]) || [];

  return (
    <KnowledgeDetailPage initialListFile={listFile} dictionary={dictionary} />
  );
}
