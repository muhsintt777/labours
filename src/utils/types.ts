export interface User {
  id: string;
  name: string;
  email: string;
  type: number;
}

export interface ContractorPost {
  id: string;
  title: string;
  phone: string;
  description: string;
  labourCount: number;
}

export interface RequestType {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  status: 1 | 2 | 3;
}
