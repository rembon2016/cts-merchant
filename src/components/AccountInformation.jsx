import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function AccountInformation() {
  const { user: userInfo } = useAuthStore();

  const navigate = useNavigate();

  const getStatusColor = (value, isStatus) => {
    if (!isStatus) return "text-slate-600";
    return value === "pending" ? "text-orange-400" : "text-green-400";
  };

  const renderElement = (label, value, isStatus = false) => {
    return (
      <div className="flex hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-lg ease-in p-2">
        <span className="flex items-center w-[200px] font-regular text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <span
          className={`flex items-center w-[80%] font-bold ${getStatusColor(
            value,
            isStatus
          )}`}
        >
          {value || "-"}
        </span>
      </div>
    );
  };

  const renderIconEdit = (isEditMerchant = false) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-pencil-icon lucide-pencil hover:cursor-pointer hover:text-blue-500 transition-all my-auto"
        onClick={() => handleClickEdit(isEditMerchant)}
      >
        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
        <path d="m15 5 4 4" />
      </svg>
    );
  };

  const handleClickEdit = (editMerchant) => {
    if (editMerchant) {
      return alert("Fitur segera hadir");
    }

    return navigate(`/account/edit/${userInfo?.id}`, { replace: true });
  };

  return (
    <div className="max-w-md mx-auto p-6  rounded-lg bg-white shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-4 dark:text-slate-400">
          Informasi Akun
        </h2>
        {renderIconEdit()}
      </div>
      <div className="flex flex-col">
        {renderElement("Nama Lengkap", userInfo?.name)}
        {renderElement("Email", userInfo?.email)}
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold my-4 dark:text-slate-400">
          Merchant
        </h2>
        {renderIconEdit(true)}
      </div>
      <div className="flex flex-col">
        {renderElement(
          "Nama Bisnis",
          userInfo?.business_account?.profile?.business_name
        )}
        {renderElement("Alamat", userInfo?.business_account?.profile?.address)}
        {renderElement(
          "Provinsi",
          userInfo?.business_account?.profile?.province_name
        )}
        {renderElement(
          "Nama Kota",
          userInfo?.business_account?.profile?.city_name
        )}
        {renderElement(
          "Nama Desa",
          userInfo?.business_account?.profile?.village_name
        )}
        {renderElement(
          "Distrik",
          userInfo?.business_account?.profile?.subdistrict_name
        )}
        {renderElement(
          "Skala Bisnis",
          userInfo?.business_account?.profile?.business_scale
        )}
        {renderElement(
          "Kode POS",
          userInfo?.business_account?.profile?.postal_code
        )}
        {renderElement(
          "Jenis Industri",
          userInfo?.business_account?.profile?.industry_name
        )}
        {renderElement(
          "Sub Industri",
          userInfo?.business_account?.profile?.sub_industry_name
        )}
        {renderElement(
          "Kode Industri",
          userInfo?.business_account?.profile?.industry_code
        )}
        {renderElement("Status Akun", userInfo?.business_account?.status, true)}
      </div>
      <div className="flex flex-col">
        {renderElement(
          "Akun Bank",
          userInfo?.business_account?.bank_information?.account_name
        )}
        {renderElement(
          "Nomor Akun",
          userInfo?.business_account?.bank_information?.account_number
        )}
        {renderElement(
          "Nama Bank",
          userInfo?.business_account?.bank_information?.bank_name
        )}
        {renderElement(
          "Kode Bank",
          userInfo?.business_account?.bank_information?.bank_code
        )}
      </div>
    </div>
  );
}
