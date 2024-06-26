"use client";

import React, { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useTheme } from "next-themes";
import { mix, rgba } from "polished";
import { NodeResizer, type NodeProps } from "reactflow";

import { useAppStore } from "@/store";
import { type Widget, ImageItem } from "@/types";
import { Input } from "@/components/ui/input";
import { ColorMenu, colorList } from "@/components/node/color-menu";
import { Progress } from "@/components/ui/progress";

import SdNode from "./sd-node";
import { GroupCard } from "./style";
import NodeCard from "./sd-node/node-card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuSeparator,
} from "../ui/context-menu";
import {
  CopyIcon,
  Pencil1Icon,
  ShadowIcon,
  TrashIcon,
} from "@radix-ui/react-icons";

export const NODE_IDENTIFIER = "sdNode";

export interface ImagePreview {
  image: ImageItem;
  index: number;
}

const NodeComponent = (node: NodeProps<Widget>) => {
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { theme } = useTheme();
  const [nicknameInput, setNicknameInput] = useState(false);

  const { progressBar, onDuplicateNode, onDeleteNode, onModifyChange } =
    useAppStore(
      useShallow((st) => ({
        progressBar:
          st.nodeInProgress?.id === node.id
            ? st.nodeInProgress.progress
            : undefined,
        onDuplicateNode: st.onDuplicateNode,
        onDeleteNode: st.onDeleteNode,
        onModifyChange: st.onModifyChange,
      }))
    );
  const isInProgress = progressBar !== undefined;
  const isSelected = node.selected;
  const name = node.data?.nickname || node.data.name;
  const isGroup = node.data.name === "Group";

  const handleNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nickname = e.target.value;
    onModifyChange(node.id, "nickname", nickname);
    setNicknameInput(false);
  };

  const handleNodeColor = (key: string) => {
    onModifyChange(node.id, "color", key);
  };

  useEffect(() => {
    if (ref.current) {
      const parent = ref.current.parentNode as HTMLElement;
      parent.setAttribute("type", node.data.name);
      ref.current.setAttribute("type", node.data.name);
    }
  }, [node.data.name]);

  useEffect(() => {
    if (nicknameInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [nicknameInput]);

  const Title = () => {
    return (
      <div className="grid grid-cols-2 items-center w-full">
        {nicknameInput ? (
          <Input
            ref={inputRef}
            defaultValue={name}
            onKeyDown={(e) => {
              if (e.key === "Backspace") {
                e.stopPropagation();
              }
            }}
            onBlur={handleNickname}
            className="nodrag"
          />
        ) : (
          <div
            className={`w-fit inline-flex h-9 px-4 ${
              isInProgress ? "animate-shimmer" : ""
            } text-sm items-center justify-center rounded-full border border-opacity-40 dark:border-slate-800 bg-[linear-gradient(110deg,rgba(240,241,243,0.5),45%,rgba(254,254,254,0.5),55%,rgba(240,241,243,0.5))] dark:bg-[linear-gradient(110deg,rgba(0,1,3,0.5),45%,rgba(30,38,49,0.5),55%,rgba(0,1,3,0.5))] bg-[length:200%_100%]`}
          >
            {name}
          </div>
        )}

        {isInProgress
          ? progressBar > 0 && (
              <Progress
                className="h-2 w-full border"
                value={Math.floor(progressBar * 100)}
              />
            )
          : null}
      </div>
    );
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <NodeCard active={isInProgress} title={<Title />} node={node}>
          <SdNode {...node} />
        </NodeCard>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem
          key="rename"
          onClick={() => setNicknameInput(true)}
          className="gap-2"
        >
          <Pencil1Icon />
          Rename
        </ContextMenuItem>

        <ContextMenuSub key="colors">
          <ContextMenuSubTrigger className="gap-2">
            <ShadowIcon />
            Colors
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {ColorMenu.map((child, index) => (
              <ContextMenuItem
                key={index}
                className="gap-3"
                onClick={() => handleNodeColor(child.name as string)}
              >
                {child.name ? child.label : "None"}
                {/* @ts-ignore */}
                {child.name.charAt(0).toUpperCase() + child.name.slice(1)}
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuItem
          key="copy"
          onClick={() => onDuplicateNode(node.id)}
          className="gap-2"
        >
          <CopyIcon />
          Copy
        </ContextMenuItem>

        <ContextMenuItem
          key="delete"
          onClick={() => onDeleteNode(node.id)}
          className="gap-2"
        >
          <TrashIcon />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default React.memo(NodeComponent);
