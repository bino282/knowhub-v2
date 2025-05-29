import KnowledgeDetailPage from "@/_modules/knowledge-detail";
import { getAllFileDatasets } from "@/app/actions/file-dataset";
import { FileInfo } from "@/types/database.type";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string }; // dynamic route params
  searchParams: { [key: string]: string | string[] | undefined }; // query params
}) {
  const page = searchParams.page || "1";
  const name = searchParams.name || "";

  const { id } = params;

  const respon = await getAllFileDatasets({
    datasetId: id,
    page: Number(page),
    name: typeof name === "string" ? name : "",
  });
  const listFile = (respon.data.docs as FileInfo[]) || [];
  const totalPage = respon.data.total as number;

  return <KnowledgeDetailPage listFile={listFile} total={totalPage} />;
}
