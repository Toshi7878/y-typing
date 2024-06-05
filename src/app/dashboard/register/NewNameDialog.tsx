"use client";

import { useSession } from "next-auth/react";
import { Button, Input, FormControl, useToast } from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { nameSchema } from "./validationSchema";

// eslint-disable-next-line @next/next/no-async-client-component
interface FormData {
  newName: string;
}

export default function NewNameDialog() {
  const { data: session, update } = useSession();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(nameSchema),
  });

  useEffect(() => {
    if (errors.newName) {
      toast({
        id: "name-error-toast",
        title: "入力エラー",
        description: errors.newName.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [errors.newName, toast]);

  const handleNameSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await fetch("/api/set-name", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: data.newName }),
      });

      await update({ ...session?.user, name: data.newName });

      window.location.href = "/"; // ホームページに移動
    } catch (error) {
      console.error("名前の更新中にエラーが発生しました:", error);
      toast({
        id: "name-error-toast",
        title: "エラー",
        description: "名前の更新中にエラーが発生しました。",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleNameSubmit)}>
      <div className="grid gap-4 py-4">
        <FormControl isInvalid={!!errors.newName}>
          <label htmlFor="name">名前を入力してください</label>
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
