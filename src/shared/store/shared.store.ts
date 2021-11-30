import create from 'zustand';

// Models
import { SharedState } from '../models/shared-state.interface';
import { Subtitle } from '../models/subtitle.interface';

const useSharedStore = create<SharedState>(set => ({
  theme: 'light',
  subtitle: null,
  title: process.env.REACT_APP_TITLE ? process.env.REACT_APP_TITLE : undefined,
  setSubtitle: (subtitle: Subtitle | null) => set({ subtitle }),
  setTitle: (title: string) => set({ title }),
  setTheme: (theme: string) => {
    set({ theme });
    document.documentElement.setAttribute('class', theme);
    localStorage.setItem('theme', theme);
  }
}));

export default useSharedStore;
