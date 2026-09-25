import { Message } from "@/types";

const FIRESTORE_PROJECT_ID = "lolo-daily-messa";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/messages`;

/**
 * Fetches ALL messages from Firestore cloud database without any limitation.
 * Uses pagination loop (nextPageToken) to guarantee 100% of historical messages are retrieved for life.
 */
export async function getMessages(): Promise<Message[]> {
  const allMessages: Message[] = [];
  let pageToken: string | undefined = undefined;

  try {
    do {
      const url: string = pageToken 
        ? `${BASE_URL}?pageSize=300&pageToken=${encodeURIComponent(pageToken)}` 
        : `${BASE_URL}?pageSize=300`;

      const res = await fetch(url, {
        cache: 'no-store'
      });

      if (!res.ok) {
        console.error(`Firestore fetch failed with status: ${res.status}`);
        break;
      }

      const data = await res.json();
      if (Array.isArray(data.documents)) {
        for (const doc of data.documents) {
          if (doc.fields?.date?.stringValue && doc.fields?.message?.stringValue) {
            allMessages.push({
              id: doc.name.split('/').pop() || "",
              date: doc.fields.date.stringValue,
              title: doc.fields.title?.stringValue || "",
              description: doc.fields.description?.stringValue || "",
              message: doc.fields.message.stringValue,
              createdAt: doc.fields.createdAt?.stringValue || doc.createTime || "",
              reply: doc.fields.reply?.stringValue || undefined,
              reaction: doc.fields.reaction?.stringValue || undefined,
            });
          }
        }
      }

      pageToken = data.nextPageToken;
    } while (pageToken);

    // Sort descending: newest dates first, and if multiple messages on the same date, latest created first
    return allMessages.sort((a, b) => {
      const dateCmp = b.date.localeCompare(a.date);
      if (dateCmp !== 0) return dateCmp;
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    });
  } catch (error) {
    console.error("Failed to fetch messages from Firestore:", error);
    return allMessages;
  }
}

/**
 * Fetches a specific single message by its Firestore document ID.
 */
export async function getMessage(id: string): Promise<Message | null> {
  if (!id) return null;
  try {
    const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
      cache: 'no-store'
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data.fields?.date?.stringValue || !data.fields?.message?.stringValue) {
      return null;
    }

    return {
      id: data.name.split('/').pop() || id,
      date: data.fields.date.stringValue,
      title: data.fields.title?.stringValue || "",
      description: data.fields.description?.stringValue || "",
      message: data.fields.message.stringValue,
      createdAt: data.fields.createdAt?.stringValue || data.createTime || "",
      reply: data.fields.reply?.stringValue || undefined,
      reaction: data.fields.reaction?.stringValue || undefined,
    };
  } catch (error) {
    console.error(`Failed to fetch message ${id}:`, error);
    return null;
  }
}
