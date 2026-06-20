"use client";

import { createSuggestionItems } from "@carbon/tiptap";
import type { EditorView } from "@tiptap/pm/view";
import { useLingui } from "@lingui/react/macro";
import { useMemo } from "react";
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuImage,
  LuList,
  LuListOrdered,
  LuSquareCheck,
  LuText
} from "react-icons/lu";

export const useSuggestionItems = (
  uploadFn: (file: File, view: EditorView, pos: number) => void
) => {
  const { t } = useLingui();
  return useMemo(() => createSuggestionItems([
    {
      title: t`Text`,
      description: t`Just start typing with plain text.`,
      searchTerms: ["p", "paragraph"],
      icon: <LuText size={18} />,
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .run();
      }
    },
    {
      title: t`To-do List`,
      description: t`Track tasks with a to-do list.`,
      searchTerms: ["todo", "task", "list", "check", "checkbox"],
      icon: <LuSquareCheck size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      }
    },
    {
      title: t`Heading 1`,
      description: t`Big section heading.`,
      searchTerms: ["title", "big", "large"],
      icon: <LuHeading1 size={18} />,
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 1 })
          .run();
      }
    },
    {
      title: t`Heading 2`,
      description: t`Medium section heading.`,
      searchTerms: ["subtitle", "medium"],
      icon: <LuHeading2 size={18} />,
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 2 })
          .run();
      }
    },
    {
      title: t`Heading 3`,
      description: t`Small section heading.`,
      searchTerms: ["subtitle", "small"],
      icon: <LuHeading3 size={18} />,
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 3 })
          .run();
      }
    },
    {
      title: t`Bullet List`,
      description: t`Create a simple bullet list.`,
      searchTerms: ["unordered", "point"],
      icon: <LuList size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      }
    },
    {
      title: t`Numbered List`,
      description: t`Create a list with numbering.`,
      searchTerms: ["ordered"],
      icon: <LuListOrdered size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      }
    },
    {
      title: t`Image`,
      description: t`Upload an image from your computer.`,
      searchTerms: ["photo", "picture", "media"],
      icon: <LuImage size={18} />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run();
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async () => {
          if (input.files?.length) {
            const file = input.files[0]!;
            const pos = editor.view.state.selection.from;
            uploadFn(file, editor.view, pos);
          }
        };
        input.click();
      }
    }
  ]), [uploadFn, t]);
};
