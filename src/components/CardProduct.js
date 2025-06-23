import React from "react";

/**
 * Props:
 * - nomor: string | number
 * - iconDiamond: { show: boolean, color?: string, iconUrl?: string }
 * - namaProduk: string
 * - nominalTerjual: string | number
 * - iconProduk: ReactNode | string (url)
 */
const CardProduct = ({
  nomor,
  iconDiamond = { show: false, color: "#FF414D", iconUrl: "/public/icon/card/fail/icon-1.svg" },
  namaProduk,
  nominalTerjual,
  iconProduk,
}) => {
  return (
    <div style={{
      boxSizing: "border-box",
      width: '100%',
      height: 287,
      background: "#fff",
      border: "1px solid #E0E0E0",
      borderRadius: 8,
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: 0,
    }}>
      {/* Nomor */}
      <span style={{
        position: "absolute",
        left: 16,
        top: 16,
        fontFamily: "Poppins, sans-serif",
        fontWeight: 700,
        fontSize: 24,
        lineHeight: "160%",
        color: "#222",
        opacity: 0.4,
      }}>{nomor}</span>

      {/* Icon Diamond (optional) */}
      {iconDiamond?.show && (
        <span style={{
          position: "absolute",
          right: 16,
          top: 16,
          width: 30,
          height: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <img
            src={iconDiamond.iconUrl || "/icon/card/fail/icon-1.svg"}
            alt="diamond"
            style={{
              width: 30,
              height: 30,
              filter: iconDiamond.color ? `drop-shadow(0 0 0 ${iconDiamond.color})` : undefined,
            }}
          />
        </span>
      )}

      {/* Icon Produk */}
      <div style={{
        width: 70,
        height: 70,
        marginTop: 48,
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {typeof iconProduk === "string" ? (
          <img src={iconProduk} alt="produk" style={{ width: 70, height: 70 }} />
        ) : (
          iconProduk
        )}
      </div>

      {/* Nama Produk */}
      <div style={{
        fontFamily: "Poppins, sans-serif",
        fontWeight: 500,
        fontSize: 16,
        lineHeight: "24px",
        color: "#222",
        textAlign: "center",
        marginBottom: 32,
      }}>{namaProduk}</div>

      {/* Bagian bawah abu-abu */}
      <div style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        width: "100%",
        height: 83,
        background: "#F8F8F8",
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
      }}>
        <span style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 400,
          fontSize: 14,
          lineHeight: "21px",
          color: "#222",
          opacity: 0.5,
          textAlign: "center",
        }}>Nominal Terjual</span>
        <span style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 700,
          fontSize: 18,
          lineHeight: "27px",
          color: "#222",
          textAlign: "center",
        }}>Rp {nominalTerjual}</span>
      </div>
    </div>
  );
};

export default CardProduct;
