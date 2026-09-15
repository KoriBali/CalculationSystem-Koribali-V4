// Dummy "Checked By" personnel list — the backend doesn't expose a
// personnel/employee master data endpoint yet, so this stands in until
// that's wired up. Swap for a real master-data fetch (same pattern as
// useMasterData's departmentOptions) once it exists.
export const checkedByOptions = [
  { value: "Tanaka Hiroshi", label: "Tanaka Hiroshi" },
  { value: "Suzuki Yuki", label: "Suzuki Yuki" },
  { value: "Sato Kenji", label: "Sato Kenji" },
  { value: "Yamamoto Akira", label: "Yamamoto Akira" },
  { value: "Nakamura Satoshi", label: "Nakamura Satoshi" },
  { value: "Kobayashi Takashi", label: "Kobayashi Takashi" },
];
