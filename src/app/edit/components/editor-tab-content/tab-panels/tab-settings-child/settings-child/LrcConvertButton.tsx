"use client";
import { Button, FormLabel, HStack, useToast } from "@chakra-ui/react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/edit/redux/store";
import { ImportFile } from "@/app/edit/ts/tab/settings/importFile";
import { useSetIsLrcConvertingAtom } from "@/app/edit/edit-atom/editAtom";

interface LrcConvertButtonProps {
  selectedConvertOption: string;
}
export default function LrcConvertButton(props: LrcConvertButtonProps) {
  const dispatch = useDispatch();
  const setIsLrcConverting = useSetIsLrcConvertingAtom();
  const toast = useToast();

  const mapData = useSelector((state: RootState) => state.mapData!.value);
  const fileInputRef = useRef<HTMLInputElement>(null); // useRefを使用してfileInputRefを定義

  return (
    <HStack alignItems="baseline">
      <FormLabel fontSize="sm">譜面インポート</FormLabel>

      <input
        type="file"
        hidden
        ref={fileInputRef}
        accept=".lrc,.json" // lrcファイルとjsonファイルのみを許可)
        onChange={async (e) => {
          const file = e.target.files![0];
          try {
            setIsLrcConverting(true);

            const importFile = new ImportFile();
            await importFile.open(file, props.selectedConvertOption, dispatch, mapData);
            e.target.value = "";
          } catch (error) {
            console.error("ファイルの処理中にエラーが発生しました:", error);
            toast({
              title: "エラー",
              description: "ファイルの処理中にエラーが発生しました。",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-right",
            });
          } finally {
            setIsLrcConverting(false);
          }
        }}
      />

      <Button colorScheme="teal" size="sm" onClick={() => fileInputRef.current?.click()}>
        lrcファイルを開く
      </Button>
    </HStack>
  );
}
