import { useState } from "react";

const faqData = [
  {
    question: "Bagaimana cara mendaftar akun?",
    answer:
      "Klik tombol 'Daftar' di halaman utama dan isi data yang diperlukan.",
  },
  {
    question: "Bagaimana cara reset password?",
    answer:
      "Klik 'Lupa Password' pada halaman login dan ikuti instruksi yang diberikan.",
  },
  {
    question: "Bagaimana menghubungi customer service?",
    answer:
      "Anda dapat menghubungi kami melalui fitur chat atau email di halaman kontak.",
  },
];

export default function FaQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Butuh Bantuan?</h1>
      <div className="space-y-4">
        {faqData.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow">
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
    </div>
  );
}
