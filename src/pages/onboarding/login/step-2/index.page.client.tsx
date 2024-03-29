import OnboardingLayout from '@components/layouts/onboarding';
import { RelayContext } from '@components/relaysProvider';

import { DEFAULT_AVATAR } from '@stores/constants';

import { usePageContext } from '@utils/hooks/usePageContext';
import { fetchProfileMetadata } from '@utils/hooks/useProfileMetadata';
import { shortenKey } from '@utils/shortenKey';
import { createAccount, createPleb, updateAccount } from '@utils/storage';
import { nip02ToArray } from '@utils/transform';

import { getPublicKey } from 'nostr-tools';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { navigate } from 'vite-plugin-ssr/client/router';

export function Page() {
  const pageContext = usePageContext();
  const searchParams = pageContext.urlParsed.search;

  const privkey = searchParams.privkey;
  const pubkey = useMemo(() => getPublicKey(privkey), [privkey]);

  const [pool, relays]: any = useContext(RelayContext);
  const [profile, setProfile] = useState({ metadata: null });
  const [done, setDone] = useState(false);

  const timeout = useRef(null);
  const nip02 = useRef(null);

  const createPlebs = useCallback(async (tags: string[]) => {
    for (const tag of tags) {
      fetchProfileMetadata(tag[1])
        .then((res: any) => createPleb(tag[1], res.content))
        .catch(console.error);
    }
  }, []);

  const submit = () => {
    // update account's folllows with NIP-02 tag list
    const arr = nip02ToArray(nip02.current);
    updateAccount('follows', arr, pubkey);
    // create plebs (saved nostr profile)
    createPlebs(nip02.current);
    // redirect to splashscreen
    navigate('/', { overwriteLastHistoryEntry: true });
  };

  useEffect(() => {
    const unsubscribe = pool.subscribe(
      [
        {
          kinds: [0, 3],
          authors: [pubkey],
        },
      ],
      relays,
      (event: any) => {
        switch (event.kind) {
          case 0:
            // create account
            createAccount(pubkey, privkey, event.content);
            // update state
            setProfile({
              metadata: JSON.parse(event.content),
            });
            break;
          case 3:
            nip02.current = event.tags;
            break;
          default:
            break;
        }
      },
      undefined,
      () => {
        timeout.current = setTimeout(() => setDone(true), 5000);
      },
      {
        unsubscribeOnEose: true,
        logAllEvents: false,
      }
    );

    return () => {
      unsubscribe();
      clearTimeout(timeout.current);
    };
  }, [pool, relays, pubkey, privkey]);

  return (
    <OnboardingLayout>
      <div className="grid h-full w-full grid-rows-5">
        <div className="row-span-1 flex items-center justify-center">
          <h1 className="bg-gradient-to-br from-zinc-200 to-zinc-400 bg-clip-text text-3xl font-medium text-transparent">
            Bringing back your profile...
          </h1>
        </div>
        <div className="row-span-4 flex flex-col gap-8">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-4 flex flex-col gap-2">
              <div className="w-full rounded-lg bg-zinc-900 p-4 shadow-input ring-1 ring-zinc-800">
                <div className="flex space-x-4">
                  <div className="relative h-10 w-10 rounded-full">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={profile.metadata?.picture || DEFAULT_AVATAR}
                      alt="avatar"
                    />
                  </div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{profile.metadata?.display_name || profile.metadata?.name}</p>
                      <span className="leading-tight text-zinc-500">·</span>
                      <p className="text-zinc-500">@{profile.metadata?.username || (pubkey && shortenKey(pubkey))}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 h-2 rounded bg-zinc-700"></div>
                        <div className="col-span-1 h-2 rounded bg-zinc-700"></div>
                      </div>
                      <div className="h-2 rounded bg-zinc-700"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              {done === false ? (
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <button
                  onClick={() => submit()}
                  className="inline-flex w-full transform items-center justify-center rounded-lg bg-gradient-to-r from-fuchsia-300 via-orange-100 to-amber-300 px-3.5 py-2.5 font-medium text-zinc-800 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <span className="drop-shadow-lg">Done! Go to newsfeed</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}
