import { create } from "zustand";

export const useCheckEmptyStore = create((set, get) => ({
  isEmpty: false,
  checkEmptyValue: (value) => {
    if (
      value === "" ||
      value === undefined ||
      value === null ||
      value.length === 0
    ) {
      set({ isEmpty: true });
    } else {
      set({ isEmpty: false });
    }

    return get().isEmpty;
  },
}));
