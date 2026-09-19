export interface Message {
  id: string;
  date: string;
  message: string;
  createdAt?: string;
}

export async function getMessages(): Promise<Message[]> {
  try {
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/lolo-daily-messa/databases/(default)/documents/messages`, {
      cache: 'no-store'
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    if (!data.documents) return [];
    
    const messages = data.documents.map((doc: any) => ({
      id: doc.name.split('/').pop(),
      date: doc.fields.date.stringValue,
      message: doc.fields.message.stringValue,
      createdAt: doc.fields.createdAt?.stringValue || doc.createTime || ""
    }));
    
    return messages.sort((a: Message, b: Message) => {
      const dateCmp = b.date.localeCompare(a.date);
      if (dateCmp !== 0) return dateCmp;
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return [];
  }
}

export async function getMessage(id: string): Promise<Message | null> {
  try {
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/lolo-daily-messa/databases/(default)/documents/messages/${id}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    if (!data.fields) return null;
    
    return {
      id: data.name.split('/').pop(),
      date: data.fields.date.stringValue,
      message: data.fields.message.stringValue
    };
  } catch (error) {
    console.error("Failed to fetch message:", error);
    return null;
  }
}
