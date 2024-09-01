import { IndexDBOption } from "@/types";
import Dexie, { type EntityTable } from "dexie";

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

export const sendIndexedDB = async (target: HTMLInputElement) => {
  db.editorOption.put({ optionName: target.name, value: target.value });
};

export { db };
