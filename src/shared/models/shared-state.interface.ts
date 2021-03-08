import { State } from 'zustand';

export interface SharedState extends State {
  theme: string;
  title: string;
  setTheme: (theme: string) => void;
  setTitle: (title: string) => void;
}
