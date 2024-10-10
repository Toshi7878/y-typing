import { EditorNewMapBackUpInfoData } from "@/app/edit/ts/type";
import { MapData } from "@/app/type/ts/type";
import { IndexDBOption } from "@/types";
import Dexie, { type EntityTable } from "dexie";

const db = new Dexie("AppDB") as Dexie & {
  editorOption: EntityTable<
    IndexDBOption,
    "id" // primary key "id" (for the typings only)
  >;
  editorNewCreateBak: EntityTable<
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
db.version(14).stores({
  editorOption: "optionName", // primary key "id" and unique "optionName"
  editorNewCreateBak: "optionName",
  globalOption: "optionName",
  typingOption: "optionName",
});

export const sendEditorOptionIndexedDBData = async (target: HTMLInputElement) => {
  db.editorOption.put({ optionName: target.name, value: target.value });
};

export const sendEditorNewCreateBakIndexedDBData = async (
  newMapInfo: EditorNewMapBackUpInfoData,
  newMapData: MapData[],
) => {
  db.editorNewCreateBak.put({ optionName: "backupMapInfo", value: newMapInfo });
  db.editorNewCreateBak.put({ optionName: "backupMapData", value: newMapData });
};

export const useInitializeEditorCreateBak = () => {
  return async () => {
    await db.editorNewCreateBak.clear();
  };
};

export { db };
