import CardProduct from "@/components/CardProduct";

const products = [
  {
    nomor: "01",
    iconDiamond: { show: true, color: "#FF414D", iconUrl: "/icon/card product/diamond/red.svg" },
    namaProduk: "E-Toll",
    nominalTerjual: "12.000.000",
    iconProduk: "/icon/card product/icon/atm-card.png",
  },
  {
    nomor: "02",
    iconDiamond: { show: true, color: "#1EC98B", iconUrl: "/icon/card product/diamond/green.svg" },
    namaProduk: "Pulsa Telkomsel",
    nominalTerjual: "8.000.000",
    iconProduk: "/icon/card product/icon/telkomsel.png",
  },
  {
    nomor: "03",
    iconDiamond: { show: true, color: "#1EC9C3", iconUrl: "/icon/card product/diamond/blue.svg" },
    namaProduk: "Topup Game",
    nominalTerjual: "4.000.000",
    iconProduk: "/icon/card product/icon/gamepad.png",
  },
  {
    nomor: "04",
    iconDiamond: { show: false },
    namaProduk: "Bayar Tagihan",
    nominalTerjual: "2.000.000",
    iconProduk: "/icon/card product/icon/bill.png",
  },
  {
    nomor: "05",
    iconDiamond: { show: false },
    namaProduk: "Uang Elektronik",
    nominalTerjual: "1.300.000",
    iconProduk: "/icon/card product/icon/money.png",
  },
  {
    nomor: "06",
    iconDiamond: { show: false },
    namaProduk: "E-Toll",
    nominalTerjual: "12.000.000",
    iconProduk: "/icon/card product/icon/atm-card.png",
  },
  {
    nomor: "07",
    iconDiamond: { show: false },
    namaProduk: "Pulsa Telkomsel",
    nominalTerjual: "8.000.000",
    iconProduk: "/icon/card product/icon/telkomsel.png",
  },
  {
    nomor: "08",
    iconDiamond: { show: false },
    namaProduk: "Topup Game",
    nominalTerjual: "4.000.000",
    iconProduk: "/icon/card product/icon/gamepad.png",
  },
  {
    nomor: "09",
    iconDiamond: { show: false },
    namaProduk: "Bayar Tagihan",
    nominalTerjual: "2.000.000",
    iconProduk: "/icon/card product/icon/bill.png",
  },
  {
    nomor: "10",
    iconDiamond: { show: false },
    namaProduk: "Uang Elektronik",
    nominalTerjual: "1.300.000",
    iconProduk: "/icon/card product/icon/money.png",
  },
];

export default function ProductsBestSellingPage() {
  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Produk Terlaris</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((p, i) => (
          <CardProduct
            key={i}
            nomor={p.nomor}
            iconDiamond={p.iconDiamond}
            namaProduk={p.namaProduk}
            nominalTerjual={p.nominalTerjual}
            iconProduk={p.iconProduk}
          />
        ))}
      </div>
    </div>
  );
} 