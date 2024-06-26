import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, formatCount } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import { Download, ThumbsUp } from "lucide-react";
import { CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Hit({ hit }: any) {
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();

  const {
    metrics: { downloadCount, thumbsUpCount },
    user: { username: creator },
    version: { id: modelVersion },
    images: [firstAsset],
  } = hit;
  const isVideo = firstAsset?.type === "video";
  const assetUrl = `https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/${firstAsset?.url}/${firstAsset?.name}`;

  return (
    <motion.div
      className="space-y-3 p-2 group cursor-pointer hover:bg-muted transition duration-200 rounded-lg"
      onHoverStart={() => controls.start({ y: 0, opacity: 1 })}
      onHoverEnd={() => controls.start({ y: 20, opacity: 0 })}
    >
      <Link
        href={`https://civitai.com/model-versions/${modelVersion}`}
        target="_blank"
      >
        <div className="relative overflow-hidden rounded-md aspect-[4/5]">
          {isVideo ? (
            <video
              src={assetUrl}
              className="object-cover object-top duration-200 ease-in-out hover:scale-105 cursor-pointer"
              autoPlay
              loop
              muted
              onLoadStart={() => setIsLoading(false)}
            />
          ) : (
            <Image
              fill={true}
              src={assetUrl}
              alt={hit.name}
              className={cn(
                "object-cover object-top duration-200 ease-in-out hover:scale-105 cursor-pointer",
                isLoading
                  ? "scale-120 blur-3xl grayscale"
                  : "scale-100 blur-0 grayscale-0"
              )}
              onLoad={() => setIsLoading(false)}
            />
          )}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={controls}
            transition={{ duration: 0.2 }}
            className="absolute bottom-10 right-6 h-10 w-10"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className={cn(
                      "h-11 w-11 rounded-3xl shadow-xl bg-gradient-to-b text-white dark:text-black dark:from-white dark:to-blue-50 ring-2 ring-blue-50 ring-opacity-60",
                      "from-slate-800 to-slate-700 ring-slate-400",
                      "hover:rounded-lg transition-all duration-200"
                    )}
                  >
                    <CheckIcon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="text-xs">
                  Use model
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        </div>
      </Link>

      <div className="space-y-1.5 text-sm">
        <div className="flex flex-col gap-1">
          <h3 className="font-medium leading-none">{hit.name}</h3>
          <p className="text-xs font-semibold text-muted-foreground">
            {creator}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <p className="flex gap-1 text-xs text-muted-foreground items-center">
            <Download className="h-3 w-3" /> {formatCount(downloadCount)}
          </p>
          <p className="flex gap-1 text-xs text-muted-foreground items-center">
            <ThumbsUp className="h-3 w-3" /> {formatCount(thumbsUpCount)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
