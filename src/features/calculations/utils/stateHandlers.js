// ====================================================
// Function for Cover Input
// ====================================================
// ====================================================
// Function for Condition Input
// ====================================================

// ====================================================
// Function for Structural Design Pole Input
// ====================================================
// FUNCTION: Update structural design data
export const updatePoleConfig = (poleConfig, updates, setPoleConfig) => {
  setPoleConfig({ ...poleConfig, ...updates });
};

// ====================================================
// Function for Pole Type Standard Input
// ====================================================
// FUNCTION: Update pole type standard data
export const updatePoleTypeStandard = (
  poleTypeStandard,
  updates,
  setPoleTypeStandard,
) => {
  setPoleTypeStandard({ ...poleTypeStandard, ...updates });
};

// FUNCTION: Update straight pole type standard data
export const updateStraightPoleStandard = (
  straightPoleStandard,
  updates,
  setStraightPoleStandard,
) => {
  setStraightPoleStandard({ ...straightPoleStandard, ...updates });
};

// FUNCTION: Update taper pole type standard data
export const updateTaperPoleStandard = (
  taperPoleStandard,
  updates,
  setTaperPoleStandard,
) => {
  setTaperPoleStandard({ ...taperPoleStandard, ...updates });
};

// ====================================================
// Function for Pole Input
// ====================================================
// FUNCTION: Add a new step (max 6 step)
export const addPole = (poles, setPoles, setActiveTab, IdRef) => {
  if (poles.length >= 6) return;

  IdRef.current += 1;
  const newId = IdRef.current.toString();

  setPoles([
    ...poles,
    {
      id: newId,
      name: "",
      material: "STK400",
      type: "Straight",
      lowerDiameter: "",
      upperDiameter: "",
      lowerThickness: "",
      upperThickness: "",
      zHeight: "",
      quantity: "1",
    },
  ]);

  setActiveTab(newId); // set newly added pole as active
};

// FUNCTION: Remove a pole by ID
export const removePole = (id, poles, setPoles, activeTab, setActiveTab) => {
  if (poles.length <= 1) return;

  const index = poles.findIndex((s) => s.id === id);
  const newPoles = poles.filter((s) => s.id !== id);

  setPoles(newPoles);

  if (activeTab === id) {
    let newIndex;

    if (index > 0) {
      // ambil pole sebelumnya
      newIndex = index - 1;
    } else {
      // kalau hapus index 0, ambil yang sekarang di 0
      newIndex = 0;
    }

    setActiveTab(newPoles[newIndex].id);
  }
};

// FUNCTION: Update a specific pole's data
export const updatePole = (id, updates, setPoles, poles) => {
  setPoles(poles.map((s) => (s.id === id ? { ...s, ...updates } : s)));
};

// FUNCTION: Reset the active pole to default values
export const resetCurrentPole = (setPoles, poles, activeTab) => {
  setPoles(
    poles.map((s) =>
      s.id === activeTab
        ? {
            ...s,
            name: "",
            lowerDiameter: "",
            upperDiameter: "",
            lowerThickness: "",
            upperThickness: "",
            zHeight: "",
            quantity: "1",
          }
        : s,
    ),
  );
};

// ====================================================
// Function for Direct Object Input
// ====================================================
// FUNCTION: Add a new direct object (max 25 object) By Input
export const syncDoByInput = (
  inputValue,
  directObjects,
  setDirectObjects,
  idRef,
  onConfirmReduce,
) => {
  const targetCount = Number(inputValue);

  if (!targetCount || targetCount < 0) return;

  const safeTarget = Math.min(targetCount, 25);
  const currentCount = directObjects.length;

  // case 1: imput jumlah yang sama
  if (safeTarget === currentCount) return;

  // case 2: tambah object
  if (safeTarget > currentCount) {
    const addCount = safeTarget - currentCount;

    const newItems = [];
    for (let i = 0; i < addCount; i++) {
      idRef.current += 1;
      newItems.push({
        idDo: idRef.current.toString(),
        name: "",
        type: "omni",
        frontArea: "",
        sideArea: "",
        weight: "",
        zHeight: "",
        nnC: "",
        quantity: "1",
        fixAngle: "",
      });
    }

    setDirectObjects([...directObjects, ...newItems]);
    return;
  }

  // case 3: kurangi object
  if (safeTarget < currentCount) {
    onConfirmReduce({
      from: currentCount,
      to: safeTarget,
    });
  }
};

