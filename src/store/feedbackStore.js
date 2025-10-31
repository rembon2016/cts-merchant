import { create } from 'zustand';
import { toast } from 'react-toastify';

const useFeedbackStore = create((set, get) => ({
  // State
  feedbacks: [],
  submitting: false,
  lastSubmitted: null,

  // Actions
  submitFeedback: async (data) => {
    set({ submitting: true });
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${import.meta.env.VITE_API_ROUTES}/cs/feedback`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      
      // Mock success for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const feedback = {
        id: `fb${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString()
      };
      
      set({ 
        feedbacks: [...get().feedbacks, feedback],
        lastSubmitted: feedback,
        submitting: false 
      });
      
      toast.success('Terima kasih atas masukan Anda!');
      return { success: true, data: feedback };
    } catch (error) {
      set({ submitting: false });
      toast.error('Gagal mengirim masukan. Silakan coba lagi.');
      return { success: false, error };
    }
  },

  submitRating: async (data) => {
    set({ submitting: true });
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set({ submitting: false });
      toast.success('Rating berhasil dikirim!');
      return { success: true };
    } catch (error) {
      set({ submitting: false });
      toast.error('Gagal mengirim rating.');
      return { success: false, error };
    }
  },

  resetLastSubmitted: () => set({ lastSubmitted: null })
}));

export default useFeedbackStore;
