import { $createParagraphNode, $createTextNode, $getRoot, COMMAND_PRIORITY_EDITOR, EditorState, ElementNode, INSERT_TAB_COMMAND, KEY_TAB_COMMAND, LexicalEditor } from 'lexical';
import { $createCodeNode } from '@lexical/code';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {useTranslations} from 'next-intl';
import { useEffect } from 'react';
import { $generateNodesFromDOM } from '@lexical/html';

const theme = {
        paragraph: 'font-mono text-sm',
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

function TabPlugin() {
    const [editor] = useLexicalComposerContext();
    
    useEffect(() => {
        editor.registerCommand<KeyboardEvent>(KEY_TAB_COMMAND, (event => {
            event.preventDefault();
            return editor.dispatchCommand(INSERT_TAB_COMMAND, undefined);
        }), COMMAND_PRIORITY_EDITOR)
    }, [editor])

    return null
}

function DiffHighlightPlugin({diff}: {diff: string}) {
    const [editor] = useLexicalComposerContext();

    function getAllParagraphNodes(node: ElementNode) {
        let nodes: ElementNode[] = [];
        if(node.getType() === "paragraph") {
            nodes.push(node)
        }
        node.getChildren().forEach(node => {
            if(node instanceof ElementNode) {
                nodes.push(...getAllParagraphNodes(node))
            }
        })
        return nodes
    }

    function isCodeBlock(line: string) {
        line = line.trim();
        return line.startsWith("{") || line.startsWith("}") || line.endsWith("}") || line.endsWith("{") || line.endsWith("},")
    }

    useEffect(() => {
        editor.registerTextContentListener((text) => {
            editor.update(() => {
                const diffLines = diff.split("\n").sort((a, b) => a.localeCompare(b));
                const nodes = getAllParagraphNodes($getRoot());
                nodes.sort((a, b) => a.getTextContent().localeCompare(b.getTextContent())).forEach((node, index) => {
                    const line = node.getTextContent();
                    if(index < diffLines.length) {
                        const diffLine = diffLines[index];
                        if(diffLine !== line) {
                            node.getAllTextNodes().forEach(node => {
                                node.setStyle("");
                            })
                        } else if(!isCodeBlock(line)) {
                            node.getAllTextNodes().forEach(node => {
                                node.setStyle("background-color: #ffee0033;");
                            })
                        }
                    }
                })
            })
        })
        editor.update(() => {
            const diffLines = diff.split("\n").sort((a, b) => a.localeCompare(b));
            const nodes = getAllParagraphNodes($getRoot());
            nodes.sort((a, b) => a.getTextContent().localeCompare(b.getTextContent())).forEach((node, index) => {
                const line = node.getTextContent();
                if(index < diffLines.length) {
                    const diffLine = diffLines[index];
                    if(diffLine !== line) {
                        node.getAllTextNodes().forEach(node => {
                            node.setStyle("");
                        })
                    } else if(!isCodeBlock(line)) {
                        node.getAllTextNodes().forEach(node => {
                            node.setStyle("background-color: #ffee0033;");
                        })
                    }
                }
            })
        })
    }, [editor])

    return null
}


/**
 * The RichText component is a rich text editor that uses Lexical
 * @param sendOnChange The function to call when the text in the editor changes
 * @param initialValue The initial value of the editor
 * @returns 
*/
export default function CodeEditor({ sendOnChange, initialValue, editable = true, className, diff }: { sendOnChange: (state: string) => void, initialValue?: string, editable?: boolean, className?: string, diff?: string }) {
    
    function $defaultValue() {
        const root = $getRoot();
        if(root.getFirstChild() === null) {
            initialValue?.split('\n').forEach(line => {
                root.append($createParagraphNode().append($createTextNode(line)));
            })
        }
    }

    const initialConfig = {
        namespace: 'CodeEditor',
        editorState: $defaultValue,
        theme,
        onError,
        nodes: [],
        editable
    };
    const t = useTranslations()


    const onChange = (editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => {
        editorState.read(() => {
            let text = $getRoot().getAllTextNodes().map(node => node.getTextContent().trim()).join("");
            sendOnChange(text);
        })
    }

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className={`border-1 border-white/15 ${className}`}>
                <RichTextPlugin
                    contentEditable={<ContentEditable className={`min-h-[200px] px-3 py-1 w-content`} defaultValue={initialValue} spellCheck={false} wrap='off'/>}
                    placeholder={<div className="editor-placeholder">{t('Components.RichText.placeholder')}</div>}
                    ErrorBoundary={ErrorBoundary}
                />
            </div>
            <TabPlugin />
            <HistoryPlugin />
            <OnChangePlugin onChange={onChange} ignoreSelectionChange={true}/>
            {diff && <DiffHighlightPlugin diff={diff} />}
        </LexicalComposer>
    );
}