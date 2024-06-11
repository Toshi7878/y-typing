import Dexie, { type EntityTable } from "dexie";

interface EditorOption {
  id: number;
  optionName: string;
  value: string | number | boolean;
}

const db = new Dexie("AppDB") as Dexie & {
  editorOption: EntityTable<
    EditorOption,
    "id" // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  editorOption: "optionName", // primary key "id" and unique "optionName"
});

export type { EditorOption };
export { db };
