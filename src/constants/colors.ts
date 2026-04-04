export interface ColorPreset {
  value: string;
  label: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  { value: "#2A6FBB", label: "Blue" },
  { value: "#CC0000", label: "Red" },
  { value: "#28A745", label: "Green" },
  { value: "#FF6B00", label: "Orange" },
  { value: "#9B59B6", label: "Purple" },
  { value: "#E91E63", label: "Pink" },
];

export const DEFAULT_COLOR = "#2A6FBB";
