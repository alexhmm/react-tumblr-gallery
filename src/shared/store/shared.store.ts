import create from 'zustand';

// Models
import { SharedState } from '../models/shared-state.interface';
import { Subtitle } from '../models/subtitle.interface';

// Utils
import { setAppTheme } from '../utils/shared.utils';

const useSharedStore = create<SharedState>(set => ({
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
