"use client";

interface DisplayOptionsValue {
  name: boolean;
  types: boolean;
  info: boolean;
}

interface DisplayOptionsToggleProps {
  value: DisplayOptionsValue;
  onChange: (next: DisplayOptionsValue) => void;
}

export default function DisplayOptionsToggle({
  value,
  onChange,
}: DisplayOptionsToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={value.name}
          onChange={(e) =>
            onChange({ ...value, name: e.currentTarget.checked })
          }
        />
        Name
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={value.types}
          onChange={(e) =>
            onChange({ ...value, types: e.currentTarget.checked })
          }
        />
        Types
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={value.info}
          onChange={(e) =>
            onChange({ ...value, info: e.currentTarget.checked })
          }
        />
        Informations
      </label>
    </div>
  );
}
