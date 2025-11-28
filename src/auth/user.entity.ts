// Prisma-backed User type placeholder
export type User = {
  id: string;
  email: string;
  passwordHash: string;
  firstName?: string | null;
  secondName?: string | null;
  phone?: string | null;
  createdAt: string | Date;
};
