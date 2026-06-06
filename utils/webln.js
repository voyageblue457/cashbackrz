import { NostrWebLNProvider } from '@getalby/sdk/webln';
import Info from '../models/Info.js';

let nwc = null;

export const initNwc = async () => {
  const nwcUrl =
    'nostr+walletconnect://741a6899cabc547cc5712f675d35d6864da4580aa82808866f38e50813af8eaa?relay=wss://relay.getalby.com&relay=wss://relay2.getalby.com&secret=7e92a79f911e7ad61632dfb79c8ac89d967332976e9b34049d82aae1fbf6cee1&lud16=relishambitious358013@getalby.com';
  if (!nwcUrl) {
    console.warn(
      'ALBY_NWC_URL is not set in environment variables. WebLN/NWC provider will not be active.'
    );
    return null;
  }

  try {
    nwc = new NostrWebLNProvider({
      nostrWalletConnectUrl: nwcUrl,
    });

    await nwc.enable();
    console.log('Alby NostrWebLNProvider enabled successfully.');
    // Subscribe to payment notifications
    try {
      if (
        nwc.client &&
        typeof nwc.client.subscribeNotifications === 'function'
      ) {
        await nwc.client.subscribeNotifications(async (notificationEvent) => {
          if (notificationEvent.notification_type === 'payment_received') {
            const event = notificationEvent.notification;
            console.log('Invoice paid!');
            console.log(event);
            try {
              const paymentHash = event.payment_hash;
              if (paymentHash) {
                const info = await Info.findOne({ rHash: paymentHash });
                if (info) {
                  info.status = true;
                  await info.save();
                  console.log(
                    `[Alby NWC] Database updated: payment marked as status = true for hash ${paymentHash}`
                  );
                } else {
                  console.log(
                    `[Alby NWC] Paid invoice received but no matching Info record found for hash ${paymentHash}`
                  );
                }
              }
            } catch (dbErr) {
              console.error(
                '[Alby NWC] Error updating database on invoice paid event:',
                dbErr.message
              );
            }
          }
        });
        console.log('[Alby NWC] Subscribed to notifications successfully.');
      } else {
        console.warn(
          '[Alby NWC] subscribeNotifications is not supported on this client.'
        );
      }
    } catch (subErr) {
      console.warn(
        '[Alby NWC] Failed to subscribe to notifications:',
        subErr.message
      );
    }

    return nwc;
  } catch (error) {
    console.error('Failed to initialize Alby NWC:', error.message);
    return null;
  }
};

export const getNwc = () => {
  return nwc;
};
