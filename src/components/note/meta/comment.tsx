import { RelayContext } from '@components/relaysProvider';
import { UserExtend } from '@components/user/extend';

import { dateToUnix } from '@utils/getDate';

import * as Dialog from '@radix-ui/react-dialog';
import useLocalStorage from '@rehooks/local-storage';
import { ChatLines, OpenNewWindow } from 'iconoir-react';
import { getEventHash, signEvent } from 'nostr-tools';
import { useContext, useState } from 'react';
import { navigate } from 'vite-plugin-ssr/client/router';

export const NoteComment = ({
  count,
  eventID,
  eventPubkey,
  eventContent,
  eventTime,
}: {
  count: number;
  eventID: string;
  eventPubkey: string;
  eventTime: number;
  eventContent: any;
}) => {
  const [pool, relays]: any = useContext(RelayContext);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const [activeAccount]: any = useLocalStorage('account', {});
  const profile = activeAccount.metadata ? JSON.parse(activeAccount.metadata) : null;

  const openThread = () => {
    navigate(`/newsfeed/note?id=${eventID}`);
  };

  const submitEvent = () => {
    const event: any = {
      content: value,
      created_at: dateToUnix(),
      kind: 1,
      pubkey: activeAccount.pubkey,
      tags: [['e', eventID]],
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, activeAccount.privkey);

    pool.publish(event, relays);
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="group flex w-16 items-center gap-1 text-sm text-zinc-500">
          <div className="rounded-md p-1 group-hover:bg-zinc-800">
            <ChatLines width={20} height={20} className="text-zinc-500" />
          </div>
          <span>{count}</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center">
            <div className="relative w-full max-w-2xl rounded-lg bg-zinc-900 p-4 text-zinc-100 ring-1 ring-zinc-800">
              {/* root note */}
              <div className="relative z-10 flex flex-col pb-6">
                <div className="relative z-10">
                  <UserExtend pubkey={eventPubkey} time={eventTime} />
                </div>
                <div className="-mt-5 pl-[52px]">
                  <div className="prose prose-zinc max-w-none break-words leading-tight dark:prose-invert prose-headings:mb-2 prose-headings:mt-3 prose-p:m-0 prose-p:leading-tight prose-a:font-normal prose-a:text-fuchsia-500 prose-a:no-underline prose-ul:mt-2 prose-li:my-1">
                    {eventContent}
                  </div>
                </div>
                {/* divider */}
                <div className="absolute left-[21px] top-0 h-full w-0.5 bg-gradient-to-t from-zinc-800 to-zinc-600"></div>
              </div>
              {/* comment form */}
              <div className="flex gap-2">
                <div>
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border border-white/10">
                    <img src={profile?.picture} alt="user's avatar" className="h-11 w-11 rounded-md object-cover" />
                  </div>
                </div>
                <div className="relative h-36 w-full flex-1 overflow-hidden before:pointer-events-none before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:opacity-0 before:ring-2 before:ring-blue-500/20 before:transition after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 after:transition focus-within:before:opacity-100 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20">
                  <div>
                    <textarea
                      name="content"
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Send your comment"
                      className="relative h-36 w-full resize-none rounded-md border border-black/5 px-3.5 py-3 text-sm shadow-input shadow-black/5 !outline-none placeholder:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-black/10 dark:placeholder:text-zinc-500"
                      spellCheck={false}
                    />
                  </div>
                  <div className="absolute bottom-2 w-full px-2">
                    <div className="flex w-full items-center justify-between bg-zinc-800">
                      <div className="flex items-center gap-2 divide-x divide-zinc-700">
                        <button
                          onClick={() => openThread()}
                          className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-zinc-700"
                        >
                          <OpenNewWindow width={16} height={16} className="text-zinc-400" />
                        </button>
                        <div className="flex items-center gap-2 pl-2"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => submitEvent()}
                          disabled={value.length === 0 ? true : false}
                          className="inline-flex h-8 w-16 items-center justify-center rounded-md bg-fuchsia-500 px-4 text-sm font-medium shadow-md shadow-fuchsia-900/50 hover:bg-fuchsia-600"
                        >
                          <span className="text-white drop-shadow">Send</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
