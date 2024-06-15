"use client";

import { useSession } from "next-auth/react";
import { Button, Input, FormControl, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { nameSchema } from "./validationSchema";
import { actions } from "./actions";
import { useFormState } from "react-dom";

// eslint-disable-next-line @next/next/no-async-client-component
interface FormData {
  newName: string;
}

export default function NewNameDialog() {
  const initialState = { newName: "", message: "", status: 0 };

  const [state, formAction] = useFormState(actions, initialState);
  const { data: session, update } = useSession();

  const toast = useToast();
  const {
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(nameSchema),
  });

  useEffect(() => {
    async function handleStateChange() {
      if (state.status && state.status !== 200) {
        toast({
          id: "name-error-toast",
          title: "入力エラー",
          description: state.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else if (state.status === 200) {
        await update({ ...session?.user, name: state.newName });
        window.location.href = "/";
      }
    }
    handleStateChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction}>
      <div className="grid gap-4 py-4">
        <FormControl isInvalid={!!errors.newName}>
          <label htmlFor="name">
            名前を入力してください。半角英数字とアンダーバー( _ )のみ使うことができます
          </label>
          <Input
            size="lg"
            id="name"
            {...register("newName")}
            placeholder="名前を入力してね"
            required
          />
        </FormControl>
        <Button colorScheme="blue" type="submit">
          保存
        </Button>
      </div>
    </form>
  );
}
