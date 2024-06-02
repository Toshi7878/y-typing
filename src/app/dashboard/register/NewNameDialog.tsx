"use client";

import { useState } from "react";
import { useSession } from "next-auth/react"; // adding import
import { Button, Input } from "@chakra-ui/react";

interface NameProps {
  name: string;
}

// eslint-disable-next-line @next/next/no-async-client-component
export default function NewNameDialog() {
  const [newName, setNewName] = useState("");
  const { data: session, update } = useSession();

  const handleNameSubmit = async (newName: string) => {
    try {
      await fetch("/api/set-name", {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ name: newName }),
      });

      await update({ ...session?.user, name: newName });

      window.location.href = "/"; // ホームページに移動
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleNameSubmit(newName);
      }}
    >
      <div className="grid gap-4 py-4">
        <label htmlFor="name">名前を入力してください</label>
        <Input
          size="lg"
          id="name"
          name="new-name"
          required
          className="input"
          placeholder="名前を入力してね"
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button colorScheme="blue" type="submit">
          保存
        </Button>
      </div>
    </form>
  );
}
