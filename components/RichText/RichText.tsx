import { $getRoot, $getSelection, $insertNodes, EditorState, LexicalEditor } from 'lexical';
import {$generateHtmlFromNodes, $generateNodesFromDOM} from '@lexical/html';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import {ListItemNode, ListNode} from '@lexical/list';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import ToolbarPlugin from './ToolBar';
import LexicalAutoLinkPlugin from './AutoLinkPlugin';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import LinkPlugin from './LinkPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import DOMPurify from 'isomorphic-dompurify';
import { ImageNode } from './nodes/ImageNode';
import ImagesPlugin from './ImagePlugin';
import {useTranslations} from 'next-intl';
import SpoilerPlugin from './SpoilerPlugin';
import { CollapsibleContainerNode } from './SpoilerPlugin/SpoilerContainerNode';
import { CollapsibleContentNode } from './SpoilerPlugin/SpoilerContentNode';
import { CollapsibleTitleNode } from './SpoilerPlugin/SpoilerTitleNode';
import { useEffect } from 'react';
import {HeadingNode} from '@lexical/rich-text'

const theme = {
        code: 'font-mono',
        heading: {
          h1: 'text-2xl font-bold',
          h2: 'text-xl font-bold',
          h3: 'text-lg font-bold',
          h4: 'text-base font-bold',
          h5: 'text-sm font-bold',
        },
        image: 'editor-image',
        link: 'editor-link',
        list: {
          listitem: 'editor-listitem',
          nested: {
            listitem: 'editor-nested-listitem',
          },
          ol: 'editor-list-ol',
          ul: 'editor-list-ul',
        },
        ltr: 'ltr',
        paragraph: 'editor-paragraph',
        placeholder: 'editor-placeholder',
        quote: 'editor-quote',
        rtl: 'rtl',
        text: {
          bold: 'font-bold',
          code: 'font-mono',
          hashtag: 'editor-text-hashtag',
          italic: 'italic',
          overflowed: 'editor-text-overflowed',
          strikethrough: 'line-through',
          underline: 'underline',
          underlineStrikethrough: 'editor-text-underlineStrikethrough',
        },
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
    console.error(error);
}

function ErrorBoundary({children, onError}: {children: React.ReactNode, onError: (error: Error) => void}) {
  return null
}

/**
 * Load preset HTML into the editor
 * @param html The HTML string to load 
 * @returns 
 */
function LoadHTMLPlugin({ html }: { html: string }): JSX.Element {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {   
      editor.update(() => {
        try {
          if(html.length === 0) return;
          console.log(html)
          const parser = new DOMParser();
          const dom = parser.parseFromString(DOMPurify.sanitize(html), "text/html");
          
          const nodes = $generateNodesFromDOM(editor, dom);
          
          $getRoot().clear();
          
          $insertNodes(nodes);
        } catch(e) {
          console.error(e);
        }
      });
    }, [html])
    return <></>;
}

/**
 * The RichText component is a rich text editor that uses Lexical
 * @param sendOnChange The function to call when the text in the editor changes
 * @param initialValue The initial value of the editor
 * @returns 
 */
export default function RichText({ sendOnChange, initialValue, className }: { sendOnChange: (state: string) => void, initialValue?: string, className?: string }) {

    const initialConfig = {
        namespace: 'MyEditor',
        theme,
        onError,
        nodes: [AutoLinkNode, LinkNode, ListItemNode, ListNode, ImageNode, CollapsibleContainerNode, CollapsibleTitleNode, CollapsibleContentNode, HeadingNode],
        editable: true
    };
    const t = useTranslations()


    const onChange = (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => {
        editorState.read(() => {
            let html = $generateHtmlFromNodes(editor, null);
            sendOnChange(html);
        })
        console.log(editorState)
    }

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className={`border-1 border-white/15 ${className}`}>
                <ToolbarPlugin />
                <div className={`border-t-1 border-white/15 relative ${className}`}>
                    <RichTextPlugin
                        contentEditable={<ContentEditable className={`min-h-[200px] px-3 py-1 ${className}`} />}
                        placeholder={<div className="editor-placeholder">{t('Components.RichText.placeholder')}</div>}
                        ErrorBoundary={ErrorBoundary}
                    />
                </div>
            </div>
            <HistoryPlugin />
            <LexicalAutoLinkPlugin />
            <LinkPlugin />
            <LoadHTMLPlugin html={initialValue || ""} />
            <OnChangePlugin onChange={onChange} ignoreSelectionChange={true}/>
            <ImagesPlugin />  
            <ListPlugin />
            <SpoilerPlugin />
        </LexicalComposer>
    );
}