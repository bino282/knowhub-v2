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
//   const regex = /##(\d+)\$\$\./g;
//   let lastIndex = 0;
//   let match;

//   while ((match = regex.exec(text)) !== null) {
//     const index = parseInt(match[1], 10);
//     const matchStart = match.index;
//     const matchEnd = regex.lastIndex;

//     // Push text before match
//     if (lastIndex < matchStart) {
//       parts.push(text.slice(lastIndex, matchStart));
//     }

//     const chunk = ref?.chunks?.[index];

//     // Chỉ render Tooltip nếu có content hoặc image
//     if (chunk?.content || chunk?.image_id) {
//       parts.push(
//         <TooltipProvider key={matchStart}>
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

//     // Nếu không có content/image → không render gì tại vị trí đó
//     lastIndex = matchEnd;
//   }

//   // Push phần còn lại của text
//   if (lastIndex < text.length) {
//     parts.push(text.slice(lastIndex));
//   }

//   return <span>{parts}</span>;
// }
import { AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import Image from "next/image";

export function renderTextWithReferences(
  text: string,
  reference?: {
    chunks: {
      vector_similarity: number;
      content: string;
      image_id?: string;
    }[];
  }
): React.ReactNode {
  const ref =
    typeof reference === "object" && reference !== null
      ? reference
      : JSON.parse(reference || "{}");

  const parts: React.ReactNode[] = [];
  const regex = /(.*?)(##\d+\$\$(?:\s*##\d+\$\$)*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const [fullMatch, normalText, refGroup] = match;

    // Push phần text trước ref
    if (normalText) parts.push(normalText);

    // Tách từng mã tham chiếu trong group
    const refMatches = [...refGroup.matchAll(/##(\d+)\$\$/g)];

    const tooltips = refMatches.map((refMatch) => {
      const index = parseInt(refMatch[1], 10);
      const chunk = ref?.chunks?.[index];
      if (!chunk?.content && !chunk?.image_id) return null;

      return (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-block text-blue-500 cursor-pointer mx-1 align-middle">
                <AlertCircle className="inline w-4 h-4" />
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs whitespace-pre-line">
              {chunk.image_id ? (
                <Image
                  src={chunk.image_id}
                  alt="Reference Image"
                  width={200}
                  height={200}
                  className="mb-2 rounded-md"
                />
              ) : (
                <p className="text-sm">{chunk.content}</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    });

    parts.push(...tooltips.filter(Boolean));
    lastIndex = regex.lastIndex;
  }

  // Push phần còn lại sau cùng nếu có
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <span>{parts}</span>;
}
