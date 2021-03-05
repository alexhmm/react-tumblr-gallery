import create from 'zustand';
import { SharedState } from '../models/shared-state.interface';

const useSharedStore = create<SharedState>(set => ({
  title: '',
  setTitle: (title: string) => {
    set({
      title
    });
  }
}));

export default useSharedStore;
