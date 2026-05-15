// Function to convert a "YYYY-MM-DD" date string into Japanese format "YYYY年M月D日"
export const formatDateYS = (dateString) => {
  if (!dateString) return "";

  const [y, m, d] = dateString.split("-");

  return (
    <>
      <span className="latin">{y}</span>
      <span className="jp">年</span>
      <span className="latin">{parseInt(m)}</span>
      <span className="jp">月</span>
      <span className="latin">{parseInt(d)}</span>
      <span className="jp">日</span>
    </>
  );
};

// Function to convert a "YYYY-MM-DD" date string into Japanese format "YYYY年M月D日"
export const formatDateYP = (dateString) => {
  if (!dateString) return "";

  const [y, m, d] = dateString.split("-");

  return (
    <>
      <span className="jp">平成</span>
      <span className="latin">{y}</span>
      <span className="jp">年</span>
      <span className="latin">{parseInt(m)}</span>
      <span className="jp">月</span>
      <span className="latin">{parseInt(d)}</span>
      <span className="jp">日</span>
    </>
  );
};

// Function to automatically adjust font size based on text length for report cells
export function AutoFitNameCell({ text }) {
  let fontSize = "9.5pt";

  if (text.length > 20) fontSize = "7.8pt";
  else if (text.length > 19) fontSize = "8pt";
  else if (text.length > 18) fontSize = "8.5pt";
  else if (text.length > 17) fontSize = "9pt";

  return <span style={{ fontSize, lineHeight: 1 }}>{text}</span>;
}

// Function to return the corresponding design standard text based on the given key
export const getDesignStandardText = (value) => {
  switch (value) {
    case "v60":
      return "V60";
    case "jil":
      return "JIL日本照明器具工業会規格等に準拠する。";
    case "haiden":
      return "Haiden";
    default:
      return "";
  }
};

export const getDesignStandardTextMultiple = (value) => {
  switch (value) {
    case "v60":
      return "V60";
    case "jil":
      return "ＪＩＬ日本照明器具工業会規格に準拠する。";
    case "haiden":
      return "Haiden";
    default:
      return "";
  }
};

// Data Dummy Arm
const ARM_DATA = [
  {
    name: "歩信アーム1",
    weight: 227.1,
    quantity: 1,
    windLoadAreaFront: 796.5,
    frontArea: "",
    cf: "",
  },
  {
    name: "歩信アーム2",
    weight: 227.1,
    quantity: 1,
    windLoadAreaFront: 600.4,
    frontArea: 0.226,
    cf: 1.2,
  },
];

// Function to generate load table rows based on step height criteria
export const getRowsForStepPlusArm = (
  poleIndex,
  resultsPole,
  resultsDo,
  poleConfig,
) => {
  // Current pole step
  const currentStep = resultsPole[poleIndex];

  // Pole below current step (if any)
  const nextStep = resultsPole[poleIndex + 1];

  // Current pole step height
  const currentH = Number(currentStep.zHeight);

  // Height of the pole below (null if last step)
  const nextH = nextStep ? Number(nextStep.zHeight) : null;

  // The most basic lower limit
  const lowestPole = Number(poleConfig?.lowestHeight) || 0;

  const rows = [];

  // for direct object
  resultsDo.forEach((doItem) => {
    const doHeight = Number(doItem.zHeight) || 0;

    // appear in this step?
    const passHeight = nextStep ? doHeight > nextH : doHeight >= lowestPole;

    if (!passHeight) return;

    rows.push({
      type: "do",
      data: doItem,
    });
  });

  // for arm (loop static data)
  ARM_DATA.forEach((arm) => {
    rows.push({
      type: "arm",
      data: arm,
    });
  });

  // for pole
  resultsPole.forEach((pole) => {
    const poleH = Number(pole.zHeight) || 0;

    if (poleH >= currentH) {
      rows.push({
        type: "pole",
        data: pole,
      });
    }
  });

  return rows;
};

// Function to generate load table rows based on step height criteria
export const getRowsForStep = (
  poleIndex,
  resultsPole,
  resultsDo,
  poleConfig,
) => {
  // Current pole step
  const currentStep = resultsPole[poleIndex];

  // Pole below current step (if any)
  const nextStep = resultsPole[poleIndex + 1];

  // Current pole step height
  const currentH = Number(currentStep.zHeight);

  // Height of the pole below (null if last step)
  const nextH = nextStep ? Number(nextStep.zHeight) : null;

  // The most basic lower limit
  const lowestPole = Number(poleConfig?.lowestHeight) || 0;

  const rows = [];

  // for direct object
  resultsDo.forEach((doItem) => {
    const doHeight = Number(doItem.zHeight) || 0;

    // appear in this step?
    const passHeight = nextStep ? doHeight > nextH : doHeight >= lowestPole;

    if (!passHeight) return;

    rows.push({
      type: "do",
      data: doItem,
    });
  });

  // for pole
  resultsPole.forEach((pole) => {
    const poleH = Number(pole.zHeight) || 0;

    if (poleH >= currentH) {
      rows.push({
        type: "pole",
        data: pole,
      });
    }
  });

  return rows;
};
