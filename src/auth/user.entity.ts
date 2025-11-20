// Prisma-backed User type placeholder
export type User = {
  id: string;
  email: string;
  passwordHash: string;
  displayName?: string | null;
  createdAt: string | Date;
};
