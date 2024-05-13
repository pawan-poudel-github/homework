import type { User, Assignment } from "@prisma/client";

export type RoomApiResponse = {
  success: boolean;
  message: string;
};
export type UploadedFile = {
  url: string;
  size: number;
  name: string;
  uploadedAt: Date;
  metadata: Record<string, never>;
  path: Record<string, never>;
  pathOrder: string[];
};

export type AssignmentWithUser = Assignment & {
  user: User;
};
export type AssignmentPost = {
  success: boolean;
  message: string;
  posts?: AssignmentWithUser[];
  totalPages?: number;
};
