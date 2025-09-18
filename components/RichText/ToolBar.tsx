import { INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isEditorIsNestedEditor, mergeRegister } from "@lexical/utils";
import {
    $getSelectionStyleValueForProperty,
    $patchStyleText,
    $setBlocksType,
} from "@lexical/selection";
import {
  $createParagraphNode,
    $getSelection,
    $isNodeSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    LexicalEditor,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
} from "lexical";
import { $createHeadingNode, HeadingTagType } from "@lexical/rich-text";
import { useCallback, useEffect, useRef, useState } from "react";
import * as React from "react";
import { InsertImageDialog } from "./ImagePlugin";
// import { Popup } from '@/components/Popup/Popup';
import { useTranslations } from "next-intl";
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Baseline,
    Bold,
    FoldVertical,
    Image,
    Italic,
    List,
    PaintBucket,
    Pilcrow,
    Redo,
    Strikethrough,
    Underline,
    Undo,
} from "lucide-react";
import { INSERT_COLLAPSIBLE_COMMAND } from "./SpoilerPlugin";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import ColorPicker from "./ColorPicker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const LowPriority = 1;

function Divider() {
    return <div className="divider" />;
}

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const [activeEditor, setActiveEditor] = useState(editor);
    const toolbarRef = useRef(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [isImageCaption, setIsImageCaption] = useState(false);
    const [fontSize, setFontSize] = useState(16);
    const [fontColor, setFontColor] = useState("#ffffff");
    const [bgColor, setBgColor] = useState("#ffffffff");
    const t = useTranslations();

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if (selection && $isRangeSelection(selection)) {
            setFontColor(
                $getSelectionStyleValueForProperty(
                    selection,
                    "color",
                    "#000000"
                )
            );
            setBgColor(
                $getSelectionStyleValueForProperty(
                    selection,
                    "background-color",
                    "#ffffff"
                )
            );
            if ($isRangeSelection(selection)) {
                // Update text format
                setIsBold(selection.hasFormat("bold"));
                setIsItalic(selection.hasFormat("italic"));
                setIsUnderline(selection.hasFormat("underline"));
                setIsStrikethrough(selection.hasFormat("strikethrough"));
                setFontSize(
                    parseInt(
                        $getSelectionStyleValueForProperty(
                            selection,
                            "font-size",
                            "16px"
                        )
                    )
                );
                if (
                    activeEditor !== editor &&
                    $isEditorIsNestedEditor(activeEditor)
                ) {
                    const rootElement = activeEditor.getRootElement();
                    setIsImageCaption(
                        !!rootElement?.parentElement?.classList.contains(
                            "image-caption-container"
                        )
                    );
                } else {
                    setIsImageCaption(false);
                }
            }
        }
    }, [activeEditor, editor]);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, newEditor) => {
                    setActiveEditor(newEditor);
                    updateToolbar();
                    return false;
                },
                LowPriority
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                LowPriority
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                LowPriority
            )
        );
    }, [editor, updateToolbar]);

    const applyStyleText = useCallback(
        (style: Record<string, string>) => {
            activeEditor.update(() => {
                const selection = $getSelection();
                if (selection) {
                    $patchStyleText(selection, style);
                }
            });
        },
        [activeEditor]
    );

    const onFontColorSelect = useCallback(
        (color: string) => {
            applyStyleText({ color: color });
        },
        [applyStyleText]
    );

    const onBgColorSelect = useCallback(
        (color: string) => {
            applyStyleText({ "background-color": color });
        },
        [applyStyleText]
    );

    const formatParagraph = (editor: LexicalEditor) => {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createParagraphNode());
      });
    }
    
    const formatHeading = (
      editor: LexicalEditor,
      blockType: string,
      headingSize: HeadingTagType,
    ) => {
      if (blockType !== headingSize) {
        editor.update(() => {
          const selection = $getSelection();
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        });
      }
    };

    return (
        <div className="flex flex-row gap-2 overflow-x-auto" ref={toolbarRef}>
            <button
                disabled={!canUndo}
                onClick={() => {
                    editor.dispatchCommand(UNDO_COMMAND, undefined);
                }}
                className="p-2 m-0 hover:bg-white/10"
                aria-label={t("Components.RichText.Toolbar.undo")}
                type="button"
            >
                <Undo className="w-4 h-4" />
            </button>
            <button
                disabled={!canRedo}
                onClick={() => {
                    editor.dispatchCommand(REDO_COMMAND, undefined);
                }}
                className="p-2 m-0 hover:bg-white/10"
                aria-label={t("Components.RichText.Toolbar.redo")}
                type="button"
            >
                <Redo className="w-4 h-4" />
            </button>
            <Divider />
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                }}
                className={
                    "p-2 m-0 hover:bg-white/10" + (isBold ? "bg-white/10" : "")
                }
                aria-label={t("Components.RichText.Toolbar.bold")}
                type="button"
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
                }}
                className={
                    "p-2 m-0 hover:bg-white/10" +
                    (isItalic ? "bg-white/10" : "")
                }
                aria-label={t("Components.RichText.Toolbar.italic")}
                type="button"
            >
                <Italic className="w-4 h-4" />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
                }}
                className={
                    "p-2 m-0 hover:bg-white/10" +
                    (isUnderline ? "bg-white/10" : "")
                }
                aria-label={t("Components.RichText.Toolbar.underline")}
                type="button"
            >
                <Underline className="w-4 h-4" />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(
                        FORMAT_TEXT_COMMAND,
                        "strikethrough"
                    );
                }}
                className={
                    "p-2 m-0 hover:bg-white/10" +
                    (isStrikethrough ? "bg-white/10" : "")
                }
                aria-label={t("Components.RichText.Toolbar.strikethrough")}
                type="button"
            >
                <Strikethrough className="w-4 h-4" />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(
                        INSERT_UNORDERED_LIST_COMMAND,
                        undefined
                    );
                }}
                className={"p-2 m-0 hover:bg-white/10"}
                aria-label={t("Components.RichText.Toolbar.bullet_list")}
                type="button"
            >
                <List className="w-4 h-4" />
            </button>
            <Divider />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={"p-2 m-0 hover:bg-white/10"} type="button">
                  <Pilcrow className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="border-2 border-white/15 p-1">
                  <DropdownMenuItem className="p-0">
                    <Button variant="dropdown" onClick={() => {formatParagraph(editor)}}>Paragraph</Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-0">
                    <Button variant="dropdown" onClick={() => {formatHeading(editor, "", "h1")}}>Heading 1</Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-0">
                    <Button variant="dropdown" onClick={() => {formatHeading(editor, "", "h2")}}>Heading 2</Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-0">
                    <Button variant="dropdown" onClick={() => {formatHeading(editor, "", "h3")}}>Heading 3</Button>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={"p-2 m-0 hover:bg-white/10"} type="button">
                  <Baseline className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="border-2 border-white/15 p-1">
                  <ColorPicker
                    color={fontColor}
                    onChange={onFontColorSelect}
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={"p-2 m-0 hover:bg-white/10"} type="button">
                  <PaintBucket className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="border-2 border-white/15 p-1">
                  <ColorPicker
                    color={bgColor}
                    onChange={onBgColorSelect}
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Divider />
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
                }}
                className="p-2 m-0 hover:bg-white/10"
                aria-label={t("Components.RichText.Toolbar.left_align")}
                type="button"
                >
                <AlignLeft className="w-4 h-4" />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
                }}
                className="p-2 m-0 hover:bg-white/10"
                aria-label={t("Components.RichText.Toolbar.center_align")}
                type="button"
                >
                <AlignCenter className="w-4 h-4" />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
                }}
                className="p-2 m-0 hover:bg-white/10"
                aria-label={t("Components.RichText.Toolbar.right_align")}
                type="button"
                >
                <AlignRight className="w-4 h-4" />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
                }}
                className="p-2 m-0 hover:bg-white/10"
                aria-label={t("Components.RichText.Toolbar.justify_align")}
                type="button"
                >
                <AlignJustify className="w-4 h-4" />
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button className="p-2 m-0 hover:bg-white/10" type="button">
                  <Image className="w-4 h-4" />
                </button>
              </DialogTrigger>
              <DialogContent className="py-4">
                <DialogHeader>
                  <DialogTitle>Insert Image</DialogTitle>
                </DialogHeader>
                <InsertImageDialog activeEditor={editor} />
              </DialogContent>
            </Dialog>
            <button
                onClick={() => {
                    editor.dispatchCommand(
                        INSERT_COLLAPSIBLE_COMMAND,
                        undefined
                    );
                }}
                aria-label={t("Components.RichText.Toolbar.spoiler")}
                className="p-2 m-0 hover:bg-white/10"
                type="button"
            >
                <FoldVertical className="w-4 h-4" />
            </button>{" "}
        </div>
    );
}
