import Dexie, { type EntityTable } from "dexie";
interface IndexDBOption {
  id: number;
  optionName: string;
  value: string | number | boolean;
}

const db = new Dexie("AppDB") as Dexie & {
  editorOption: EntityTable<
    IndexDBOption,
    "id" // primary key "id" (for the typings only)
  >;
  globalOption: EntityTable<
    IndexDBOption,
    "id" // primary key "id" (for the typings only)
  >;
  typingOption: EntityTable<
    IndexDBOption,
    "id" // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(11).stores({
  editorOption: "optionName", // primary key "id" and unique "optionName"
  globalOption: "optionName",
  typingOption: "optionName",
});

export type { IndexDBOption };
export { db };
