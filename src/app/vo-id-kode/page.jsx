"use client";
import React, { useState, useEffect } from "react";
import CustomModal from "../../components/customModal";
import DynamicTable from "../../components/DynamicTable";
import { getVoidKodes, addVoidKode, editVoidKode, deleteVoidKode } from "@/services/voidkode";
import { getProductTypesOptions } from '@/services/products';

export default function VoIdKodePage() {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("tambah"); // "tambah" | "edit"
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);

  // State input modal
  const [jenisProduk, setJenisProduk] = useState("");
  const [namaProduk, setNamaProduk] = useState("");
  const [voIdKode, setVoIdKode] = useState("");
  const [jenisProdukOptions, setJenisProdukOptions] = useState([]);

  const fetchData = () => {
    setLoading(true);
    getVoidKodes({
      search,
      page,
      limit: pageSize,
    })
      .then(res => {
        const arr = res.data.data?.void_codes || [];
        setData(arr.map((row, idx) => ({
          ...row,
          no: row.no || ((page - 1) * pageSize + idx + 1).toString().padStart(2, "0"),
        })));
        setTotalData(res.data.data?.pagination?.total_data || arr.length);
      })
      .catch(() => {
        setData([]);
        setTotalData(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    // Ambil opsi jenis produk dari API
    getProductTypesOptions().then(res => {
      const arr = res.data.data?.product_types || [];
      setJenisProdukOptions(arr.map(opt => ({ label: opt.name, value: opt.name })));
    });
    
    // Auto refresh setiap 10 detik
    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    // Cleanup interval saat component unmount atau dependency berubah
    return () => clearInterval(interval);
  }, [search, page, pageSize]);

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
    setJenisProduk(row.jenisProduk || row.product_type || "");
    setNamaProduk(row.namaProduk || row.product_name || "");
    setVoIdKode(row.voIdKode || row.vd_id_code || "");
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  // Simpan handler
  const handleSimpan = async () => {
    if (!jenisProduk || !namaProduk || !voIdKode) return;
    try {
      if (modalMode === "tambah") {
        await addVoidKode({ product_type: jenisProduk, product_name: namaProduk, vd_id_code: voIdKode });
      } else if (modalMode === "edit") {
        await editVoidKode(editId, { product_type: jenisProduk, product_name: namaProduk, vd_id_code: voIdKode });
      }
      setModalOpen(false);
      // Refresh data
      setLoading(true);
      getVoidKodes({ search, page, limit: pageSize })
        .then(res => {
          const arr = res.data.data?.void_codes || [];
          setData(arr.map((row, idx) => ({
            ...row,
            no: row.no || ((page - 1) * pageSize + idx + 1).toString().padStart(2, "0"),
          })));
          setTotalData(res.data.data?.pagination?.total_data || arr.length);
        })
        .catch(() => {
          setData([]);
          setTotalData(0);
        })
        .finally(() => setLoading(false));
    } catch (e) {
      alert("Gagal menyimpan data");
    }
  };

  // Hapus handler
  const handleHapus = async (id) => {
    if (window.confirm("Yakin hapus data ini?")) {
      try {
        await deleteVoidKode(id);
        // Refresh data
        setLoading(true);
        getVoidKodes({ search, page, limit: pageSize })
          .then(res => {
            const arr = res.data.data?.void_codes || [];
            setData(arr.map((row, idx) => ({
              ...row,
              no: row.no || ((page - 1) * pageSize + idx + 1).toString().padStart(2, "0"),
            })));
            setTotalData(res.data.data?.pagination?.total_data || arr.length);
          })
          .catch(() => {
            setData([]);
            setTotalData(0);
          })
          .finally(() => setLoading(false));
      } catch (e) {
        alert("Gagal menghapus data");
      }
    }
  };

  // Table columns
  const columns = [
    { key: "no", label: "No." },
    { key: "jenisProduk", label: "Jenis Produk" },
    { key: "namaProduk", label: "Nama Produk" },
    { key: "voIdKode", label: "VO ID Kode" },
  ];

  // Table data with mapping
  const tableData = data.map(row => ({
    ...row,
    jenisProduk: row.jenisProduk || row.product_type || '-',
    namaProduk: row.namaProduk || row.product_name || '-',
    voIdKode: row.voIdKode || row.vd_id_code || '-',
  }));

  // Modal input config
  const modalInputs = [
    {
      type: "select",
      label: "Jenis Produk",
      placeholder: "Pilih jenis produk",
      value: jenisProduk,
      options: jenisProdukOptions,
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
          totalPages: Math.ceil(totalData / pageSize),
          onPageChange: setPage,
          pageSize,
          onPageSizeChange: setPageSize,
          totalData,
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
        loading={loading}
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
