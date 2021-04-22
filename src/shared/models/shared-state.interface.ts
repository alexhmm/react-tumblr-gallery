import { State } from 'zustand';

import { Subtitle } from './subtitle.interface';

export interface SharedState extends State {
  theme: string;
  subtitle: Subtitle | null;
  title: string;
  setTheme: (theme: string) => void;
  setSubtitle: (subtitle: Subtitle | null) => void;
  setTitle: (title: string) => void;
}
