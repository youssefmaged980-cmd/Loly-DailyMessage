import ClientHome from "./ClientHome";
import { getMessages } from "../lib/api";
import { Message } from "@/types";

export const dynamic = 'force-dynamic';

export default async function Page() {
  let messages: Message[] = [];
  try {
    messages = await getMessages();
  } catch (error) {
    console.error("Failed to load messages for the home page:", error);
  }

  return <ClientHome initialMessages={messages} />;
}