// FUNCTION: Add a new direct object (max 25 object) By Click
export const addDo = (directObjects, setDirectObjects, idRef) => {
  if (directObjects.length >= 25) return;

  idRef.current += 1;
  const newId = idRef.current.toString();

  setDirectObjects([
    ...directObjects,
    {
      idDo: newId,
      name: "",
      type: "omni",
      frontArea: "",
      sideArea: "",
      weight: "",
      zHeight: "",
      nnC: "",
      quantity: "1",
      fixAngle: "",
    },
  ]);
};

// FUNCTION: Copy Direct Object data to clipboard
export const copyDo = (directObject, setDoClipboard) => {
  setDoClipboard({
    name: directObject.name,
    type: directObject.type,
    frontArea: directObject.frontArea,
    sideArea: directObject.sideArea,
    weight: directObject.weight,
    zHeight: directObject.zHeight,
    nnC: directObject.nnC,
    quantity: directObject.quantity,
    fixAngle: directObject.fixAngle,
  });
};

// FUNCTION: Paste clipboard data into a specific Direct Object
export const pasteDo = (id, setDirectObjects, doClipboard) => {
  if (!doClipboard) return;

  setDirectObjects((prev) =>
    prev.map((doItem) =>
      doItem.idDo === id ? { ...doItem, ...doClipboard } : doItem,
    ),
  );
};

// FUNCTION: Remove a direct object by ID
export const removeDo = (id, directObjects, setDirectObjects) => {
  setDirectObjects(directObjects.filter((s) => s.idDo !== id));
};

// FUNCTION: Update a specific object's data
export const updateDo = (id, updates, setDirectObjects, directObjects) => {
  setDirectObjects(
    directObjects.map((s) => (s.idDo === id ? { ...s, ...updates } : s)),
  );
};

// FUNCTION: Reset the active direct object to default values
export const resetCurrentDo = (setDirectObjects, directObjects, id) => {
  setDirectObjects(
    directObjects.map((s) =>
      s.idDo === id
        ? {
            ...s,
            name: "",
            frontArea: "",
            sideArea: "",
            weight: "",
            zHeight: "",
            nnC: "",
            quantity: "1",
            fixAngle: "",
          }
        : s,
    ),
  );
};

// ====================================================
// Function for Overhead Wire Input
// ====================================================
// FUNCTION: Add a new Overhead Wire (max 8 OHW) By Input
export const syncOhwByInput = (
  inputValue,
  overheadWires,
  setOverheadWires,
  ohwIdRef,
  onConfirmReduce, // callback untuk modal konfirmasi
) => {
  const targetCount = Number(inputValue);

  if (!targetCount || targetCount < 0) return;

  const safeTarget = Math.min(targetCount, 8);
  const currentCount = overheadWires.length;

  // case 1: imput jumlah yang sama
  if (safeTarget === currentCount) return;

  // case 2: tambah object
  if (safeTarget > currentCount) {
    const addCount = safeTarget - currentCount;

    const newItems = [];
    for (let i = 0; i < addCount; i++) {
      ohwIdRef.current += 1;
      newItems.push({
        idOhw: ohwIdRef.current.toString(),
        name: "",
        weight: "",
        diameter: "",
        zHeight: "",
        span: "",
        saggingRatio: "",
        nnC: "",
        fixAngle: "",
        verticalAngle: "",
      });
    }

    setOverheadWires([...overheadWires, ...newItems]);
    return;
  }

  // case 3: kurangi object
  if (safeTarget < currentCount) {
    onConfirmReduce({
      from: currentCount,
      to: safeTarget,
    });
  }
};

// FUNCTION: Add a new overhead wire (max 8 OHW) By Click
export const addOhw = (overheadWires, setOverheadWires, ohwIdRef) => {
  if (overheadWires.length >= 8) return;

  ohwIdRef.current += 1;
  const newId = ohwIdRef.current.toString();

  setOverheadWires([
    ...overheadWires,
    {
      idOhw: newId,
      name: "",
      weight: "",
      diameter: "",
      zHeight: "",
      span: "",
      saggingRatio: "",
      nnC: "",
      fixAngle: "",
      verticalAngle: "",
    },
  ]);
};

// FUNCTION: Copy Overhead Wire data to clipboard
export const copyOhw = (overheadWire, setOhwClipboard) => {
  setOhwClipboard({
    name: overheadWire.name,
    weight: overheadWire.weight,
    diameter: overheadWire.diameter,
    zHeight: overheadWire.zHeight,
    span: overheadWire.span,
    saggingRatio: overheadWire.saggingRatio,
    nnC: overheadWire.nnC,
    fixAngle: overheadWire.fixAngle,
    verticalAngle: overheadWire.verticalAngle,
  });
};

