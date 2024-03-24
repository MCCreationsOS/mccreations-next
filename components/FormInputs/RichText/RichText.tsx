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

function LoadHTMLPlugin({ html }: { html: string }): JSX.Element {
    const [editor] = useLexicalComposerContext();
    editor.update(() => {
        // In the browser you can use the native DOMParser API to parse the HTML string.
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, "text/html");
      
        // Once you have the DOM instance it's easy to generate LexicalNodes.
        const nodes = $generateNodesFromDOM(editor, dom);
      
        // Select the root
        $getRoot().clear();
        $getRoot().select();
      
        // Insert them at a selection.
        $insertNodes(nodes);
      });
    return <></>;
}

function ExportHTMLPlugin({ setHTML }: { setHTML: (html: string) => void }): JSX.Element {
    const [editor] = useLexicalComposerContext();
    editor.registerUpdateListener(({editorState}) => {
        // The latest EditorState can be found as `editorState`.
        // To read the contents of the EditorState, use the following API:
      
        editorState.read(() => {
            let html = $generateHtmlFromNodes(editor, null);
            setHTML(html);
        });
      });
    return <></>;
}

export default function RichText({ sendOnChange, initialValue }: { sendOnChange: (state: string) => void, initialValue?: string }) {

    const initialConfig = {
        namespace: 'MyEditor',
        theme,
        onError,
        nodes: [AutoLinkNode, LinkNode, ListItemNode, ListNode]
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className='editor-container'>
                <ToolbarPlugin />
                <div className='editor-inner'>
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="editor-input" />}
                        placeholder={<div className="editor-placeholder">Enter some text...</div>}
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
            <ListPlugin />
        </LexicalComposer>
    );
}