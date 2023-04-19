import { ChannelListItem } from '@components/channels/channelListItem';
import { CreateChannelModal } from '@components/channels/createChannelModal';

import { DEFAULT_CHANNELS } from '@stores/constants';

import { useState } from 'react';

export default function ChannelList() {
  const [list] = useState(DEFAULT_CHANNELS);

  return (
    <div className="flex flex-col gap-px">
      {/*
      <Link
        href="/explore/channels"
        className="group inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-zinc-900"
      >
        <div className="inline-flex h-5 w-5 shrink items-center justify-center rounded bg-zinc-900 group-hover:bg-zinc-800">
          <Globe width={12} height={12} className="text-zinc-500" />
        </div>
        <div>
          <h5 className="text-sm font-medium text-zinc-500 group-hover:text-zinc-400">Browse channels</h5>
        </div>
      </Link>
      */}
      {list.map((item) => (
        <ChannelListItem key={item.event_id} data={item} />
      ))}
      <CreateChannelModal />
    </div>
  );
}
