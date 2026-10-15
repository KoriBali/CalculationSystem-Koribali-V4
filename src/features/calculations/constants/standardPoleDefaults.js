// Default specifications for Standard Pole additional components (Opening & Baseplate)
export const STANDARD_OPENING_TYPE = {
  type: "box",
};

export const STANDARD_BOX_TYPE = {
  boxHeight: "6", // Box Thickness = 6
  boxWidth: "150", // Box Width = 150
  opWidth: "130", // Cut Width = 130
  opSurfaceHeight: "600", // Opening Cut Length = 600
  opLength: "750", // Opening Center Height = 750
  openingDirection: "",
};

export const STANDARD_BASEPLATE_TYPE = {
  type: "4rib",
};

export const STANDARD_FOUR_RIB_TYPE = {
  bpWidthEW: "350", // Baseplate Width = 350
  bpWidthNS: "350", // Baseplate Width = 350
  anchorPitchEW: "250", // Anchor Pitch = 250
  anchorPitchNS: "250", // Anchor Pitch = 250
  anchorDia: "24", // Anchor Bolt Diameter = 24
  anchorCount: "4",
  anchorCountTension: "2",
  ribHeight: "180", // Rib Plate Height = 180
  bpThickness: "25", // Baseplate Thickness = 25
  weldLeg: "6", // Welding Length = 6
  ribScallop: "25", // Rib Plate Scallop = 25
  ribLength: "120", // Rib Plate Length = 120
  ribThickness: "12", // Rib Plate Thickness = 12
};
