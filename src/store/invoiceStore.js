import { create } from "zustand";

const ROOT_API = import.meta.env.VITE_API_ROUTES;

const useInvoiceStore = create((set) => ({
  invoices: [],
  isLoading: false,
  downloading: false,
  error: null,
  success: null,
  response: null,

  /**
   * Mengambil daftar invoice dari API
   */
  getInvoices: async (params = {}) => {
    const AUTH_TOKEN = sessionStorage.getItem("authToken");
    const { status, end_date, search } = params || {};

    try {
      set({ isLoading: true, error: null });
      const qs = new URLSearchParams();
      if (status) qs.append("status", status);
      if (end_date) qs.append("end_date", end_date);
      if (search) qs.append("search", search);

      const url = qs.toString()
        ? `${ROOT_API}/v1/merchant/invoice?${qs.toString()}`
        : `${ROOT_API}/v1/merchant/invoice`;

      const response = await fetch(url, {
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
          isLoading: false,
        });
      }

      return result;
    } catch (error) {
      console.error("Error: ", error.message);
      set({
        invoices: [],
        isLoading: false,
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

      const result = await response.json();

      set({
        isLoading: false,
        error: false,
        success: true,
      });

      return result;
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
  printInvoices: async (invoiceId, invoiceCode, invoiceName) => {
    const AUTH_TOKEN = sessionStorage.getItem("authToken");

    try {
      set({ downloading: true, error: null });

      fetch(`${ROOT_API}/v1/merchant/invoice/${invoiceId}/print`, {
        method: "GET",
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      })
        .then((response) => {
          response.headers.get("filename");
          return response.blob();
        })
        .then((response) => {
          let myURL = globalThis.URL || globalThis.webkitURL;
          let csvUrl = myURL.createObjectURL(response);
          let tempLink = document.createElement("a");
          tempLink.href = csvUrl;
          tempLink.setAttribute(
            "download",
            `${invoiceCode}-${invoiceName}.pdf`
          );
          tempLink.click();
          set({ downloading: false, error: null });
        });
    } catch (error) {
      console.log(error);
      set({ downloading: false, error: error.message });
    }
  },
}));

export { useInvoiceStore };
