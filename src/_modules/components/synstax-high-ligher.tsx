import { PrismLight } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import csharp from "react-syntax-highlighter/dist/cjs/languages/prism/csharp";
import css from "react-syntax-highlighter/dist/cjs/languages/prism/css";
import java from "react-syntax-highlighter/dist/cjs/languages/prism/java";
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import jsx from "react-syntax-highlighter/dist/cjs/languages/prism/jsx";
import markdown from "react-syntax-highlighter/dist/cjs/languages/prism/markdown";
import php from "react-syntax-highlighter/dist/cjs/languages/prism/php";
import python from "react-syntax-highlighter/dist/cjs/languages/prism/python";
import scss from "react-syntax-highlighter/dist/cjs/languages/prism/scss";
import sql from "react-syntax-highlighter/dist/cjs/languages/prism/sql";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";

PrismLight.registerLanguage("tsx", tsx);
PrismLight.registerLanguage("typescript", typescript);
PrismLight.registerLanguage("scss", scss);
PrismLight.registerLanguage("bash", bash);
PrismLight.registerLanguage("markdown", markdown);
PrismLight.registerLanguage("json", json);
PrismLight.registerLanguage("java", java);
PrismLight.registerLanguage("csharp", csharp);
PrismLight.registerLanguage("python", python);
PrismLight.registerLanguage("php", php);
PrismLight.registerLanguage("javascript", javascript);
PrismLight.registerLanguage("sql", sql);
PrismLight.registerLanguage("css", css);
PrismLight.registerLanguage("html", tsx);
PrismLight.registerLanguage("jsx", jsx);

export const supportedLanguages = [
  "tsx",
  "typescript",
  "scss",
  "bash",
  "markdown",
  "json",
  "java",
  "csharp",
  "python",
  "php",
  "javascript",
  "sql",
  "typescript",
  "css",
  "html",
  "jsx",
];

const SyntaxHighlighter = PrismLight;

export default SyntaxHighlighter;
