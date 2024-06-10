export const DBConfig = {
  name: "AppDB",
  version: 1,
  objectStoresMeta: [
    {
      store: "editorOption",
      storeConfig: { keyPath: "optionName", autoIncrement: true },
      storeSchema: [{ name: "optionName", keypath: "optionName", options: { unique: true } }],
    },
  ],
};