// FUNCTION: Paste clipboard data into a specific Overhead Wire
export const pasteOhw = (id, setOverheadWires, ohwClipboard) => {
  if (!ohwClipboard) return;

  setOverheadWires((prev) =>
    prev.map((ohwItem) =>
      ohwItem.idOhw === id ? { ...ohwItem, ...ohwClipboard } : ohwItem,
    ),
  );
};

// FUNCTION: Remove a Overhead Wire by ID
export const removeOhw = (id, overheadWires, setOverheadWires) => {
  setOverheadWires(overheadWires.filter((s) => s.idOhw !== id));
};

// FUNCTION: Update a specific overhead wire's data
export const updateOhw = (id, updates, setOverheadWires, overheadWires) => {
  setOverheadWires(
    overheadWires.map((s) => (s.idOhw === id ? { ...s, ...updates } : s)),
  );
};

// FUNCTION: Reset the active overhead wire to default values
export const resetCurrentOhw = (setOverheadWires, overheadWires, id) => {
  setOverheadWires(
    overheadWires.map((s) =>
      s.idOhw === id
        ? {
            ...s,
            name: "",
            weight: "",
            diameter: "",
            zHeight: "",
            span: "",
            saggingRatio: "",
            nnC: "",
            fixAngle: "",
            verticalAngle: "",
          }
        : s,
    ),
  );
};

// ====================================================
// Function for Arm Input
// ====================================================
// FUNCTION: Add a new arm (max 6 arm)
export const addArm = (arms, setArms, setActiveTabArm, armIdRef) => {
  if (arms.length >= 6) return;

  armIdRef.current += 1;
  const newId = armIdRef.current.toString();

  setArms([
    ...arms,
    {
      idArm: newId,
      name: "",
      material: "STK400",
      diameter: "",
      thickness: "",
      length: "",
      expLength: "",
      zHeight: "",
      hDistance: "",
      fixAngle: "",
      nnC: "",
      quantity: "1",

      armObjects: [],
    },
  ]);

  setActiveTabArm(newId); // set newly added arm as active
};

// FUNCTION: Copy Arm data to clipboard
export const copyArm = (arm, setArmClipboard) => {
  setArmClipboard({
    name: arm.name,
    material: arm.material,
    diameter: arm.diameter,
    thickness: arm.thickness,
    length: arm.length,
    expLength: arm.expLength,
    zHeight: arm.zHeight,
    hDistance: arm.hDistance,
    fixAngle: arm.fixAngle,
    nnC: arm.nnC,
    quantity: arm.quantity,
  });
};

// FUNCTION: Paste clipboard data into a specific Arm
export const pasteArm = (idArm, setArms, armClipboard) => {
  if (!armClipboard) return;

  setArms((prev) =>
    prev.map((armItem) =>
      armItem.idArm === idArm ? { ...armItem, ...armClipboard } : armItem,
    ),
  );
};

// FUNCTION: Remove a arm by ID
export const removeArm = (idArm, setArms, activeTabArm, setActiveTabArm) => {
  setArms((prevArms) => {
    const index = prevArms.findIndex((s) => s.idArm === idArm);
    if (index === -1) return prevArms;

    const newArms = prevArms.filter((s) => s.idArm !== idArm);

    // pindah tab kalau yang aktif dihapus
    if (activeTabArm === idArm) {
      if (newArms.length > 0) {
        const newIndex = index > 0 ? index - 1 : 0;
        setActiveTabArm(newArms[newIndex].idArm);
      } else {
        setActiveTabArm("");
      }
    }

    return newArms;
  });
};

// FUNCTION: Update a specific arm's data
export const updateArm = (idArm, updates, setArms, arms) => {
  setArms(arms.map((s) => (s.idArm === idArm ? { ...s, ...updates } : s)));
};

// FUNCTION: Reset the active arm to default values
export const resetCurrentArm = (setArms, arms, activeTabArm) => {
  setArms(
    arms.map((s) =>
      s.idArm === activeTabArm
        ? {
            ...s,
            name: "",
            material: "STK400",
            diameter: "",
            thickness: "",
            length: "",
            expLength: "",
            zHeight: "",
            hDistance: "",
            fixAngle: "",
            nnC: "",
            quantity: "1",
          }
        : s,
    ),
  );
};

// ====================================================
// Function for Arm Object Input
// ====================================================
// FUNCTION: Add a new arm object (max 5 object) By Input
export const syncAoByInput = (
  inputValue,
  armObjects,
  updateActiveArmObjects,
  aoIdRef,
  onConfirmReduce,
) => {
  const target = Math.min(Number(inputValue), 5);
  if (!target || target < 0) return;

  const current = armObjects.length;

  if (target === current) return;

  if (target > current) {
    const addCount = target - current;

    const newItems = Array.from({ length: addCount }, () => {
      aoIdRef.current += 1;

      return {
        idAo: aoIdRef.current.toString(),
        name: "",
        type: "omni",
        frontArea: "",
        sideArea: "",
        weight: "",
        zHeight: "",
        fixAngle: "",
        nnC: "",
        quantity: "1",
      };
    });

    updateActiveArmObjects([...armObjects, ...newItems]);
    return;
  }

  onConfirmReduce({ from: current, to: target });
};

