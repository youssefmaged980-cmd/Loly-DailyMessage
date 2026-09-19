import ClientMessage from "./ClientMessage";
import { getMessage } from "../../../lib/api";

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  const message = await getMessage(unwrappedParams.id);
  
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayString = `${yyyy}-${mm}-${dd}`;

  if (message && message.date > todayString) {
    return <ClientMessage initialMessage={null} />;
  }

  return <ClientMessage initialMessage={message} />;
}
