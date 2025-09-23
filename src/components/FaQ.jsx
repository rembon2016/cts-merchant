import { useEffect, useMemo, useState } from "react";
import useFetchDataStore from "../store/fetchDataStore";

export default function FaQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const { data, loading, error, fetchData } = useFetchDataStore();
  const toggleIndex = (idx) => setOpenIndex(openIndex === idx ? null : idx);

  useEffect(() => {
    fetchData(
      `${import.meta.env.VITE_API_ROUTES}/v1/merchant/faq?page=1&per_page=10`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }, []);

  const renderElement = useMemo(() => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!data || data?.faqs.length === 0) return <div>No FAQs available.</div>;

    return (
      <div className="space-y-4">
        {data?.faqs?.map((item, idx) => (
          <div key={item.id} className="bg-white rounded-2xl shadow">
            <button
              className="w-full flex justify-between items-center p-4 focus:outline-none"
              onClick={() => toggleIndex(idx)}
            >
              <span className="font-semibold text-start">{item.question}</span>
              <span>
                {openIndex === idx ? (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M6 15l6-6 6 6"
                    />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M6 9l6 6 6-6"
                    />
                  </svg>
                )}
              </span>
            </button>
            {openIndex === idx && (
              <div className="px-4 pb-4">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    );
  }, [data, loading, error, openIndex]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Butuh Bantuan?</h1>
      {renderElement}
    </div>
  );
}
