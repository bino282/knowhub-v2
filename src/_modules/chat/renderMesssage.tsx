// import { AlertCircle } from "lucide-react";
// import {
//   Tooltip,
//   TooltipTrigger,
//   TooltipContent,
//   TooltipProvider,
// } from "@/components/ui/tooltip";
// import Image from "next/image";

// export function renderTextWithReferences(
//   text: string,
//   reference?: {
//     chunks: {
//       vector_similarity: number;
//       content: string;
//       image_id?: string;
//     }[];
//   }
// ): React.ReactNode {
//   const ref =
//     typeof reference === "object" && reference !== null
//       ? reference
//       : JSON.parse(reference || "{}");

//   const parts: React.ReactNode[] = [];
//   const regex = /(.*?)(##\d+\$\$(?:\s*##\d+\$\$)*)/g;
//   let lastIndex = 0;
//   let match;

//   while ((match = regex.exec(text)) !== null) {
//     const [fullMatch, normalText, refGroup] = match;

//     // Push phần text trước ref
//     if (normalText) parts.push(normalText);

//     // Tách từng mã tham chiếu trong group
//     const refMatches = [...refGroup.matchAll(/##(\d+)\$\$/g)];

//     const tooltips = refMatches.map((refMatch) => {
//       const index = parseInt(refMatch[1], 10);
//       const chunk = ref?.chunks?.[index];
//       if (!chunk?.content && !chunk?.image_id) return null;

//       return (
//         <TooltipProvider key={index}>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <span className="inline-block text-blue-500 cursor-pointer mx-1 align-middle">
//                 <AlertCircle className="inline w-4 h-4" />
//               </span>
//             </TooltipTrigger>
//             <TooltipContent className="max-w-xs whitespace-pre-line">
//               {chunk.image_id ? (
//                 <Image
//                   src={chunk.image_id}
//                   alt="Reference Image"
//                   width={200}
//                   height={200}
//                   className="mb-2 rounded-md"
//                 />
//               ) : (
//                 <p className="text-sm">{chunk.content}</p>
//               )}
//             </TooltipContent>
//           </Tooltip>
//         </TooltipProvider>
//       );
//     });

//     parts.push(...tooltips.filter(Boolean));
//     lastIndex = regex.lastIndex;
//   }

//   // Push phần còn lại sau cùng nếu có
//   if (lastIndex < text.length) {
//     parts.push(text.slice(lastIndex));
//   }

//   return <span>{parts}</span>;
// }
// import { AlertCircle } from "lucide-react";
// import {
//   Tooltip,
//   TooltipTrigger,
//   TooltipContent,
//   TooltipProvider,
// } from "@/components/ui/tooltip";
// import Image from "next/image";

// export function renderTextWithReferences(
//   text: string,
//   reference?: {
//     chunks: {
//       vector_similarity: number;
//       content: string;
//       image_id?: string;
//     }[];
//   }
// ): React.ReactNode {
//   const ref =
//     typeof reference === "object" && reference !== null
//       ? reference
//       : JSON.parse(reference || "{}");

//   const parts: React.ReactNode[] = [];

//   const regex = /##(\d+)\$\$/g;
//   let lastIndex = 0;
//   let match;

//   while ((match = regex.exec(text)) !== null) {
//     const index = match.index;
//     const refIndex = parseInt(match[1], 10);

//     // Push text từ cuối đoạn trước đến trước đoạn match
//     if (lastIndex < index) {
//       parts.push(text.slice(lastIndex, index));
//     }

//     const chunk = ref?.chunks?.[refIndex];
//     if (chunk?.content || chunk?.image_id) {
//       parts.push(
//         <TooltipProvider key={refIndex}>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <span className="inline-block text-blue-500 cursor-pointer mx-1 align-middle">
//                 <AlertCircle className="inline w-4 h-4" />
//               </span>
//             </TooltipTrigger>
//             <TooltipContent className="max-w-xs whitespace-pre-line">
//               {chunk.image_id ? (
//                 <Image
//                   src={chunk.image_id}
//                   alt="Reference Image"
//                   width={200}
//                   height={200}
//                   className="mb-2 rounded-md"
//                 />
//               ) : (
//                 <p className="text-sm">{chunk.content}</p>
//               )}
//             </TooltipContent>
//           </Tooltip>
//         </TooltipProvider>
//       );
//     }

//     lastIndex = regex.lastIndex;
//   }

//   // Push phần còn lại sau tất cả các ref
//   if (lastIndex < text.length) {
//     parts.push(text.slice(lastIndex));
//   }

//   return <span>{parts}</span>;
// }
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import Image from "next/image";
import Link from "next/link";

interface MarkdownWithReferencesProps {
  content: string;
  references: any;
}

export function MarkdownWithReferences({
  content,
  references,
}: MarkdownWithReferencesProps) {
  const [showModal, setShowModal] = React.useState(false);
  const ref =
    typeof references === "object" && references !== null
      ? references
      : JSON.parse(references || "{}");
  const transformed = content.replace(/##(\d+)\$\$/g, (_, index) => {
    return `<span data-ref-index="${index}"></span>`;
  });

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        span: ({
          children,
          ...props
        }: React.HTMLAttributes<HTMLSpanElement> & {
          ["data-ref-index"]?: string;
        }) => {
          const indexAttr = props["data-ref-index"];

          // Nếu không có attribute data-ref-index thì render bình thường
          if (typeof indexAttr === "undefined") {
            return <span {...props}>{children}</span>;
          }

          // Nếu có, lấy chunk tương ứng
          const index = Number(indexAttr);
          const chunk = ref.chunks?.[index];
          if (!chunk) return null;
          const urlImage = "https://chatntq.ntq.ai/v1/document/image/";

          return (
            <span className=" text-white font-semibold rounded inline-flex items-center">
              <span className="-mb-3"></span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-blue-300 cursor-pointer ml-1">
                      <AlertCircle className="inline w-4 h-4" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-3xl w-full ">
                    <div className="flex gap-2 p-2">
                      {chunk.image_id && (
                        <div className="relative group ">
                          <Link
                            href={`${urlImage}${chunk.image_id}`}
                            target="_blank"
                          >
                            <Image
                              src={`${urlImage}${chunk.image_id}`}
                              width={200}
                              height={200}
                              alt={`Reference Image ${index}`}
                              className="mb-2 rounded-md max-w-full object-cover"
                            />
                          </Link>

                          <div className="absolute bottom-0 right-full hidden group-hover:block z-50 w-[600px] aspect-square pr-10">
                            <Image
                              src={`${urlImage}${chunk.image_id}`}
                              width={400}
                              height={400}
                              alt={`Zoomed Image ${index}`}
                              className="rounded-md shadow-lg object-contain size-full"
                            />
                          </div>
                        </div>
                      )}
                      <p className="flex-1">{chunk.content}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          );
        },
      }}
    >
      {transformed}
    </ReactMarkdown>
  );
}
