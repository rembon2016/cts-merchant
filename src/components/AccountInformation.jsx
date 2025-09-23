import { useAuthStore } from "../store/authStore";

export default function AccountInformation() {
  const { user: userInfo } = useAuthStore();

  const getStatusColor = (value, isStatus) => {
    if (!isStatus) return "text-slate-600";
    return value === "pending" ? "text-orange-400" : "text-green-400";
  };

  const renderElement = (label, value, isStatus = false) => {
    return (
      <div className="flex hover:bg-slate-100 transition-all ease-in p-2">
        <span className="flex items-center w-[200px] font-regular text-slate-500">
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

  return (
    <div className="max-w-md mx-auto p-6  rounded-lg bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">Informasi Akun</h2>
      <div className="flex flex-col">
        {renderElement("Nama Lengkap", userInfo?.name)}
        {renderElement("Email", userInfo?.email)}
      </div>
      <h2 className="text-xl font-semibold my-4">Detail Bisnis</h2>
      <div className="flex flex-col">
        {renderElement(
          "Nama Bisnis",
          userInfo.business_account.profile.business_name
        )}
        {renderElement("Alamat", userInfo.business_account.profile.address)}
        {renderElement(
          "Provinsi",
          userInfo.business_account.profile.province_name
        )}
        {renderElement(
          "Nama Kota",
          userInfo.business_account.profile.city_name
        )}
        {renderElement(
          "Nama Desa",
          userInfo.business_account.profile.village_name
        )}
        {renderElement(
          "Distrik",
          userInfo.business_account.profile.subdistrict_name
        )}
        {renderElement(
          "Skala Bisnis",
          userInfo.business_account.profile.business_scale
        )}
        {renderElement(
          "Kode POS",
          userInfo.business_account.profile.postal_code
        )}
        {renderElement(
          "Jenis Industri",
          userInfo.business_account.profile.industry_name
        )}
        {renderElement(
          "Sub Industri",
          userInfo.business_account.profile.sub_industry_name
        )}
        {renderElement(
          "Kode Industri",
          userInfo.business_account.profile.industry_code
        )}
        {renderElement("Status Akun", userInfo.business_account.status, true)}
      </div>
      <h2 className="text-xl font-semibold my-4">Detail Bank</h2>
      <div className="flex flex-col">
        {renderElement(
          "Akun Bank",
          userInfo.business_account.bank_information.account_name
        )}
        {renderElement(
          "Nomor Akun",
          userInfo.business_account.bank_information.account_number
        )}
        {renderElement(
          "Nama Bank",
          userInfo.business_account.bank_information.bank_name
        )}
        {renderElement(
          "Kode Bank",
          userInfo.business_account.bank_information.bank_code
        )}
      </div>
    </div>
  );
}