// FUNCTION: Add a new arm object (max 5 object) By Click
export const addAo = (armObjects, updateActiveArmObjects, aoIdRef) => {
  if (armObjects.length >= 5) return;

  aoIdRef.current += 1;

  updateActiveArmObjects([
    ...armObjects,
    {
      idAo: aoIdRef.current.toString(),
      name: "",
      type: "omni",
      frontArea: "",
      sideArea: "",
      weight: "",
      zHeight: "",
      fixAngle: "",
      nnC: "",
      quantity: "1",
    },
  ]);
};

// FUNCTION: Copy Arm Object data to clipboard
export const copyAo = (armObject, setAoClipboard) => {
  setAoClipboard({
    name: armObject.name,
    type: armObject.type,
    frontArea: armObject.frontArea,
    sideArea: armObject.sideArea,
    weight: armObject.weight,
    zHeight: armObject.zHeight,
    fixAngle: armObject.fixAngle,
    nnC: armObject.nnC,
    quantity: armObject.quantity,
  });
};

// FUNCTION: Paste clipboard data into a specific Arm Object
export const pasteAo = (
  idAo,
  armObjects,
  updateActiveArmObjects,
  clipboard,
) => {
  if (!clipboard) return;

  updateActiveArmObjects(
    armObjects.map((o) => (o.idAo === idAo ? { ...o, ...clipboard } : o)),
  );
};

// FUNCTION: Remove a Arm object by ID
export const removeAo = (idAo, armObjects, updateActiveArmObjects) => {
  updateActiveArmObjects(armObjects.filter((o) => o.idAo !== idAo));
};

// FUNCTION: Update a specific object's data
export const updateAo = (idAo, updates, armObjects, updateActiveArmObjects) => {
  updateActiveArmObjects(
    armObjects.map((o) => (o.idAo === idAo ? { ...o, ...updates } : o)),
  );
};

// FUNCTION: Reset the active arm object to default values
export const resetCurrentAo = (idAo, armObjects, updateActiveArmObjects) => {
  updateActiveArmObjects(
    armObjects.map((o) =>
      o.idAo === idAo
        ? {
            ...o,
            name: "",
            frontArea: "",
            sideArea: "",
            weight: "",
            zHeight: "",
            fixAngle: "",
            nnC: "",
            quantity: "1",
          }
        : o,
    ),
  );
};

// ====================================================
// Function for Opening Part Input
// ====================================================
// FUNCTION: Update opening part type data
export const updateOpeningType = (openingType, updates, setOpeningType) => {
  setOpeningType({ ...openingType, ...updates });
};

// FUNCTION: Update opening part box type data
export const updateBoxType = (boxType, updates, setBoxType) => {
  setBoxType({ ...boxType, ...updates });
};

// FUNCTION: Update opening part r type data
export const updateRType = (rType, updates, setRType) => {
  setRType({ ...rType, ...updates });
};

// ====================================================
// Function for Baseplate Input
// ====================================================
// FUNCTION: Update baseplate type data
export const updateBaseplateType = (
  baseplateType,
  updates,
  setBaseplateType,
) => {
  setBaseplateType({ ...baseplateType, ...updates });
};

// FUNCTION: Update baseplate 4 rib type data
export const updateFourRibType = (fourRibType, updates, setFourRibType) => {
  setFourRibType({ ...fourRibType, ...updates });
};

// FUNCTION: Update baseplate 8 rib type data
export const updateEightRibType = (eightRibType, updates, setEightRibType) => {
  setEightRibType({ ...eightRibType, ...updates });
};

// ====================================================
// Function for Foundation Input
// ====================================================
// FUNCTION: Update foundation type data
export const updateFoundationType = (
  foundationType,
  updates,
  setFoundationType,
) => {
  setFoundationType({ ...foundationType, ...updates });
};

// FUNCTION: Update foundation square caisson type data
export const updateSquareCaisson = (
  squareCaisson,
  updates,
  setSquareCaisson,
) => {
  setSquareCaisson({ ...squareCaisson, ...updates });
};

// FUNCTION: Update foundation round caisson type data
export const updateRoundCaisson = (roundCaisson, updates, setRoundCaisson) => {
  setRoundCaisson({ ...roundCaisson, ...updates });
};
