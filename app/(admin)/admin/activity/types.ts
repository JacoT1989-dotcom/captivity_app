import { JsonValue } from "@prisma/client/runtime/library";

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: string;
  createdAt: Date;
  userId: string | null;
  metadata: JsonValue | null;
  user?: {
    id: string;
    username: string;
  } | null;
}
