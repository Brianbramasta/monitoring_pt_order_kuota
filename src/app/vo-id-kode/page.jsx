"use client";
import React, { useState } from "react";
import CustomModal from "../../components/customModal";
import DynamicTable from "../../components/DynamicTable";

const JENIS_PRODUK_OPTIONS = [
  { label: "Telkomsel", value: "Telkomsel" },
  { label: "Indosat Ooredoo", value: "Indosat Ooredoo" },
  { label: "XL", value: "XL" },
  { label: "Smartfren", value: "Smartfren" },
];

const initialData = [
  { id: 1, jenisProduk: "Telkomsel", namaProduk: "Pulsa Telkomsel 5rb", voIdKode: "TRX001" },
  { id: 2, jenisProduk: "Telkomsel", namaProduk: "Pulsa Telkomsel 10rb", voIdKode: "TRX002" },
  { id: 3, jenisProduk: "Telkomsel", namaProduk: "Pulsa Telkomsel 15rb", voIdKode: "TRX003" },
  { id: 4, jenisProduk: "Telkomsel", namaProduk: "Pulsa Telkomsel 20rb", voIdKode: "TRX004" },
  { id: 5, jenisProduk: "XL", namaProduk: "Pulsa XL 5rb", voIdKode: "ABC001" },
  { id: 6, jenisProduk: "XL", namaProduk: "Pulsa XL 10rb", voIdKode: "ABC002" },
  { id: 7, jenisProduk: "XL", namaProduk: "Pulsa XL 15rb", voIdKode: "ABC003" },
  { id: 8, jenisProduk: "XL", namaProduk: "Pulsa XL 20rb", voIdKode: "ABC004" },
];

export default function VoIdKodePage() {
  const [data, setData] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("tambah"); // "tambah" | "edit"
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  // State input modal
  const [jenisProduk, setJenisProduk] = useState("");
  const [namaProduk, setNamaProduk] = useState("");
  const [voIdKode, setVoIdKode] = useState("");

  // Pagination
  const [page, setPage] = useState(2);
  const pageSize = 8;
  const totalPages = 5;

  // Filter data by search
  const filteredData = data.filter(
    (row) =>
      row.voIdKode.toLowerCase().includes(search.toLowerCase()) ||
      row.namaProduk.toLowerCase().includes(search.toLowerCase())
  );

  // Modal open handler
  const openTambah = () => {
    setModalMode("tambah");
    setEditId(null);
    setJenisProduk("");
    setNamaProduk("");
    setVoIdKode("");
    setModalOpen(true);
  };
  const openEdit = (row) => {
    setModalMode("edit");
    setEditId(row.id);
    setJenisProduk(row.jenisProduk);
    setNamaProduk(row.namaProduk);
    setVoIdKode(row.voIdKode);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  // Simpan handler
  const handleSimpan = () => {
    if (!jenisProduk || !namaProduk || !voIdKode) return;
    if (modalMode === "tambah") {
      setData([
        ...data,
        {
          id: data.length ? Math.max(...data.map((d) => d.id)) + 1 : 1,
          jenisProduk,
          namaProduk,
          voIdKode,
        },
      ]);
    } else if (modalMode === "edit") {
      setData(
        data.map((d) =>
          d.id === editId ? { ...d, jenisProduk, namaProduk, voIdKode } : d
        )
      );
    }
    setModalOpen(false);
  };

  // Hapus handler
  const handleHapus = (id) => {
    if (window.confirm("Yakin hapus data ini?")) {
      setData(data.filter((d) => d.id !== id));
    }
  };

  // Table columns
  const columns = [
    { key: "no", label: "No." },
    { key: "jenisProduk", label: "Jenis Produk" },
    { key: "namaProduk", label: "Nama Produk" },
    { key: "voIdKode", label: "VO ID Kode" },
  ];

  // Table data with numbering
  const tableData = filteredData.map((row, idx) => ({
    ...row,
    no: (idx + 1).toString().padStart(2, "0"),
  }));

  // Modal input config
  const modalInputs = [
    {
      type: "select",
      label: "Jenis Produk",
      placeholder: "Pilih jenis produk",
      value: jenisProduk,
      options: JENIS_PRODUK_OPTIONS,
      onChange: setJenisProduk,
    },
    {
      type: "text",
      label: "Nama Produk",
      placeholder: "Tulis nama produk",
      value: namaProduk,
      onChange: setNamaProduk,
    },
    {
      type: "text",
      label: "VO ID Kode",
      placeholder: "tulis vo id kode",
      value: voIdKode,
      onChange: setVoIdKode,
    },
  ];

  // Modal button config
  const modalButtons = [
    {
      label: "Simpan",
      onClick: handleSimpan,
      disabled: !jenisProduk || !namaProduk || !voIdKode,
      style: {
        background: !jenisProduk || !namaProduk || !voIdKode ? "#F0F0F0" : "#179F8B",
        color: !jenisProduk || !namaProduk || !voIdKode ? "#888" : "#fff",
      },
    },
  ];

  // Icon SVG inline
  const EditIcon = (
    <svg width="18" height="18" fill="none" stroke="#179F8B" strokeWidth="2"><path d="M4 13.5V16h2.5l7.1-7.1-2.5-2.5L4 13.5z"/><path d="M14.7 5.3a1 1 0 0 0 0-1.4l-1.6-1.6a1 1 0 0 0-1.4 0l-1.1 1.1 2.5 2.5 1.1-1.1z"/></svg>
  );
  const DeleteIcon = (
    <svg width="18" height="18" fill="none" stroke="#EB5757" strokeWidth="2"><path d="M6 7v6M9 7v6M12 7v6M4 5h10M5 5V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1"/><rect x="3" y="5" width="12" height="10" rx="2"/></svg>
  );

  return (
    <div className="w-full" style={{fontFamily: 'Poppins, Arial, sans-serif'}}>
      <h1 className="text-2xl font-bold text-[#222] mb-6">VO ID Kode</h1>
      <DynamicTable
        columns={columns}
        data={tableData}
        searchPlaceholder="Cari kode produk disini ..."
        onSearch={setSearch}
        pagination={{
          page,
          totalPages,
          onPageChange: setPage,
          pageSize,
          onPageSizeChange: () => {},
          totalData: data.length,
        }}
        actions={[{
          label: 'Tambah VO ID Kode',
          onClick: openTambah,
          icon: <span className="text-xl">+</span>,
        }]}
        rowActions={(row) => [
          <button
            key="edit"
            className="flex items-center gap-1 text-[#179F8B] hover:underline text-sm font-medium"
            onClick={() => openEdit(row)}
          >
            {EditIcon} Edit
          </button>,
          <button
            key="hapus"
            className="flex items-center gap-1 text-[#EB5757] hover:underline text-sm font-medium"
            onClick={() => handleHapus(row.id)}
          >
            {DeleteIcon} Hapus
          </button>,
        ]}
      />
      <CustomModal
        open={modalOpen}
        onClose={closeModal}
        title={modalMode === "tambah" ? "Tambah VO ID Kode" : "Edit VO ID Kode"}
        inputs={modalInputs}
        buttons={modalButtons}
      />
    </div>
  );
}
