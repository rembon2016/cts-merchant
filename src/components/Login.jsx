import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="mt-10 flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Masuk</h2>
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Username / Email
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan username atau email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
          <h6 className="flex justify-center gap-1">
            Belum Punya Akun?
            <Link to="/register" className="text-blue-600">
              {" "}
              Daftar
            </Link>
          </h6>
        </form>
      </div>
    </div>
  );
}
