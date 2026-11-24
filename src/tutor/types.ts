export type Tab =
  | "inicio"
  | "comunidade"
  | "conversas"
  | "consultas"
  | "cao"
  | "admin";
export type Topic =
  | "geral"
  | "passeios"
  | "sozinho"
  | "convivencia"
  | "latidos";
export const TOPICS: Record<Topic, string> = {
  geral: "Trocas do dia a dia",
  passeios: "Passeios e coleira",
  sozinho: "Ficar sozinho",
  convivencia: "Convivência entre cães",
  latidos: "Latidos e rotina",
};
export interface Post {
  id: string;
  authorId: string;
  author: string;
  dog: string;
  content: string;
  topic: Topic;
  createdAt?: any;
}
export interface Comment {
  id: string;
  authorId: string;
  author: string;
  text: string;
  createdAt?: any;
}
export interface Message extends Comment {
  sender?: "erico" | "tutor";
}
export interface Consultation {
  id: string;
  tutorId: string;
  startsAt: number;
  duration: number;
  status: "scheduled" | "completed" | "cancelled";
  summary: string;
  activities: string;
  materials: string;
  createdAt?: any;
}
export interface Log {
  id: string;
  emotion: "calmo" | "focado" | "ansioso" | "disperso";
  notes: string;
  date: string;
  createdAt?: any;
}
export const isEducator = (
  user: { email: string | null; emailVerified: boolean; isAdmin?: boolean } | null,
) => !!user?.emailVerified && user.isAdmin === true;
