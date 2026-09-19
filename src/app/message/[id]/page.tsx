import ClientMessage from "./ClientMessage";
import { getMessage } from "@/lib/api";
import { getEgyptTodayString } from "@/lib/date";

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  const message = await getMessage(unwrappedParams.id);
  const todayString = getEgyptTodayString();

  // If message is scheduled for future (greater than Cairo today), don't reveal it yet
  if (message && message.date > todayString) {
    return <ClientMessage initialMessage={null} />;
  }

  return <ClientMessage initialMessage={message} />;
}
