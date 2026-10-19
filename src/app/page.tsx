import ClientHome from "./ClientHome";
import { getMessages } from "../lib/api";
import { Message } from "@/types";

export const dynamic = 'force-dynamic';

export default async function Page() {
  let messages: Message[] = [];
  let messageLoadError: string | null = null;

  try {
    messages = await getMessages();
  } catch (error) {
    messageLoadError = error instanceof Error ? error.message : "تعذر الاتصال بقاعدة الرسائل.";
  }

  return <ClientHome initialMessages={messages} messageLoadError={messageLoadError} />;
}
