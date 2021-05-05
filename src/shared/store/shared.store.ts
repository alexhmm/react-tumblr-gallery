import create, { State } from 'zustand';

import { Subtitle } from '../models/subtitle.interface';
import { setAppTheme } from '../utils/shared.utils';

export interface SharedStore extends State {
  theme: string;
  subtitle: Subtitle | null;
  title: string;
  setTheme: (theme: string) => void;
  setSubtitle: (subtitle: Subtitle | null) => void;
  setTitle: (title: string) => void;
}

const useSharedStore = create<SharedStore>(set => ({
  theme: 'light',
  subtitle: null,
  title: process.env.REACT_APP_TITLE ? process.env.REACT_APP_TITLE : '',
  setSubtitle: (subtitle: Subtitle | null) => set({ subtitle }),
  setTitle: (title: string) => set({ title }),
  setTheme: (theme: string) => {
    set({ theme });
    setAppTheme(theme);
  }
}));

export default useSharedStore;
