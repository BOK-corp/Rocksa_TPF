interface Props {
  value: number;
  onChange: (qty: number) => void;
  min?: number;
}

export const QtyStepper = ({ value, onChange, min = 1 }: Props) => (
  <div className="inline-flex items-center rounded-full border border-ink-700/10">
    <button
      type="button"
      aria-label="Decrease quantity"
      disabled={value <= min}
      onClick={() => onChange(Math.max(min, value - 1))}
      className="inline-flex h-8 w-8 items-center justify-center text-ink-500 hover:text-ink-900 disabled:opacity-40"
    >
      −
    </button>
    <span className="min-w-8 text-center text-sm font-medium text-ink-900">
      {value}
    </span>
    <button
      type="button"
      aria-label="Increase quantity"
      onClick={() => onChange(value + 1)}
      className="inline-flex h-8 w-8 items-center justify-center text-ink-500 hover:text-ink-900"
    >
      +
    </button>
  </div>
);
