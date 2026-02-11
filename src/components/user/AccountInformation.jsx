import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { toast } from "sonner";
import BackButton from "../customs/button/BackButton";

export default function AccountInformation() {
  const { user: userInfo } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profil-toko");

  const getStatusColor = (value, isStatus) => {
    if (!isStatus) return "text-slate-600";
    return value === "pending" ? "text-orange-400" : "text-green-400";
  };

  const renderElement = (label, value, isStatus = false) => {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-lg ease-in p-3 mb-2">
        <span className="text-sm sm:text-base font-regular text-slate-500 dark:text-slate-400 sm:w-[180px]">
          {label}
        </span>
        <span
          className={`text-sm sm:text-base font-bold break-words ${getStatusColor(
            value,
            isStatus,
          )}`}
        >
          {value || "-"}
        </span>
      </div>
    );
  };

  const renderIconEdit = (isEditMerchant = false) => {
    return (
      <button
        onClick={() => handleClickEdit()}
        className="p-2 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        title={isEditMerchant ? "Edit Profil Toko" : "Edit Manajer"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-pencil hover:text-blue-500 transition-all"
        >
          <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
          <path d="m15 5 4 4" />
        </svg>
      </button>
    );
  };

  const handleClickEdit = () => {
    return navigate(`/account/edit/${userInfo?.id}`, { replace: true });
  };

  const tabs = [
    {
      id: "profil-toko",
      label: "Profil Toko",
      content: (
        <div className="space-y-1">
          {renderElement(
            "Nama Bisnis",
            userInfo?.business_account?.profile?.business_name,
          )}
          {renderElement(
            "Alamat",
            userInfo?.business_account?.profile?.address,
          )}
          {renderElement(
            "Provinsi",
            userInfo?.business_account?.profile?.province_name,
          )}
          {renderElement(
            "Nama Kota",
            userInfo?.business_account?.profile?.city_name,
          )}
          {renderElement(
            "Nama Desa",
            userInfo?.business_account?.profile?.village_name,
          )}
          {renderElement(
            "Distrik",
            userInfo?.business_account?.profile?.subdistrict_name,
          )}
          {(() => {
            const lat = userInfo?.business_account?.profile?.latitude;
            const lng = userInfo?.business_account?.profile?.longitude;

            if (!lat || !lng) {
              return (
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Koordinat tidak tersedia.
                </div>
              );
            }

            const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
              lat,
            )},${encodeURIComponent(lng)}&z=15&output=embed`;

            return (
              <div className="w-full h-72 sm:h-96 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
                <iframe
                  title="merchant-map"
                  src={mapUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            );
          })()}
          {renderElement(
            "Skala Bisnis",
            userInfo?.business_account?.profile?.business_scale,
          )}
          {renderElement(
            "Kode POS",
            userInfo?.business_account?.profile?.postal_code,
          )}
          {renderElement(
            "Jenis Industri",
            userInfo?.business_account?.profile?.industry_name,
          )}
          {renderElement(
            "Sub Industri",
            userInfo?.business_account?.profile?.sub_industry_name,
          )}
          {renderElement(
            "Kode Industri",
            userInfo?.business_account?.profile?.industry_code,
          )}
          {renderElement(
            "Status Akun",
            userInfo?.business_account?.status,
            true,
          )}
        </div>
      ),
    },
    {
      id: "manajer",
      label: "Manajer",
      content: (
        <>
          <div className="space-y-1">
            {renderElement("Nama Lengkap", userInfo?.name)}
            {renderElement("Email", userInfo?.email)}
          </div>
        </>
      ),
    },
    {
      id: "bank",
      label: "Informasi Bank",
      content: (
        <>
          <div className="space-y-1">
            {renderElement(
              "Akun Bank",
              userInfo?.business_account?.bank_information?.account_name,
            )}
            {renderElement(
              "Nomor Akun",
              userInfo?.business_account?.bank_information?.account_number,
            )}
            {renderElement(
              "Nama Bank",
              userInfo?.business_account?.bank_information?.bank_name,
            )}
            {renderElement(
              "Kode Bank",
              userInfo?.business_account?.bank_information?.bank_code,
            )}
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <BackButton to="/profile" />
      <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Informasi Akun Section */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold dark:text-slate-300">
              Informasi Akun
            </h2>
            {renderIconEdit(false)}
          </div>
          <div className="space-y-1">
            {renderElement("Nama Lengkap", userInfo?.name)}
            {renderElement("Email", userInfo?.email)}
          </div>
        </div>

        {/* Merchant Tabs Section */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md overflow-hidden">
          <div className="px-4 sm:px-6 pt-4 sm:pt-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold dark:text-slate-300 mb-4">
              Merchant
            </h2>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-x-auto px-4 sm:px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3 sm:px-4 text-sm sm:text-base font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {tabs.find((tab) => tab.id === activeTab)?.content}
          </div>
        </div>
      </div>
    </>
  );
}
