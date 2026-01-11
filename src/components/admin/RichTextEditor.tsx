"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { EditorState, ContentState as ContentStateType } from "draft-js";
import type { EditorProps } from "react-draft-wysiwyg";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

type EditorModules = {
  Editor: React.ComponentType<EditorProps>;
  EditorState: typeof EditorState;
  ContentState: typeof ContentStateType;
  convertToRaw: (value: ReturnType<EditorState["getCurrentContent"]>) => unknown;
  draftToHtml: (raw: unknown) => string;
  htmlToDraft: (html: string) => {
    contentBlocks: unknown[];
    entityMap: Record<string, unknown>;
  };
};

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  const [editorModule, setEditorModule] = useState<EditorModules | null>(null);
  const lastValue = useRef(value);
  const fontSizes = useMemo(
    () => [8, 9, 10, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72],
    []
  );
  const fontFamilies = useMemo(
    () => [
      "Arial",
      "Georgia",
      "Garamond",
      "Times New Roman",
      "Trebuchet MS",
      "Verdana",
      "Tahoma",
    ],
    []
  );
  const toolbar = useMemo(
    () => ({
      options: [
        "inline",
        "blockType",
        "fontSize",
        "fontFamily",
        "colorPicker",
        "list",
        "textAlign",
        "link",
        "image",
        "embedded",
        "emoji",
        "remove",
        "history",
      ],
      inline: {
        options: [
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "monospace",
          "superscript",
          "subscript",
        ],
      },
      blockType: {
        inDropdown: true,
      },
      fontSize: {
        options: fontSizes,
      },
      fontFamily: {
        options: fontFamilies,
      },
      list: {
        options: ["unordered", "ordered", "indent", "outdent"],
      },
      link: {
        showOpenOptionOnHover: true,
        defaultTargetOption: "_blank",
      },
      image: {
        previewImage: true,
        uploadCallback: async (file: File) => {
          const formData = new FormData();
          formData.append("file", file);
          const response = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });
          if (!response.ok) {
            throw new Error("Image upload failed.");
          }
          const data = await response.json();
          return { data: { link: data.url } };
        },
        alt: { present: true, mandatory: false },
      },
    }),
    [fontSizes, fontFamilies]
  );
  const customStyleMap = useMemo(() => {
    return fontSizes.reduce<Record<string, CSSProperties>>((acc, size) => {
      acc[`fontsize-${size}`] = { fontSize: `${size}px` };
      return acc;
    }, {});
  }, [fontSizes]);

  const customStyleFn = useMemo(
    () => (styles: Set<string>) => {
      const style: CSSProperties = {};
      styles.forEach((value) => {
        if (value.startsWith("fontsize-")) {
          style.fontSize = `${value.replace("fontsize-", "")}px`;
        }
        if (value.startsWith("fontfamily-")) {
          style.fontFamily = value.replace("fontfamily-", "");
        }
        if (value.startsWith("color-")) {
          style.color = value.replace("color-", "");
        }
        if (value.startsWith("bgcolor-")) {
          style.backgroundColor = value.replace("bgcolor-", "");
        }
      });
      return style;
    },
    []
  );

  useEffect(() => {
    let active = true;
    const load = async () => {
      const [{ Editor }, draftJs, draftToHtmlModule, htmlToDraftModule] =
        await Promise.all([
          import("react-draft-wysiwyg"),
          import("draft-js"),
          import("draftjs-to-html"),
          import("html-to-draftjs"),
        ]);

      if (!active) return;

      const htmlToDraft =
        (htmlToDraftModule.default ||
          htmlToDraftModule) as EditorModules["htmlToDraft"];
      const draftToHtml =
        (draftToHtmlModule.default ||
          draftToHtmlModule) as EditorModules["draftToHtml"];

      const modules: EditorModules = {
        Editor,
        EditorState: draftJs.EditorState,
        ContentState: draftJs.ContentState,
        convertToRaw: draftJs.convertToRaw,
        draftToHtml,
        htmlToDraft,
      };

      const blocksFromHtml = modules.htmlToDraft(value || "<p></p>");
      const contentState = modules.ContentState.createFromBlockArray(
        blocksFromHtml.contentBlocks,
        blocksFromHtml.entityMap
      );
      const initialState = modules.EditorState.createWithContent(contentState);
      lastValue.current = value;
      setEditorModule(modules);
      setEditorState(initialState);
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!editorModule || !editorState) return;
    if (value !== lastValue.current) {
      const blocksFromHtml = editorModule.htmlToDraft(value || "<p></p>");
      const contentState = editorModule.ContentState.createFromBlockArray(
        blocksFromHtml.contentBlocks,
        blocksFromHtml.entityMap
      );
      lastValue.current = value;
      setEditorState(editorModule.EditorState.createWithContent(contentState));
    }
  }, [value, editorModule, editorState]);

  const handleChange = (nextState: EditorState) => {
    if (!editorModule) return;
    setEditorState(nextState);
    const raw = editorModule.convertToRaw(nextState.getCurrentContent());
    const html = editorModule.draftToHtml(raw);
    lastValue.current = html;
    onChange(html);
  };

  if (!editorModule || !editorState) {
    return (
      <div className="rounded-2xl border border-white/70 bg-white/80 p-4 text-sm text-[#4c5f66]">
        Loading editor...
      </div>
    );
  }

  const EditorComponent = editorModule.Editor;

  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 shadow-sm">
      <EditorComponent
        editorState={editorState}
        onEditorStateChange={handleChange}
        toolbar={toolbar}
        customStyleMap={customStyleMap}
        customStyleFn={customStyleFn}
        wrapperClassName="relative rounded-2xl"
        editorClassName="min-h-[240px] px-4 py-3 text-sm text-[#2d3b41]"
        toolbarClassName="flex flex-wrap rounded-t-2xl border-b border-white/70 bg-[#f8f1e3] px-3 py-2 text-xs font-semibold text-[#17323D]"
      />
    </div>
  );
};

export default RichTextEditor;
