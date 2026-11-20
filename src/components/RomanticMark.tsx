import { EnvelopeIcon } from "@/types";

type Props = { kind: EnvelopeIcon; className?: string };

export default function RomanticMark({ kind, className = "h-6 w-6" }: Props) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  let artwork;
  switch (kind) {
    case "sun":
      artwork = <><path {...common} d="M12 18.5a6.5 6.5 0 1 1 6.3-8.1" /><path {...common} d="M12 2.5v2M4.9 5.4l1.4 1.4M2 12h2M5 19l1.4-1.4M12 22v-2" /><path {...common} d="m14.5 13.5 2.1 2.1 4-4" /></>;
      break;
    case "heartWithArrow":
      artwork = <><path {...common} d="M12 20s-8.5-4.9-8.5-11a4.5 4.5 0 0 1 8.5-2 4.5 4.5 0 0 1 8.5 2C20.5 15.1 12 20 12 20Z" /><path {...common} d="m5 18 14-12m-4 0h4v4" /></>;
      break;
    case "giftHeart":
      artwork = <><path {...common} d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13" /><path {...common} d="M12 7c-5 0-6-5-3.3-5C11 2 12 7 12 7Zm0 0c5 0 6-5 3.3-5C13 2 12 7 12 7Z" /></>;
      break;
    case "rose":
      artwork = <><path {...common} d="M12 21V10m0 4c-4-1-5-4-5-6 3 0 5 2 5 6Zm0 3c4-1 5-4 5-6-3 0-5 2-5 6Z" /><path {...common} d="M12 10c-4-1-5-6 0-8 5 2 4 7 0 8Zm0-1c-2-2-2-4 0-6 2 2 2 4 0 6Z" /></>;
      break;
    case "bouquet":
    case "lily":
      artwork = <><path {...common} d="M12 21V11m0 5c-3-3-5-3-7-2 1 3 3 4 7 3m0-1c3-3 5-3 7-2-1 3-3 4-7 3" /><path {...common} d={kind === "lily" ? "M12 11c-2-2-5-5-2-8l2 3 2-3c3 3 0 6-2 8Zm0 0c-3 0-7-1-6-5l4 1 2-3 2 3 4-1c1 4-3 5-6 5Z" : "M7 10c-3 0-4-4-1-5 2 0 3 2 3 4m3 1c-2-2-1-6 2-6s4 4 1 6m2 1c0-3 2-5 4-3s0 6-3 5m-8-2c-2 2-6 1-5-2 1-2 4-2 6 0"} /></>;
      break;
    case "infinity":
      artwork = <><path {...common} d="M12 12c-2.1-2.4-4-4-6-4a4 4 0 0 0 0 8c2 0 3.9-1.6 6-4Zm0 0c2.1-2.4 4-4 6-4a4 4 0 0 1 0 8c-2 0-3.9-1.6-6-4Z" /><path {...common} d="M12 12c-2.1-2.4-4-4-6-4m6 4c2.1 2.4 4 4 6 4" /></>;
      break;
    case "rings":
      artwork = <><circle {...common} cx="9" cy="14" r="6" /><circle {...common} cx="15" cy="14" r="6" /><path {...common} d="m9 2 2 3-2 3-2-3 2-3Zm6 0 2 3-2 3-2-3 2-3Z" /></>;
      break;
    case "ribbon":
      artwork = <><path {...common} d="m12 12 8-7v7l-8 2-8-2V5l8 7Zm0 0-5 9 5-2 5 2-5-9Z" /><circle {...common} cx="12" cy="12" r="2" /></>;
      break;
    case "dove":
      artwork = <><path {...common} d="M3 14c4-1 6-5 9-8 1 3 3 4 7 4l2 3-4 1-3 5-3-4-5 1-3-2Z" /><path {...common} d="m8 13 5-3m-1 5 3-3m2-5 2-3" /><circle cx="17" cy="11" r=".7" fill="currentColor" /></>;
      break;
    case "couple":
      artwork = <><path {...common} d="M12 20S4 15.3 4 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.3 12 20 12 20Z" /><path {...common} d="M8 12c1.5-2 4.5-2 6 0s4.5 2 6 0" /></>;
      break;
    case "handsHeart":
      artwork = <><path {...common} d="M12 14s-4-2.3-4-5a2.2 2.2 0 0 1 4-1 2.2 2.2 0 0 1 4 1c0 2.7-4 5-4 5Z" /><path {...common} d="M3 13c2-1 4 0 6 2l3 2 3-2c2-2 4-3 6-2l-4 6H7l-4-6Z" /></>;
      break;
    case "loveLetter":
      artwork = <><rect {...common} x="3" y="5" width="18" height="14" rx="2.5" /><path {...common} d="m4 7 8 6 8-6" /><path {...common} d="M12 18s-3-1.7-3-3.7a1.7 1.7 0 0 1 3-.7 1.7 1.7 0 0 1 3 .7c0 2-3 3.7-3 3.7Z" /></>;
      break;
    case "sparklingHeart":
      artwork = <><path {...common} d="M12 20s-8-4.6-8-10.3A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 8 2.7C20 15.4 12 20 12 20Z" /><path {...common} d="m4 3 .6 1.4L6 5l-1.4.6L4 7l-.6-1.4L2 5l1.4-.6L4 3Zm16 11 .6 1.4L22 16l-1.4.6L20 18l-.6-1.4L18 16l1.4-.6L20 14Z" /></>;
      break;
    case "heart":
    default:
      artwork = <><path {...common} d="M12 20s-8.5-4.9-8.5-11a4.5 4.5 0 0 1 8.5-2 4.5 4.5 0 0 1 8.5 2C20.5 15.1 12 20 12 20Z" /><path {...common} d="M7 10c1 2 2.5 3.5 5 5 2.5-1.5 4-3 5-5" /></>;
  }

  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>{artwork}</svg>;
}
