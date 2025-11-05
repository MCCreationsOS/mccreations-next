import { LinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {LinkPlugin as LexicalLinkPlugin} from '@lexical/react/LexicalLinkPlugin';
import { useForm } from '@tanstack/react-form';
import { $getSelection, $isRangeSelection, BaseSelection, LexicalEditor, RangeSelection } from 'lexical';
import * as React from 'react';

import { useEffect, type JSX } from "react";
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { getSelectedNode } from './ToolBar';

const SUPPORTED_URL_PROTOCOLS = new Set([
  'http:',
  'https:',
  'mailto:',
  'sms:',
  'tel:',
]);

export function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    // eslint-disable-next-line no-script-url
    if (!SUPPORTED_URL_PROTOCOLS.has(parsedUrl.protocol)) {
      return 'about:blank';
    }
  } catch {
    return url;
  }
  return url;
}

function validateUrl(url: string): boolean {
    // TODO Fix UI for link insertion; it should never default to an invalid URL such as https://.
    // Maybe show a dialog where they user can type the URL before inserting it.
    return url === 'https://' || urlRegExp.test(url);
}
const urlRegExp = new RegExp(
/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/,
);

export default function LinkPlugin(): JSX.Element {
  return <LexicalLinkPlugin validateUrl={validateUrl} />;
}

export function InsertLinkDialog({activeEditor, setLinkEditDialogOpen}: {activeEditor: LexicalEditor, setLinkEditDialogOpen: (open: boolean) => void}) {
  const form = useForm({
    defaultValues: {
      link: ""
    },
    onSubmit: ({value}) => {
      activeEditor.dispatchCommand(
        TOGGLE_LINK_COMMAND,
        sanitizeUrl(value.link),
      );
      setLinkEditDialogOpen(false)
    }
  })

  return (
    <form onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
    }} className='flex flex-col gap-2'>
      <form.Field name="link" children={(field) => (
        <>
          <Input value={field.state.value} onBlur={field.handleBlur} onChange={(e) => {field.handleChange(e.target.value)}} placeholder="Link" />
        </>
      )}/>
      <Button type="submit"><span>Insert Link</span></Button>
    </form>
  )
}