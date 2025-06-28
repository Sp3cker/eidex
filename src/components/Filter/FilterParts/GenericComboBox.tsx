import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useState, useRef, ReactNode, useEffect } from "react";
import { MdSearch, MdClose } from "react-icons/md";

export type ComboBoxEntry = { id: number; name: string };

type GenericComboBoxProps = {
  entries: ComboBoxEntry[];
  onSelect: (entry: ComboBoxEntry | null) => void;
  placeholder?: string;
  icon?: ReactNode;
  value?: ComboBoxEntry | null;
};

const renderOption = ({ option: entry }: { option: ComboBoxEntry }) => (
  <ComboboxOption
    key={entry.id}
    value={entry}
    className="data-focus:bg-gray-600 w-full cursor-pointer px-3 py-2 text-neutral-50"
  >
    {entry.name}
  </ComboboxOption>
);
const renderDisplayValue = (entry: ComboBoxEntry) => entry?.name;

function GenericComboBox({
  entries,
  onSelect,
  placeholder,
  icon = <MdSearch size={20} />,
  value = null,
}: GenericComboBoxProps) {
  const [selected, setSelected] = useState<ComboBoxEntry | null>(value);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const filteredEntries =
    query === ""
      ? entries
      : entries.filter((entry) =>
          entry.name.toLowerCase().includes(query.toLowerCase()),
        );

  const handleChange = (entry: ComboBoxEntry | null) => {
    setSelected(() => {
      onSelect(entry);
      return entry;
    });
  };

  const handleClose = () => {
    setTimeout(() => {
      inputRef.current?.blur();
    }, 0);
  };
  const handleClear = () => {
    setSelected(null);
    setQuery("");
    onSelect(null);
  };
  const handleSetQuery = (event: React.ChangeEvent<HTMLInputElement>) =>
    setQuery(event.target.value);

  return (
    <div
      ref={parentRef}
      className="relative flex w-full items-center rounded-md bg-neutral-800 px-2"
    >
      <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-gray-400">
        {icon}
      </span>
      <Combobox
        value={selected}
        onChange={handleChange}
        onClose={handleClose}
        immediate={true}
        virtual={{ options: filteredEntries }}
      >
        <ComboboxInput
          ref={inputRef}
          aria-label="Enter something"
          displayValue={renderDisplayValue}
          onChange={handleSetQuery}
          placeholder={placeholder || "Select an entry..."}
          className="font-pkmnem h-9 w-full rounded-md border-0 bg-neutral-800 pl-8 text-sm text-xl text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-400"
        />
        <span
          className="ml-2 inline-flex cursor-pointer select-none items-center text-gray-100 transition-colors hover:text-red-400 active:text-fuchsia-600"
          onClick={handleClear}
        >
          <MdClose size={20} />
        </span>
        <ComboboxOptions
          anchor="bottom start"
          className="w-(--input-width) font-pkmnem kerning-wide no-scrollbar rounded-sm border border-gray-600 bg-gray-800 text-xl text-white shadow-md [--anchor-gap:4px]"
        >
          {renderOption}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}

export default GenericComboBox;
