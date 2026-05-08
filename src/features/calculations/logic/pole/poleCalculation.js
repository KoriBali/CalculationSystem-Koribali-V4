import { calculatePole } from "../../services/poleService";

/**
 * Menyiapkan payload dan mengeksekusi API kalkulasi pole.
 * Pastikan data yang dipassing ke sini adalah data yang sudah divalidasi
 * dan sudah di-resolve (untuk mode standard).
 */
export async function executePoleCalculation({
  condition,
  poleTypeStandard,
  poleConfig,
  poles, // Jika standard, ini adalah hasil resolvedPoles
  directObjects, // Jika standard, ini adalah hasil resolvedDirectObjects
  overheadWires, // Jika standard, ini adalah hasil resolvedOverheadWires
  arms, // Jika standard, ini adalah hasil resolvedArms
  straightPoleStandard, // Penamaan disamakan dengan validator sebelumnya
  taperPoleStandard, // Tambahkan ini jika dibutuhkan
}) {
  // 1. Validasi dasar sebelum kirim ke BE
  if (!poles || poles.length === 0) {
    throw new Error("Pole data is required for calculation.");
  }

  // 2. Inisialisasi base payload
  let payload = {
    condition,
    poleConfig,
  };

  // 3. Mapping Payload berdasarkan poleType
  switch (condition.poleType) {
    case "custom":
      // Kirim semua data mentah dari user
      payload = {
        ...payload,
        poles,
        directObjects,
        overheadWires,
        arms,
      };
      break;

    case "standard":
      // Pastikan type ada
      const type = poleTypeStandard?.type;
      if (!type) {
        throw new Error("Pole type is required for standard mode");
      }

      payload = {
        ...payload,
        poleTypeStandard,
      };

      if (type === "taper") {
        // Untuk taper, BE mungkin butuh selection user + data hasil resolve
        payload = {
          ...payload,
          taperPoleStandard,
        };
      } else if (type === "straight") {
        // Untuk straight, kirim konfigurasi spec-nya + hasil resolve poles
        payload = {
          ...payload,
          straightPoleStandard,
        };
      }
      break;

    default:
      throw new Error("Invalid calculation poleType");
  }

  // 4. Eksekusi API call
  try {
    return await calculatePole(payload);
  } catch (error) {
    // Logika handling error API (opsional)
    console.error("Calculation API Error:", error);
    throw error;
  }
}
