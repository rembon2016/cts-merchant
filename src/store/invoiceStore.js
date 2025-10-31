import { create } from "zustand";

const ROOT_API = import.meta.env.VITE_API_ROUTES;

const useInvoiceStore = create((set) => ({
  invoices: [],
  isLoading: false,
  error: null,
  success: null,
  response: null,
  
  /**
   * Mengambil daftar invoice dari API
   */
  getInvoices: async () => {
    const AUTH_TOKEN = sessionStorage.getItem("authToken");

    try {
      set({ isLoading: true, error: null });

      const response = await fetch(`${ROOT_API}/v1/merchant/invoice`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result) {
        set({ 
          invoices: result?.data?.invoices || [], 
          isLoading: false
        });
      }
    } catch (error) {
      console.error("Error: ", error.message);
      set({ 
        invoices: [], 
        isLoading: false
      });
    }
  },
  addInvoices: async (invoicesData) => {
    const AUTH_TOKEN = sessionStorage.getItem("authToken");

    try {
      set({ isLoading: true, error: null });

      const response = await fetch(`${ROOT_API}/v1/merchant/invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(invoicesData),
      });

      if (!response.ok) {
        set({ error: true, isLoading: false });
        setTimeout(() => {
          set({ error: null });
        }, 3000);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      set({
        isLoading: false,
        error: false,
        success: true,
      });

      if (response.ok) {
        setTimeout(() => {
          set({ success: null, isLoading: false });
        }, 3000);
        return () => clearTimeout();
      }
    } catch (error) {
      console.log("Error: ", error.message);
      setTimeout(() => {
        set({ error: null });
      }, 3000);
      set({ error: error.message, isLoading: false });
    }
  },
  getDetailInvoices: async (invoiceId) => {
    const AUTH_TOKEN = sessionStorage.getItem("authToken");

    if (!invoiceId) return;

    try {
      set({ isLoading: true, error: null });

      const response = await fetch(
        `${ROOT_API}/v1/merchant/invoice/${invoiceId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result) {
        set({ invoices: result?.data, isLoading: false });
      }
    } catch (error) {
      console.error("Error: ", error.message);
      set({ invoices: [], isLoading: false });
    }
  },
  printInvoices: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch(`${ROOT_API}/pos/invoices`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result) {
        set({ invoices: result, isLoading: false });
      }
    } catch (error) {
      console.error("Error: ", error.message);
      set({ invoices: [], isLoading: false });
    }
  },
}));

export { useInvoiceStore };
