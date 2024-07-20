import { kpmAtom } from "@/app/type/(atoms)/gameRenderAtoms";
import { useRefs } from "@/app/type/(contexts)/refsProvider";
import { useAtom } from "jotai";
import { forwardRef, memo, useEffect, useImperativeHandle, useState } from "react";

export interface StatusKpmValueRef {
  getKpm: () => number;
  setKpm: (kpm: number) => void;
}
const StatusKpmValue = forwardRef((props, ref) => {
  const [kpm, setKpm] = useAtom(kpmAtom);
  const { setRef } = useRefs();

  useImperativeHandle(ref, () => ({
    getKpm: () => kpm,
    setKpm: (kpm: number) => setKpm(kpm),
  }));

  useEffect(() => {
    if (ref && "current" in ref) {
      setRef("statusKpmValueRef", ref.current!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kpm]);

  return <span className="value">{kpm}</span>;
});

StatusKpmValue.displayName = "StatusKpmValue";

export default memo(StatusKpmValue);
