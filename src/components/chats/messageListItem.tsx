import { MessageUser } from '@components/chats/messageUser';

import { useDecryptMessage } from '@utils/hooks/useDecryptMessage';

import { memo } from 'react';

const MessageListItem = ({ data, userPubkey, userPrivkey }: { data: any; userPubkey: string; userPrivkey: string }) => {
  const content = useDecryptMessage(userPubkey, userPrivkey, data.pubkey, data.tags, data.content);

  return (
    <div className="flex h-min min-h-min w-full select-text flex-col px-5 py-2 hover:bg-black/20">
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
    </div>
  );
};

export default memo(MessageListItem);
