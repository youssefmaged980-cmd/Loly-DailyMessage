import ClientHome from "./ClientHome";
import { getMessages } from "../lib/api";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const messages = await getMessages();
  return <ClientHome initialMessages={messages} />;
}
