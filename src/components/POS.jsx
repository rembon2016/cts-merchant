import { useState } from "react";
import { useThemeStore } from "../store/themeStore";

const categories = [
    {
        name: "TRANSAKSI",
        iconLight: "../../public/icons/transaction.svg",
        iconDark: "../../public/icons/transaction-white.svg",
    },
    {
        name: "PRODUK",
        iconLight: "../../public/icons/product.svg",
        iconDark: "../../public/icons/product-white.svg",
    },
    {
        name: "MENU",
        iconLight: "../../public/icons/menu.svg",
        iconDark: "../../public/icons/menu-white.svg",
    },
];
const subCategories = ["Makanan", "Minuman", "Kopi", "Snack", "Lainnya"];
const products = [
    {
        id: 1,
        name: "Nasi Goreng",
        desc: "lorem ipsum dolor sit amet",
        price: "20.000",
        category: "Makanan",
        image: "../../public/images/gambar1.jpg",
    },
    {
        id: 2,
        name: "Es Teh",
        desc: "lorem ipsum dolor sit amet",
        price: "5.000",
        category: "Minuman",
        image: "../../public/images/gambar2.jpg",
    },
    {
        id: 3,
        name: "Americano",
        desc: "lorem ipsum dolor sit amet",
        price: "15.000",
        category: "Kopi",
        image: "../../public/images/gambar3.jpg",
    },
    {
        id: 4,
        name: "Keripik",
        desc: "lorem ipsum dolor sit amet",
        price: "7.000",
        category: "Snack",
        image: "../../public/images/gambar4.jpg",
    },
    {
        id: 5,
        name: "Roti Bakar",
        desc: "lorem ipsum dolor sit amet",
        price: "12.000",
        category: "Lainnya",
        image: "../../public/images/gambar5.jpg",
    },
    {
        id: 6,
        name: "Jus Jeruk",
        desc: "lorem ipsum dolor sit amet",
        price: "10.000",
        category: "Minuman",
        image: "../../public/images/gambar6.jpg",
    },
];

export default function POS() {
    const [search, setSearch] = useState("");
    const [selectedSub, setSelectedSub] = useState("");

    const { isDark } = useThemeStore();

    const filteredProducts = products.filter(
        (p) =>
            (!selectedSub || p.category === selectedSub) &&
            p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 max-w-3xl mx-auto">
            {/* Kategori Produk */}
            <div className="flex gap-2 mb-6">
                {categories.map((cat) => (
                    <div
                        key={cat}
                        className="w-full min-h-[100px] max-h-full flex flex-col justify-center items-center hover:bg-slate-200 dark:hover:bg-slate-600 bg-white  text-slate-600 dark:text-slate-100 rounded-lg font-semibold cursor-pointer text-[12px]"
                    >
                        <img
                            src={isDark ? cat.iconDark : cat.iconLight}
                            alt={cat.name}
                            className="w-10 h-10 mb-2 "
                        />
                        {cat.name}
                    </div>
                ))}
            </div>
            {/* Sub Kategori */}
            <div className="mb-6">
                <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 pb-2">
                    {subCategories.map((sub) => (
                        <button
                            key={sub}
                            className={`px-4 py-2 rounded border ${selectedSub === sub
                                    ? "bg-[var(--c-accent)] text-slate-600"
                                    : "bg-gray-100 text-gray-700"
                                } hover:bg-[var(--c-accent)] hover:text-slate-600 transition slate-600 space-nowrap rounded-full dark:text-slate-100 dark:hover:text-slate-600`}
                            onClick={() => setSelectedSub(sub === selectedSub ? "" : sub)}
                        >
                            {sub}
                        </button>
                    ))}
                </div>
            </div>
            {/* Pencarian */}
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    placeholder="Cari produk..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button className="px-4 py-2 bg-[var(--c-primary)] text-white rounded hover:bg-[var(--c-primary)] transition">
                    Cari
                </button>
            </div>
            {/* Daftar Produk */}
            <div className="grid grid-cols-2 gap-4">
                {filteredProducts.length === 0 ? (
                    <div className="col-span-2 text-center text-gray-500">
                        Produk tidak ditemukan.
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="border rounded-lg shadow hover:shadow-lg transition flex flex-col items-start"
                        >
                            <img
                                src={product?.image}
                                alt={product.name || "Product Image"}
                                className="w-full h-[100px] object-cover rounded-[10px]  mx-auto"
                            />
                            <div className="p-4">
                                <div className="font-bold text-lg">{product.name}</div>
                                <div className="font-normal text-sm mb-2">{product.desc}</div>
                                <div className="text-slate-600">
                                    <span>Rp.</span>
                                    <span className="font-bold text-2xl">{product.price}</span>
                                </div>
                                <div className="mt-3 flex gap-2 justify-between items-center">
                                    <button className="w-full h-12 bg-[var(--c-primary)] text-white py-2 hover:bg-[var(--c-primary)] rounded-full">
                                        Beli
                                    </button>
                                    <button className="w-20 h-12 text-slace-600 rounded-full border-2 border-slate-600 flex justify-center items-center">
                                        <img
                                            src={`${isDark
                                                    ? "../../public/icons/cart-white.svg"
                                                    : "../../public/icons/cart.svg"
                                                }`}
                                            alt={product.name || "Product Image"}
                                            className="w-8 h-8"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
