export type Schema = {
  users: {
    id?: number;
    name: string;
    phoneNumber: string;
    role?: string;
    createdAt?: string;
  };
  events: {
    id?: number;
    name: string;
    description?: string | null;
    date: string;
    fee: number;
    imageUrl?: string | null;
    createdAt?: string;
  };
  payments: {
    id?: number;
    userId: number;
    eventId: number;
    amount: number;
    transactionId?: string | null;
    screenshot?: string | null;
    status?: string;
    createdAt?: string;
  };
};