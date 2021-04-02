import create from 'zustand';

import { SharedState } from '../models/shared-state.interface';
import { setAppTheme } from '../utils/shared.utils';

const useSharedStore = create<SharedState>(set => ({
  theme: 'light',
  subtitle: '',
  title: process.env.REACT_APP_TITLE ? process.env.REACT_APP_TITLE : '',
  setSubtitle: (subtitle: string) => set({ subtitle }),
  setTitle: (title: string) => set({ title }),
  setTheme: (theme: string) => {
    set({ theme });
    setAppTheme(theme);
  }
}));

export default useSharedStore;
