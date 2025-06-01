import React, { JSX } from "react";
import { Check, Clipboard } from "lucide-react";

type CopyButtonProps = {
  content: string;
};

/**
 * Copy button component
 * @param {CopyButtonProps} props
 * @return {JSX.Element} The email with copy button.
 */
export default function CopyCodeButton(props: CopyButtonProps): JSX.Element {
  const { content } = props;
  const [checked, setChecked] = React.useState<boolean>(false);

  return (
    <div
      className="flex cursor-pointer items-center gap-1 px-2"
      onClick={async () => {
        setChecked(true);

        await navigator.clipboard.writeText(content);

        setTimeout(() => {
          setChecked(false);
        }, 1000);
      }}
    >
      {checked ? (
        <>
          <Check size={14} className={"text-white"} />
          <span className="not-prose text-xs text-gray-100">Copied!</span>
        </>
      ) : (
        <>
          <Clipboard size={14} className={"text-white"} />
          <span className="not-prose text-xs text-gray-100">Copy code</span>
        </>
      )}
    </div>
  );
}
