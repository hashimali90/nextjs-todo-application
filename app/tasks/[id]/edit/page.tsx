"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Task {
  id: string;
  title: string;
}

export default function EditTask({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { status } = useSession();
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchTask();
    }
  }, [status, router]);

  const fetchTask = async () => {
    const response = await fetch(`/api/tasks/${params.id}`);
    const data = await response.json();
    setTask(data);
    setTitle(data.title);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await fetch(`/api/tasks/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    router.push("/dashboard");
  };

  if (status === "loading" || !task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Task</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />
            <div className="flex gap-4">
              <Button type="submit">Update Task</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}