import React from "react";

export default function AccountInformation({ user }) {
  // Contoh data user jika props tidak diberikan
  const defaultUser = {
    name: "Alex",
    username: "merchant123",
    password: "********",
    type: "Merchant",
    disabled: false,
  };

  const userInfo = user || defaultUser;

  return (
    <div className="max-w-md mx-auto p-6  rounded-lg bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">Informasi Akun</h2>
      <table className="w-full">
        <tbody>
          <tr>
            <td className="font-medium py-2">Nama Lengkap</td>
            <td className="py-2">{userInfo.name}</td>
          </tr>
          <tr>
            <td className="font-medium py-2">Nama Pengguna</td>
            <td className="py-2">{userInfo.username}</td>
          </tr>
          <tr>
            <td className="font-medium py-2">Sandi</td>
            <td className="py-2">{userInfo.password}</td>
          </tr>
          <tr>
            <td className="font-medium py-2">Tipe</td>
            <td className="py-2">{userInfo.type}</td>
          </tr>
          <tr>
            <td className="font-medium py-2">Status Akun</td>
            <td className="py-2">
              <button
                className={`rounded-full ${
                  userInfo.disabled ? "bg-red-700" : "bg-green-700"
                } py-2 px-4 text-white`}
              >
                {userInfo.disabled ? "Nonaktif" : "Aktif"}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
