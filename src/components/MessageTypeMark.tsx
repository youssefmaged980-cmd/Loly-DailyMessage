import { MessageType } from "@/types";

type Props = { type: MessageType; className?: string };

export default function MessageTypeMark({ type, className = "h-5 w-5" }: Props) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  let shape;

  switch (type) {
    case "morning":
      shape = <><path {...common} d="M4 17a8 8 0 0 1 16 0M12 3v2m-7 1 1.5 1.5M3 13h2m14 0h2m-3.5-5.5L19 6" /><path {...common} d="M8 17h8" /></>;
      break;
    case "extra":
      shape = <><rect {...common} x="3" y="5" width="18" height="14" rx="2.5" /><path {...common} d="m4 7 8 6 8-6m-8 10s-2-1.2-2-2.5a1.2 1.2 0 0 1 2-.5 1.2 1.2 0 0 1 2 .5c0 1.3-2 2.5-2 2.5Z" /></>;
      break;
    case "special":
      shape = <><path {...common} d="m12 2 2.6 6.4L21 11l-6.4 2.6L12 20l-2.6-6.4L3 11l6.4-2.6L12 2Z" /><path {...common} d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" /></>;
      break;
    case "apology":
      shape = <><path {...common} d="M12 20s-8-4.6-8-10.3A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 8 2.7C20 15.4 12 20 12 20Z" /><path {...common} d="m8.5 12.5 2.2 2.2 4.8-5" /></>;
      break;
  }

  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>{shape}</svg>;
}
