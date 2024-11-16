import { ReactNode } from "react";

export const Languages = {
  en: "English",
  nl: "Dutch",
  de: "German",
  es: "Spanish",
  fr: "French"
} as const;

export type Language = keyof typeof Languages;

export type Theme = "light" | "dark";

export type Role = "user" | "assistant";

export interface Prompt {
  title: string;
  content: string;
}

export interface ServerMessage {
  role: Role;
  content: string;
}

export interface ClientMessage {
  id: string;
  role: Role;
  display: ReactNode;
  loadingState: any;
  date: Date;
}

export interface UIInterface {
  theme: Theme;
  language: Language;
  url: string;
}
