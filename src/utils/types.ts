export type User = {
  id: string;
  name: string;
  email: string;
  type: number;
};

export type ContractorPost = {
  id: string;
  title: string;
  phone: string;
  description: string;
  labourCount: number;
};

export type RequestType = {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  status: 1 | 2 | 3;
};
