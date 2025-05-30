import KnowledgeDetailPage from "@/_modules/knowledge-detail";
import { getAllFileDatasets } from "@/app/actions/file-dataset";
import { FileInfo } from "@/types/database.type";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>; // dynamic route params
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>; // query params
}) {
  const query = await searchParams;
  const page = query.page || "1";
  const name = query.name || "";

  const { id } = await params;

  const respon = await getAllFileDatasets({
    datasetId: id,
    page: Number(page),
    name: typeof name === "string" ? name : "",
  });
  const listFile = (respon.data.docs as FileInfo[]) || [];

  return <KnowledgeDetailPage listFile={listFile} />;
}
