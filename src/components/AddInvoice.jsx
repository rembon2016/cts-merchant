import SimpleInput from "./form/SimpleInput";

const AddInvoice = () => {
  const dataBarang = [
    {
      id: "Barang 1",
      name: "Kopi Liong",
    },
    {
      id: "Barang 2",
      name: "Kerupuk",
    },
    {
      id: "Barang 3",
      name: "Teh Kotak",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="flex flex-col gap-3">
        <SimpleInput
          name="namaLengkap"
          type="text"
          label="Nama Lengkap"
          //   value={dataCheckout?.length || 0}
          //   disabled={true}
          //   errors={errors.password}
          //   handleChange={handleChange}
          //   disabled={!isEditPassword}
        />
        <SimpleInput
          name="namaBarang"
          type="text"
          label="Barang"
          isSelectBox={true}
          selectBoxData={dataBarang}
          //   errors={errors.password}
          //   handleChange={handleChange}
          //   disabled={!isEditPassword}
        />
        <SimpleInput
          name="totalTagihan"
          type="number"
          label="Total Tagihan"
          //   value={dataCheckout?.length || 0}
          //   disabled={true}
          //   errors={errors.password}
          //   handleChange={handleChange}
          //   disabled={!isEditPassword}
        />
        <SimpleInput
          name="tenggatWaktuPembayaran"
          type="date"
          label="Tenggat Waktu Pembayaran"
          //   value={dataCheckout?.length || 0}
          //   disabled={true}
          //   errors={errors.password}
          //   handleChange={handleChange}
          //   disabled={!isEditPassword}
        />
        <SimpleInput
          name="alamatPenagihan"
          type="text"
          label="Alamat Penagihan"
          //   value={dataCheckout?.length || 0}
          //   disabled={true}
          //   errors={errors.password}
          //   handleChange={handleChange}
          //   disabled={!isEditPassword}
        />
        <button className="bg-[var(--c-primary)] text-white rounded-lg py-4 font-semibold mt-3 hover:bg-blue-700 transition-colors ease-linear duration-300">
          Simpan
        </button>
      </div>
    </div>
  );
};

export default AddInvoice;
