"use client";

import { ArrowRightIcon, PlayIcon } from "@radix-ui/react-icons";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useAppStore } from "@/store";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const loadingStates = [
  {
    text: "Buying a condo",
  },
  {
    text: "Travelling in a flight",
  },
  {
    text: "Meeting Tyler Durden",
  },
  {
    text: "He makes soap",
  },
  {
    text: "We goto a bar",
  },
  {
    text: "Start a fight",
  },
  {
    text: "We like it",
  },
  {
    text: "Welcome to F**** C***",
  },
];

export const QueuePromptButton = () => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const { onSubmit, queue, onDeleteFromQueue, promptError, onEdgesAnimate } =
    useAppStore(useShallow((state) => state));

  useEffect(() => {
    if (promptError !== undefined) {
      toast.error(promptError);
    }
  }, [promptError, count]);

  useEffect(() => {
    onEdgesAnimate(queue.length > 0);
  }, [queue, onEdgesAnimate]);

  const handleRun = useCallback(() => {
    setLoading(true);
    onSubmit();
    setCount((prevCount) => prevCount + 1);
  }, [onSubmit]);

  const queueHasItems = queue.length > 0;

  return (
    <>
      <Button
        className={cn(
          "rounded-2xl shadow-lg bg-gradient-to-b text-white dark:text-black dark:from-white dark:to-blue-50 ring-2 ring-blue-50 ring-opacity-60",
          "from-slate-800 to-slate-700 ring-slate-400",
          "hover:shadow-xl hover:rounded-lg transition-all duration-300"
        )}
        onClick={handleRun}
        size={"icon"}
      >
        <PlayIcon />
      </Button>

      {/* <Loader loadingStates={loadingStates} loading={loading} duration={2000} /> */}
    </>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-300 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-300 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};
