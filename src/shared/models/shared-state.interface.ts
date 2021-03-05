import { State } from 'zustand';

export interface SharedState extends State {
  title: string;
  setTitle: (title: string) => void;
}
