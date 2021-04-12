import { State } from 'zustand';

export interface SharedState extends State {
  theme: string;
  subtitle: string | null;
  title: string;
  setTheme: (theme: string) => void;
  setSubtitle: (subtitle: string | null) => void;
  setTitle: (title: string) => void;
}
