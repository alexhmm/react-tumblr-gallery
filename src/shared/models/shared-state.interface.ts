import { State } from 'zustand';

export interface SharedState extends State {
  theme: string;
  subtitle: string;
  title: string;
  setTheme: (theme: string) => void;
  setSubtitle: (subtitle: string) => void;
  setTitle: (title: string) => void;
}
