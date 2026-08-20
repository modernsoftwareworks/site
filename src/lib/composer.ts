import type { Messages } from '../i18n/schema';
import { mailHref } from '../i18n/schema';

export const MESSAGE_MAX = 1000;

const BLANK = '…';
const SIGNOFF = '— modernsoftware.works';

export type ComposerCopy = Pick<
  Messages,
  'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'helpLabel' | 'sendDone' | 'sendAny' | 'inquirySubject'
>;

export type ComposerState = {
  name: string;
  org: string;
  need: string;
  email: string;
  message: string;
};

export type ComposedInquiry = {
  sentence: string;
  subject: string;
  body: string;
  mailto: string;
  sendLabel: string;
  complete: boolean;
};

export const emptyState: ComposerState = {
  name: '',
  org: '',
  need: '',
  email: '',
  message: '',
};

export function composeInquiry(copy: ComposerCopy, state: ComposerState): ComposedInquiry {
  const fill = (value: string) => (value.trim() ? value.trim() : BLANK);

  const sentence =
    copy.c1 +
    fill(state.name) +
    copy.c2 +
    fill(state.org) +
    copy.c3 +
    fill(state.need) +
    copy.c4 +
    fill(state.email) +
    copy.c5;

  const message = state.message.trim();
  const body = `${sentence}${message ? `\n\n${copy.helpLabel}\n${message}` : ''}\n\n${SIGNOFF}`;

  const subject = [copy.inquirySubject, state.name.trim(), state.need.trim()]
    .filter(Boolean)
    .join(' · ');

  const complete = Boolean(state.name.trim() && state.org.trim() && state.need.trim());

  return {
    sentence,
    subject,
    body,
    mailto: mailHref(subject, body),
    sendLabel: complete ? copy.sendDone : copy.sendAny,
    complete,
  };
}
