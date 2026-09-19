import ClientMessage from "./ClientMessage";
import { getMessage } from "../../../lib/api";

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  const message = await getMessage(unwrappedParams.id);
  
  return <ClientMessage initialMessage={message} />;
}
