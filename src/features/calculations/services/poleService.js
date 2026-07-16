// Call API to perform pole calculation
export const calculatePole = async (payload) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        // Dummy result — fills every field the result tables render via
        // .toFixed(), so the mock doesn't crash the UI while the real
        // pole calculation endpoint isn't ready.
        results: payload.poles
          ? payload.poles.map(() => ({
              fb: 123.45,
              stb: 100,
              sts: 90,
              stc: 80,
              sectionArea: 10.5,
              sectionModulus: 8.2,
              momentInertia: 25.4,
              ip: 12.1,
              radiusGyration: 3.6,
              taperRatio: 1.5,
              typeofTaper: "Linear",
              heightSection: 500,
            }))
          : [],
        resultsDo: payload.directObjects
          ? payload.directObjects.map(() => ({
              weight: 45,
              fixLoad: 50,
              frontArea: 1.2,
              sideArea: 0.8,
              cf: 1.1,
              zHeight: 3000,
              windLoadAreaFront: 60,
              windLoadAreaSide: 40,
              seismicLoad: 20,
            }))
          : [],
        resultsOhw: payload.overheadWires
          ? payload.overheadWires.map(() => ({ flOhwKg: 30 }))
          : [],
        resultsArm: payload.arms
          ? payload.arms.map((a) => ({
              fb: 50,
              sfb: 45,
              sfs: 40,
              sfc: 35,
              diameter: 60,
              thickness: 4,
              sectionArea: 6.8,
              sectionModulus: 4.5,
              momentInertia: 14.2,
              radiusGyration: 2.1,
              massaM: 3.2,
              massa: 12.8,
              fixLoadM: 15,
              fixLoad: 60,
              armObjects: a.armObjects
                ? a.armObjects.map(() => ({ flAo: 10, weight: 8, fixLoad: 25 }))
                : [],
            }))
          : [],
      });
    }, 500);
  });
};
