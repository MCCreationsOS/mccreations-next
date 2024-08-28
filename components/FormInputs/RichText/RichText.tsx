import { $getRoot, $getSelection, $insertNodes, EditorState } from 'lexical';
import {$generateHtmlFromNodes, $generateNodesFromDOM} from '@lexical/html';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
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
import { useI18n } from '@/locales/client';

const theme = {
        code: 'editor-code',
        heading: {
          h1: 'editor-heading-h1',
          h2: 'editor-heading-h2',
          h3: 'editor-heading-h3',
          h4: 'editor-heading-h4',
          h5: 'editor-heading-h5',
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
          bold: 'editor-text-bold',
          code: 'editor-text-code',
          hashtag: 'editor-text-hashtag',
          italic: 'editor-text-italic',
          overflowed: 'editor-text-overflowed',
          strikethrough: 'editor-text-strikethrough',
          underline: 'editor-text-underline',
          underlineStrikethrough: 'editor-text-underlineStrikethrough',
        },
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
    console.error(error);
}

/**
 * Load preset HTML into the editor
 * @param html The HTML string to load 
 * @returns 
 */
function LoadHTMLPlugin({ html }: { html: string }): JSX.Element {
    const [editor] = useLexicalComposerContext();
    editor.update(() => {
      if(!editor.isEditable() && html.length > 0) {
        try {
          const parser = new DOMParser();
          const dom = parser.parseFromString(DOMPurify.sanitize(html), "text/html");
        
          const nodes = $generateNodesFromDOM(editor, dom);
        
          $getRoot().clear();
          $getRoot().select();
        
          $insertNodes(nodes);
        } catch(e) {
          console.error(e);
        }
      }
    });
    return <></>;
}

/**
 * Export the HTML from the editor
 * @param setHTML A function used to pass the HTML out of the editor
 * @returns 
 */
function ExportHTMLPlugin({ setHTML }: { setHTML: (html: string) => void }): JSX.Element {
    const [editor] = useLexicalComposerContext();
    editor.registerUpdateListener(({editorState}) => {
      
        editorState.read(() => {
          try {
            let html = $generateHtmlFromNodes(editor, null);
            setHTML(html);
          } catch(e) {
            console.error(e);
          }
        });
      });
    return <></>;
}

/**
 * The RichText component is a rich text editor that uses Lexical
 * @param sendOnChange The function to call when the text in the editor changes
 * @param initialValue The initial value of the editor
 * @returns 
 */
export default function RichText({ sendOnChange, initialValue }: { sendOnChange: (state: string) => void, initialValue?: string }) {

    const initialConfig = {
        namespace: 'MyEditor',
        theme,
        onError,
        nodes: [AutoLinkNode, LinkNode, ListItemNode, ListNode, ImageNode],
        editable: true
    };
    const t = useI18n();

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className='editor-container'>
                <ToolbarPlugin />
                <div className='editor-inner'>
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="editor-input" />}
                        placeholder={<div className="editor-placeholder">{t('form.rich_text.placeholder')}</div>}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                </div>
            </div>
            <HistoryPlugin />
            <LexicalAutoLinkPlugin />
            <LinkPlugin />
            {/* <OnChangePlugin onChange={onChange} /> */}
            <LoadHTMLPlugin html={initialValue || ""} />
            <ExportHTMLPlugin setHTML={sendOnChange} />
            <ImagesPlugin />
            <ListPlugin />
        </LexicalComposer>
    );
}