import { HideMessageButton } from '@components/channels/messages/hideMessageButton';
import { MuteButton } from '@components/channels/messages/muteButton';
import { ReplyButton } from '@components/channels/messages/replyButton';
import { MessageUser } from '@components/chats/messageUser';

import { messageParser } from '@utils/parser';

import { memo } from 'react';

const ChannelMessageItem = ({ data }: { data: any }) => {
  const content = messageParser(data.content);

  return (
    <div className="group relative flex h-min min-h-min w-full select-text flex-col px-5 py-2 hover:bg-black/20">
      <div className="flex flex-col">
        <MessageUser pubkey={data.pubkey} time={data.created_at} />
        <div className="-mt-[17px] pl-[48px]">
          <div className="flex flex-col gap-2">
            <div className="prose prose-zinc max-w-none break-words text-sm leading-tight dark:prose-invert prose-p:m-0 prose-p:text-sm prose-p:leading-tight prose-a:font-normal prose-a:text-fuchsia-500 prose-a:no-underline prose-img:m-0 prose-video:m-0">
              {content}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -top-4 right-4 z-10 hidden group-hover:inline-flex">
        <div className="inline-flex h-7 items-center justify-center gap-1 rounded bg-zinc-900 px-0.5 shadow-md shadow-black/20 ring-1 ring-zinc-800">
          <ReplyButton id={data.id} pubkey={data.pubkey} content={data.content} />
          <HideMessageButton id={data.id} />
          <MuteButton pubkey={data.pubkey} />
        </div>
      </div>
    </div>
  );
};

export default memo(ChannelMessageItem);
