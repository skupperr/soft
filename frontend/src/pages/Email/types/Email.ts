export interface Email {
  id: string;
  from: string;
  fromEmail: string;
  to: string;
  subject: string;
  body: string;
<<<<<<< HEAD
  timestamp: String;
=======
  timestamp: Date;
>>>>>>> 85e3ea269136a87f255f4669a022f33396865816
  isRead: boolean;
  isImportant: boolean;
  isStarred: boolean;
  attachments?: string[];
}

export interface Draft {
  id: string;
  to: string;
  subject: string;
  body: string;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}