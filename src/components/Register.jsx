import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="mt-5 flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Daftar</h2>
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium  mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan nama lengkap"
            />
          </div>
          <div>
            <label className="block text-sm font-medium  mb-1">
              Username / Email
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan username atau email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium  mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium  mb-1">
              Konfirmasi Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan password"
            />
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="mr-2 leading-tight" />
            <span className="text-sm ">
              Saya setuju dengan{" "}
              <Link to="#" className="text-blue-600">
                Syarat dan Ketentuan
              </Link>
            </span>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Daftar
          </button>
          <h6 className="flex justify-center gap-1">
            Sudah Punya Akun?
            <Link to="/login" className="text-blue-600">
              {" "}
              Masuk
            </Link>
          </h6>
        </form>
      </div>
    </div>
  );
}
