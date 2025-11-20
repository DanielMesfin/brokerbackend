// Prisma-backed Post type placeholder for code references.
export type Post = {
  id: string;
  content: string;
  media: string[];
  authorId?: string | null;
  createdAt: string | Date;
};
