import { useAuthStore } from "../store/authStore";

export default function AccountInformation() {
  const { user: userInfo } = useAuthStore();

  return (
    <div className="max-w-md mx-auto p-6  rounded-lg bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">Informasi Akun</h2>
      <table className="w-full">
        <tbody>
          <tr>
            <td className="font-medium py-2">Nama Lengkap</td>
            <td className="py-2">{userInfo.name || "-"}</td>
          </tr>
          <tr>
            <td className="font-medium py-2">Email</td>
            <td className="py-2">{userInfo.email || "-"}</td>
          </tr>
        </tbody>
      </table>
      <h2 className="text-xl font-semibold my-4">Detail Bisnis</h2>
      <table className="w-full">
        <tbody>
          <tr>
            <td className="font-medium py-2">Nama Bisnis</td>
            <td className="py-2">
              {userInfo.business_account.profile.business_name || "-"}
            </td>
          </tr>
          <tr>
            <td className="font-medium py-2">Alamat</td>
            <td className="py-2">
              {userInfo.business_account.profile.address || "-"}
            </td>
          </tr>
          <tr>
            <td className="font-medium py-2">Provinsi</td>
            <td className="py-2">
              {userInfo.business_account.profile.province_name || "-"}
            </td>
          </tr>
          <tr>
            <td className="font-medium py-2">Nama Desa</td>
            <td className="py-2">
              {userInfo.business_account.profile.village_name || "-"}
            </td>
          </tr>
          <tr>
            <td className="font-medium py-2">Nama kota</td>
            <td className="py-2">
              {userInfo.business_account.profile.city_name || "-"}
            </td>
          </tr>
          <tr>
            <td className="font-medium py-2">Distrik</td>
            <td className="py-2">
              {userInfo.business_account.profile.subdistrict_name || "-"}
            </td>
          </tr>
          <tr>
            <td className="font-medium py-2">Skala Bisnis</td>
            <td className="py-2">
              {userInfo.business_account.profile.business_scale || "-"}
            </td>
          </tr>
          <tr>
            <td className="font-medium py-2">Postal Kode</td>
            <td className="py-2">
              {userInfo.business_account.profile.postal_code || "-"}
            </td>
          </tr>
          <tr>
            <td className="font-medium py-2">Jenis Industri</td>
            <td className="py-2">
              {userInfo.business_account.profile.industry_name || "-"}
            </td>
          </tr>
          <tr>
            <td className="font-medium py-2">Sub Industri</td>
            <td className="py-2">
              {userInfo.business_account.profile.sub_industry_name || "-"}
            </td>
          </tr>
          <tr>
            <td className="font-medium py-2">Kode Industri</td>
            <td className="py-2">
              {userInfo.business_account.profile.industry_code || "-"}
            </td>
          </tr>
          <tr>
            <td className="font-medium py-2">Status Akun</td>
            <td className="py-2">
              <button
                className={`rounded-full ${
                  userInfo.business_account.status === "pending"
                    ? "bg-yellow-500"
                    : "bg-green-700"
                } py-2 px-4 text-white`}
              >
                {userInfo.business_account.status}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <h2 className="text-xl font-semibold my-4">Detail Bank</h2>
      <table className="w-full">
        <tbody>
          <tr>
            <td className="font-medium py-2">Akun Bank</td>
            <td className="py-2">
              {userInfo.business_account.bank_information.account_name || "-"}
            </td>
          </tr>
          <tr>
            <td className="font-medium py-2">Nomor Akun</td>
            <td className="py-2">
              {userInfo.business_account.bank_information.account_number || "-"}
            </td>
          </tr>
          <tr>
            <td className="font-medium py-2">Name Bank</td>
            <td className="py-2">
              {userInfo.business_account.bank_information.bank_name || "-"}
            </td>
          </tr>
          <tr>
            <td className="font-medium py-2">Kode Bank</td>
            <td className="py-2">
              {userInfo.business_account.bank_information.bank_code || "-"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
