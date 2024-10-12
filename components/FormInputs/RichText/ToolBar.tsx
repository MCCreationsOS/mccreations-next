import { INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$isEditorIsNestedEditor, mergeRegister} from '@lexical/utils';
import {$getSelectionStyleValueForProperty, $patchStyleText} from '@lexical/selection';
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import {useCallback, useEffect, useRef, useState} from 'react';
import * as React from 'react';
import { InsertImageDialog } from './ImagePlugin';
import { Popup } from '@/components/Popup/Popup';
import {useTranslations} from 'next-intl';
import { Minus, Plus } from 'react-feather';
import { INSERT_COLLAPSIBLE_COMMAND } from './SpoilerPlugin';
import DropdownColorPicker from './DropdownColorPicker';

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
  const [fontSize, setFontSize] = useState(16)
  const [fontColor, setFontColor] = useState("#ffffff")
  const [bgColor, setBgColor] = useState("#ffffffff")
  const t = useTranslations()

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    setFontColor($getSelectionStyleValueForProperty(selection, 'color', '#000000'))
    setBgColor($getSelectionStyleValueForProperty(selection, 'background-color', '#ffffff'))
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setFontSize(parseInt($getSelectionStyleValueForProperty(selection, 'font-size', '16px')))
      if (activeEditor !== editor && $isEditorIsNestedEditor(activeEditor)) {
        const rootElement = activeEditor.getRootElement();
        setIsImageCaption(
          !!rootElement?.parentElement?.classList.contains(
            'image-caption-container',
          ),
        );
      } else {
        setIsImageCaption(false);
      }
    }
  }, [activeEditor, editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
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
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, updateToolbar]);

  const applyStyleText = useCallback((style: Record<string, string>) => {
    activeEditor.update(() => {
      const selection = $getSelection()
      if(selection) {
        $patchStyleText(selection, style)
      }
    })
  }, [activeEditor])

  const onFontColorSelect = useCallback((color: string) => {
    applyStyleText({color: color})
  }, [applyStyleText])

  const onBgColorSelect = useCallback((color: string) => {
    applyStyleText({'background-color': color})
  }, [applyStyleText])

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label={t('Form.RichText.undo')}>
        <i className="format undo" />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label={t('Form.RichText.redo')}>
        <i className="format redo" />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
        aria-label={t('Form.RichText.bold')}>
        <i className="format bold" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
        aria-label={t('Form.RichText.italic')}>
        <i className="format italic" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
        aria-label={t('Form.RichText.underline')}>
        <i className="format underline" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')}
        aria-label={t('Form.RichText.strikethrough')}>
        <i className="format strikethrough" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }}
        className={'toolbar-item spaced'}
        aria-label={t('Form.RichText.bullet_list')}>
        <i className="format bullet-list" />
      </button>
      <Divider />
      <button onClick={() => {
        editor.update(() => {
          const selection = $getSelection()
          if(selection) {
            $patchStyleText(selection, {
              'font-size': `${fontSize + 2}px`
            })
          }
        })
        setFontSize(fontSize + 2)
      }}
      className="toolbar-item spaced"
      aria-label={t('Form.RichText.font_size')}>
        <i className="format plus"></i>
      </button>
      <button className="toolbar-item spaced"><i className="format">{fontSize}</i></button>
      <button onClick={() => {
        editor.update(() => {
          const selection = $getSelection()
          if(selection) {
            $patchStyleText(selection, {
              'font-size': `${fontSize - 2}px`
            })
          }
        })
        setFontSize(fontSize - 2)
      }}
      className="toolbar-item spaced"
      aria-label={t('Form.RichText.font_size')}>
        <i className="format minus"></i>
      </button>
      <DropdownColorPicker
            buttonClassName="toolbar-item color-picker"
            buttonAriaLabel="Formatting text color"
            buttonIconClassName="icon font-color"
            color={fontColor}
            onChange={onFontColorSelect}
            title="text color"
          />
          <DropdownColorPicker
            buttonClassName="toolbar-item color-picker"
            buttonAriaLabel="Formatting background color"
            buttonIconClassName="icon bg-color"
            color={bgColor}
            onChange={onBgColorSelect}
            title="bg color"
          />
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className="toolbar-item spaced"
        aria-label={t('Form.RichText.left_align')}>
        <i className="format left-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className="toolbar-item spaced"
        aria-label={t('Form.RichText.center_align')}>
        <i className="format center-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className="toolbar-item spaced"
        aria-label={t('Form.RichText.left_align')}>
        <i className="format right-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        className="toolbar-item"
        aria-label={t('Form.RichText.justify_align')}>
        <i className="format justify-align" />
      </button>
      <button
          onClick={() => {
            Popup.createPopup({content: <InsertImageDialog
              activeEditor={editor}
            />, title: t('Form.RichText.image')});
          }}
          aria-label={t('Form.RichText.image')}
          className="toolbar-item spaced">
          <i className="format image" />
        </button>
        <button 
          onClick={() => {
            editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined);
          }}
          aria-label={t('Form.RichText.spoiler')}
          className="toolbar-item spaced">
          <i className="format spoiler" />
        </button>
      {' '}
    </div>
  );
}
