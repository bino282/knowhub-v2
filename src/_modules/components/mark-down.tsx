import rangeParser from "parse-numeric-range";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import SyntaxHighlighter, { supportedLanguages } from "./synstax-high-ligher";
import CopyCodeButton from "./copy-code";

export const MarkdownComponents: object = {
  code: (() => {
    let newHasLang = "";

    // eslint-disable-next-line react/display-name
    return function ({ node, className, ...props }: any) {
      const isInline = !props.children?.includes("\n");

      if (isInline) {
        return (
          <code
            className="not-prose rounded-sm bg-[#fdeeda] px-1 py-[2px] text-[16px] font-medium text-[#eea123] dark:bg-[#564328] "
            {...props}
          />
        );
      }

      const hasLang =
        /language-(\w+)/.exec(className || "")?.[1] ?? "javascript";
      newHasLang = supportedLanguages.includes(hasLang)
        ? hasLang
        : "javascript";

      const hasMeta = node?.data?.meta;

      const applyHighlights = (applyHighlights: number): any => {
        if (hasMeta) {
          const RE = /{([\d,-]+)}/;
          const metadata = node.data.meta?.replace(/\s/g, "");
          const strlineNumbers = RE?.test(metadata)
            ? RE?.exec(metadata)?.[1]
            : "0";
          const highlightLines = rangeParser(strlineNumbers as any);
          const highlight = highlightLines;
          const data = highlight.includes(applyHighlights) ? "highlight" : null;

          return { data };
        } else {
          return {};
        }
      };

      return (
        <div className="relative my-4 block rounded-md">
          <div className="flex justify-between rounded-t-sm bg-[#2f2f2f] px-2 py-1.5">
            <span className="not-prose text-xs text-white">{hasLang}</span>
            <CopyCodeButton content={props.children} />
          </div>
          <SyntaxHighlighter
            language={newHasLang}
            PreTag="pre"
            className={`codeStyle text-md! !my-0 rounded-b-sm rounded-t-none`}
            showLineNumbers={false}
            wrapLines={hasMeta}
            useInlineStyles={true}
            lineProps={applyHighlights}
            style={vscDarkPlus}
            showInlineLineNumbers={true}
            codeTagProps={{ style: { fontSize: 14 } }}
          >
            {props.children}
          </SyntaxHighlighter>

          <div className="absolute right-1.5 top-1.5"></div>
        </div>
      );
    };
  })(),
};
