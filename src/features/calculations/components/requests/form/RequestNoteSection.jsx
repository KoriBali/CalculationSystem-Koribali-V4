import { AutoGrowTextarea } from "../../../../../shared/components/AutoGrowTextarea";
import { inputStyle } from "./formStyles";
import { SectionCard, SectionTitle } from "./FormPrimitives";

// Last section of both forms: a full-width free note for anything the fields
// above don't cover. Grows with the text up to ~10 lines, then scrolls.
export function RequestNoteSection({ value, onChange }) {
  return (
    <div>
      <SectionTitle tag="Optional">Request Note</SectionTitle>
      <SectionCard>
        <AutoGrowTextarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Request note"
          placeholder="Anything the team should know about this request, e.g. reference drawings or special instructions."
          className={inputStyle()}
        />
      </SectionCard>
    </div>
  );
}
