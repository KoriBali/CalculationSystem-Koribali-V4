import { calculatePole } from "../../services/poleService";
import { calculateCase } from "../../services/requestService";

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
  requestId = null,
  caseId = null,
}) {
  // 1. Validasi dasar sebelum kirim ke BE
  if (!poles || poles.length === 0) {
    throw new Error("Pole data is required for calculation.");
  }

  const resolvedRequestId =
    requestId ||
    (caseId ? sessionStorage.getItem(`case_request_id_${caseId}`) : null) ||
    sessionStorage.getItem("active_request_id") ||
    null;

  // JIKA DALAM KONTEKS CALCULATION CASE & MEMILIKI poleStandardHeightId (Old JIL Standard Taper)
  if (resolvedRequestId && caseId && taperPoleStandard?.poleStandardHeightId) {
    const std = String(condition?.designStandard || condition?.standard || "").toLowerCase();
    const isOldJil =
      (std.includes("jil") ||
        std.includes("lighting") ||
        std === "old_lighting_pole" ||
        std === "old_jil" ||
        std === "jil") &&
      !std.includes("new");

    const calcDirectObjects = (directObjects || []).map((d) => {
      const rawH = Number(d.zHeight || 8000);
      const elevationM = rawH > 100 ? rawH / 1000 : rawH;
      return {
        name: d.name || "灯具",
        objectKind: isOldJil ? "omni" : (d.type || "omni"),
        frontAreaM2: Number(d.frontArea || 0.1),
        sideAreaM2: isOldJil ? null : (d.sideArea != null ? Number(d.sideArea) : null),
        fixedAngleDeg: isOldJil ? null : (d.fixAngle != null ? Number(d.fixAngle) : null),
        massPerUnitKg: Number(d.weight || 14),
        elevationM,
        baseWindCoefficient: Number(d.nnC || 1.0),
        quantity: Number(d.quantity || 1),
      };
    });

    try {
      const res = await calculateCase(resolvedRequestId, caseId, {
        poleStandardHeightId: taperPoleStandard.poleStandardHeightId,
        directObjects: calcDirectObjects,
      });

      if (
        res &&
        (res.status ||
          res.display ||
          res.positions ||
          res.sections ||
          res.checks ||
          res.governing)
      ) {
        const resolvedDisplay = res.display || {
          status: res.status,
          displayDirection: res.displayDirection || "N",
          positions: res.positions || res.sections || [],
          checks: res.checks || [],
          governing: res.governing || null,
        };

        const posList =
          (Array.isArray(resolvedDisplay.checks) &&
          resolvedDisplay.checks.length > 0
            ? resolvedDisplay.checks
            : null) ||
          (Array.isArray(resolvedDisplay.positions) &&
          resolvedDisplay.positions.length > 0
            ? resolvedDisplay.positions
            : null) ||
          (Array.isArray(resolvedDisplay.sections) &&
          resolvedDisplay.sections.length > 0
            ? resolvedDisplay.sections
            : null) ||
          (resolvedDisplay.governing ? [resolvedDisplay.governing] : []);

        const mappedResults = (poles && poles.length > 0 ? poles : [{}]).map(
          (p, i) => {
            const matchPos = posList[i] || posList[0] || {};
            const rawSf =
              matchPos.utilizationRatio ??
              matchPos.utilization_ratio ??
              matchPos.safetyFactor ??
              matchPos.safety_factor ??
              null;
            const sf =
              rawSf != null && !Number.isNaN(Number(rawSf))
                ? Number(Number(rawSf).toFixed(3))
                : null;
            return {
              ...p,
              description:
                matchPos.name ||
                matchPos.evaluatedPoleName ||
                matchPos.poleName ||
                p.description ||
                p.name ||
                `Pole-${i + 1}`,
              safetyFactor: sf,
              utilizationRatio: sf,
              limit: matchPos.limit ?? matchPos.allowableRatio ?? 1.0,
              status:
                matchPos.status ||
                (sf != null ? (sf < 1.0 ? "OK" : "NG") : null),
            };
          },
        );

        return {
          results: mappedResults,
          resultsDo: directObjects || [],
          resultsOhw: [],
          resultsArm: [],
          display: {
            ...resolvedDisplay,
            positions: posList,
            checks: resolvedDisplay.checks || posList,
          },
        };
      }
    } catch (apiErr) {
      console.error("Backend calculateCase failed:", apiErr);
      const detail = apiErr?.response?.data?.detail;
      let msg = "Structural calculation failed on the backend server.";
      if (typeof detail === "string") {
        msg = detail;
      } else if (detail?.reason) {
        const reasonMessages = {
          wind_speed_missing: "Wind speed has not been specified in the Calculation Conditions.",
          design_standard_not_calculable: "This design standard is not currently supported by the calculation engine.",
          pole_height_not_calculable: "This pole height is not calculable or catalog geometry is unavailable on the server.",
          engine_unavailable: "The calculation engine service is currently unavailable. Please try again later.",
        };
        msg = reasonMessages[detail.reason] || detail.message || detail.reason;
      } else if (detail?.message) {
        msg = detail.message;
      } else if (apiErr?.response?.data?.message) {
        msg = apiErr.response.data.message;
      } else if (apiErr?.message) {
        msg = apiErr.message;
      }
      // Strict: langsung lempar error asli dari BE tanpa fallback ke dummy
      throw new Error(msg);
    }
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
        poles,
        directObjects,
        overheadWires,
        arms,
      };

      if (type === "taper" || type === "tapered") {
        // Untuk taper, BE mungkin butuh selection user + data hasil resolve
        const lowestStep =
          taperPoleStandard?.groundPosition === "onGL"
            ? "0"
            : String(taperPoleStandard?.embedmentLength ?? "0");

        payload = {
          ...payload,
          taperPoleStandard,
          poleConfig: {
            ...poleConfig,
            lowestHeight: lowestStep,
            groundPosition: taperPoleStandard?.groundPosition || "onGL",
          },
        };
      } else if (type === "straight") {
        // Untuk straight, kirim konfigurasi spec-nya + hasil resolve poles
        const lowestStep =
          straightPoleStandard?.groundPosition === "onGL"
            ? "0"
            : String(straightPoleStandard?.lowestHeight ?? "0");

        payload = {
          ...payload,
          straightPoleStandard,
          poleConfig: {
            ...poleConfig,
            lowestHeight: lowestStep,
            groundPosition: straightPoleStandard?.groundPosition || "onGL",
          },
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
