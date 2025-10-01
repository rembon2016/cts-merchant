import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import useFetchDataStore from "../store/fetchDataStore";
import SimpleAlert from "./alert/SimpleAlert";
import SimpleInput from "./form/SimpleInput";

export default function EditMerchant() {
  const { user: userInfo, logout } = useAuthStore();
  const { loading, success, error, fetchData } = useFetchDataStore();
  const [disabledButton, setDisabledButton] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: userInfo?.business_account?.profile?.business_name || "",
    industryName: userInfo?.business_account?.profile?.industry_name || "",
    subIndustryName:
      userInfo?.business_account?.profile?.sub_industry_name || "",
    industryCode: userInfo?.business_account?.profile?.industry_code || "",
    businessScale: userInfo?.business_account?.profile?.business_scale || "",
    provinceName: userInfo?.business_account?.profile?.province_name || "",
    cityName: userInfo?.business_account?.profile?.city_name || "",
    subDistrickName:
      userInfo?.business_account?.profile?.subdistrict_name || "",
    villageName: userInfo?.business_account?.profile?.village_name || "",
    kodePos: userInfo?.business_account?.profile?.postal_code || "",
    address: userInfo?.business_account?.profile?.address || "",
    frontsideOutlinePhoto:
      userInfo?.business_account?.profile?.frontside_outlet_photo || "",
    productsPhoto: userInfo?.business_account?.profile?.products_photo || [],
    cardName: userInfo?.business_account?.manager?.id_card_name || "",
    cardNumber: userInfo?.business_account?.manager?.id_card_number || "",
    phoneNumber: userInfo?.business_account?.manager?.phone_number || "",
    digitalSignature:
      userInfo?.business_account?.manager?.digital_signature || "",
    bankName: userInfo?.business_account?.bank_information?.bank_name || "",
    bankCode: userInfo?.business_account?.bank_information?.bank_code || "",
    accountNumber:
      userInfo?.business_account?.bank_information?.account_number || "",
    accountName:
      userInfo?.business_account?.bank_information?.account_name || "",
    frontsideBankCardPhoto:
      userInfo?.business_account?.bank_information?.frontside_bank_card_photo ||
      "",
    isLegalEntity:
      userInfo?.business_account?.requirement_documents?.is_legal_entity || "",
    legalEntityName:
      userInfo?.business_account?.requirement_documents?.legal_entity_name ||
      "",
    legalEntityType:
      userInfo?.business_account?.requirement_documents?.legal_entity_type ||
      "",
    npwpNumber:
      userInfo?.business_account?.requirement_documents?.npwp_number || "",
    personalNpwpNumber:
      userInfo?.business_account?.requirement_documents?.personal_npwp_number ||
      "",
    theresChangesWithAktaPendirian:
      userInfo?.business_account?.requirement_documents
        ?.theres_changes_with_akta_pendirian || "",
    nibDocs: userInfo?.business_account?.requirement_documents?.nib_docs || "",
    npwpDocs:
      userInfo?.business_account?.requirement_documents?.npwp_docs || "",
    personalNpwpDocs:
      userInfo?.business_account?.requirement_documents?.personal_npwp_docs ||
      "",
    aktaPendirianDocs:
      userInfo?.business_account?.requirement_documents?.akta_pendirian_docs ||
      "",
    skKemenkumhamDocs:
      userInfo?.business_account?.requirement_documents?.sk_kemenkumham_docs ||
      "",
    latestAktaPerubahanDocs:
      userInfo?.business_account?.requirement_documents
        ?.latest_akta_perubahan_docs || "",
    latestSkKemenkumhamDocs:
      userInfo?.business_account?.requirement_documents
        ?.latest_sk_kemenkumham_docs || "",
    sellerReferenceNumber:
      userInfo?.business_account?.requirement_documents
        ?.seller_reference_number || "",
  });

  const [errors, setErrors] = useState({});

  const headersApi = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer 155|mvmV6GllJ3C68P39CljU7sdFUvn2Ltm1HxsDMCFJcfd613c8`,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Nama Bisnis harus diisi";
    }

    if (!formData.businessScale.trim()) {
      newErrors.businessScale = "Skala Bisnis harus diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const updateData = {
      name: userInfo.name,
      email: userInfo.email,
      business_profiles: {
        business_name: formData.businessName,
        business_scale: formData.businessScale,
        industry_name: formData.industryName,
        industry_code: formData.industryCode,
        sub_industry_name: formData.subIndustryName,
        province_name: formData.provinceName,
        city_name: formData.cityName,
        subdistrict_name: formData.subDistrickName,
        village_name: formData.villageName,
        postal_code: formData.kodePos,
        address: formData.address,
        id_card_name: formData.cardName,
        id_card_number: formData.cardNumber,
        phone_number: formData.phoneNumber,
        frontside_outlet_photo: formData.frontsideOutlinePhoto,
        products_photo: formData.productsPhoto,
      },
      business_managers: {
        id_card_name: formData.cardName,
        id_card_number: formData.cardNumber,
        phone_number: formData.phoneNumber,
        digital_signature: formData.digitalSignature,
      },
      bank_information: {
        bank_name: formData.bankName,
        bank_code: formData.bankCode,
        account_number: formData.accountNumber,
        account_name: formData.accountName,
        frontside_bank_card_photo: formData.frontsideBankCardPhoto,
      },
      requirement_documents: {
        is_legal_entity: formData.isLegalEntity,
        legal_entity_name: formData.legalEntityName,
        legal_entity_type: formData.legalEntityType,
        npwp_number: formData.npwpNumber,
        personal_npwp_number: formData.personalNpwpNumber,
        theres_changes_with_akta_pendirian:
          formData.theresChangesWithAktaPendirian,
        nib_docs: formData.nibDocs,
        npwp_docs: formData.npwpDocs,
        personal_npwp_docs: formData.personalNpwpDocs,
        akta_pendirian_docs: formData.aktaPendirianDocs,
        sk_kemenkumham_docs: formData.skKemenkumhamDocs,
        latest_akta_perubahan_docs: formData.latestAktaPerubahanDocs,
        latest_sk_kemenkumham_docs: formData.latestSkKemenkumhamDocs,
        seller_reference_number: formData.sellerReferenceNumber,
      },
    };

    fetchData(
      `${import.meta.env.VITE_API_ROUTES}/v1/merchant/${
        userInfo?.business_account?.id
      }/update`,
      {
        method: "POST",
        headers: headersApi,
        body: JSON.stringify(updateData),
      }
    );
  };

  useEffect(() => {
    if (success) {
      setDisabledButton(true);
      setTimeout(() => logout(), [1000]);
      setDisabledButton(false);
    }
  }, [success]);

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg bg-white shadow mt-5">
      <SimpleAlert
        type={success ? "success" : error ? "error" : null}
        textContent={
          success
            ? "Data Merchant berhasil diubah"
            : error
            ? "Data Merchant gagal diubah"
            : null
        }
      />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold dark:text-slate-400">
          Edit Merchant
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="text-slate-600 hover:text-slate-800"
        >
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
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <SimpleInput
          name="businessName"
          type="text"
          label="Nama Bisnis"
          value={formData.businessName}
          errors={errors.businessName}
          handleChange={handleChange}
        />
        <SimpleInput
          name="industryName"
          type="text"
          label="Nama Industri"
          value={formData.industryName}
          errors={errors.industryName}
          handleChange={handleChange}
        />
        <SimpleInput
          name="subIndustryName"
          type="text"
          label="Nama Sub Industri"
          value={formData.subIndustryName}
          errors={errors.subIndustryName}
          handleChange={handleChange}
        />
        <SimpleInput
          name="businessScale"
          type="text"
          label="Skala Bisnis"
          value={formData.businessScale}
          errors={errors.businessScale}
          handleChange={handleChange}
        />
        <SimpleInput
          name="industryCode"
          type="text"
          label="Kode Industri"
          value={formData.industryCode}
          errors={errors.industryCode}
          handleChange={handleChange}
        />
        <SimpleInput
          name="provinceName"
          type="text"
          label="Provinsi"
          value={formData.provinceName}
          errors={errors.provinceName}
          handleChange={handleChange}
        />
        <SimpleInput
          name="cityName"
          type="text"
          label="Kota"
          value={formData.cityName}
          errors={errors.cityName}
          handleChange={handleChange}
        />
        <SimpleInput
          name="subDistrickName"
          type="text"
          label="Distrik"
          value={formData.subDistrickName}
          errors={errors.subDistrickName}
          handleChange={handleChange}
        />
        <SimpleInput
          name="villageName"
          type="text"
          label="Desa"
          value={formData.villageName}
          errors={errors.villageName}
          handleChange={handleChange}
        />
        <SimpleInput
          name="kodePos"
          type="text"
          label="Kode Pos"
          value={formData.kodePos}
          errors={errors.kodePos}
          handleChange={handleChange}
        />
        <SimpleInput
          name="address"
          type="text"
          label="Alamat"
          value={formData.address}
          errors={errors.address}
          handleChange={handleChange}
        />
        <SimpleInput
          name="frontsideOutlinePhoto"
          type="file"
          label="Frontside Outlet Photo"
          value={formData.frontsideOutlinePhoto}
          errors={errors.frontsideOutlinePhoto}
          handleChange={handleChange}
        />
        <SimpleInput
          name="productsPhoto"
          type="file"
          label="Frontside Outlet Photo"
          value={formData.productsPhoto}
          errors={errors.productsPhoto}
          handleChange={handleChange}
        />
        <h3 className="font-semibold my-4">Data Manager</h3>
        <SimpleInput
          name="cardName"
          type="text"
          label="Nama Kartu"
          value={formData.cardName}
          errors={errors.cardName}
          handleChange={handleChange}
        />
        <SimpleInput
          name="cardNumber"
          type="text"
          label="Nomor Kartu"
          value={formData.cardNumber}
          errors={errors.cardNumber}
          handleChange={handleChange}
        />
        <SimpleInput
          name="phoneNumber"
          type="text"
          label="Nomor Telepon"
          value={formData.phoneNumber}
          errors={errors.phoneNumber}
          handleChange={handleChange}
        />
        <SimpleInput
          name="digitalSignature"
          type="file"
          label="Tanda Tangan Digital"
          value={formData.digitalSignature}
          errors={errors.digitalSignature}
          handleChange={handleChange}
        />
        <h3 className="font-semibold my-4">Data Bank</h3>
        <SimpleInput
          name="bankName"
          type="text"
          label="Nama Bank"
          value={formData.bankName}
          errors={errors.bankName}
          handleChange={handleChange}
        />
        <SimpleInput
          name="accountName"
          type="text"
          label="Nama Akun"
          value={formData.accountName}
          errors={errors.accountName}
          handleChange={handleChange}
        />
        <SimpleInput
          name="accountNumber"
          type="text"
          label="Nomor Akun"
          value={formData.accountNumber}
          errors={errors.accountNumber}
          handleChange={handleChange}
        />
        <SimpleInput
          name="bankCode"
          type="text"
          label="Kode Bank"
          value={formData.bankCode}
          errors={errors.bankCode}
          handleChange={handleChange}
        />
        <SimpleInput
          name="frontsideBankCardPhoto"
          type="file"
          label="Foto Bagian Depan Kartu"
          value={formData.frontsideBankCardPhoto}
          errors={errors.frontsideBankCardPhoto}
          handleChange={handleChange}
        />
        <h3 className="font-semibold my-4">File</h3>
        <SimpleInput
          name="isLegalEntity"
          type="file"
          label="Entitas Legal"
          value={formData.isLegalEntity}
          errors={errors.isLegalEntity}
          handleChange={handleChange}
        />
        <SimpleInput
          name="legalEntityName"
          type="file"
          label="Nama Entitas Legal"
          value={formData.legalEntityName}
          errors={errors.legalEntityName}
          handleChange={handleChange}
        />
        <SimpleInput
          name="legalEntityType"
          type="file"
          label="Type Entitas Legal"
          value={formData.legalEntityType}
          errors={errors.legalEntityType}
          handleChange={handleChange}
        />
        <SimpleInput
          name="npwpNumber"
          type="file"
          label="Nomor NPWP"
          value={formData.npwpNumber}
          errors={errors.npwpNumber}
          handleChange={handleChange}
        />
        <SimpleInput
          name="personalNpwpNumber"
          type="file"
          label="Nomor NPWP Pribadi"
          value={formData.personalNpwpNumber}
          errors={errors.personalNpwpNumber}
          handleChange={handleChange}
        />
        <SimpleInput
          name="theresChangesWithAktaPendirian"
          type="file"
          label="Ada Perubahan Dengan Akta Pendirian"
          value={formData.theresChangesWithAktaPendirian}
          errors={errors.theresChangesWithAktaPendirian}
          handleChange={handleChange}
        />
        <SimpleInput
          name="theresChangesWithAktaPendirian"
          type="file"
          label="Ada Perubahan Dengan Akta Pendirian"
          value={formData.theresChangesWithAktaPendirian}
          errors={errors.theresChangesWithAktaPendirian}
          handleChange={handleChange}
        />
        <SimpleInput
          name="nibDocs"
          type="file"
          label="Dokumen NIB"
          value={formData.nibDocs}
          errors={errors.nibDocs}
          handleChange={handleChange}
        />
        <SimpleInput
          name="npwpDocs"
          type="file"
          label="Dokumen NPWP"
          value={formData.npwpDocs}
          errors={errors.npwpDocs}
          handleChange={handleChange}
        />
        <SimpleInput
          name="personalNpwpDocs"
          type="file"
          label="Dokumen NPWP Pribadi"
          value={formData.personalNpwpDocs}
          errors={errors.personalNpwpDocs}
          handleChange={handleChange}
        />
        <SimpleInput
          name="aktaPendirianDocs"
          type="file"
          label="Dokumen Akta Pendirian"
          value={formData.aktaPendirianDocs}
          errors={errors.aktaPendirianDocs}
          handleChange={handleChange}
        />
        <SimpleInput
          name="skKemenkumhamDocs"
          type="file"
          label="Dokumen SK Kemenkumham"
          value={formData.skKemenkumhamDocs}
          errors={errors.skKemenkumhamDocs}
          handleChange={handleChange}
        />
        <SimpleInput
          name="latestAktaPerubahanDocs"
          type="file"
          label="Dokumen Akta Perubahan Terbaru"
          value={formData.latestAktaPerubahanDocs}
          errors={errors.latestAktaPerubahanDocs}
          handleChange={handleChange}
        />
        <SimpleInput
          name="latestSkKemenkumhamDocs"
          type="file"
          label="Dokumen SK Kemenkumham Terbaru"
          value={formData.latestSkKemenkumhamDocs}
          errors={errors.latestSkKemenkumhamDocs}
          handleChange={handleChange}
        />
        <SimpleInput
          name="sellerReferenceNumber"
          type="file"
          label="Nomor Referensi Penjual"
          value={formData.sellerReferenceNumber}
          errors={errors.sellerReferenceNumber}
          handleChange={handleChange}
        />
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-[var(--c-primary)] text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            disabled={disabledButton}
          >
            {loading ? "Tunggu..." : " Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
