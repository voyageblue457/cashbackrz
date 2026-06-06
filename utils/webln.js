import { NostrWebLNProvider } from '@getalby/sdk/webln';
import Info from '../models/Info.js';

let nwc = null;

export const initNwc = async () => {
  const nwcUrl =
    'nostr+walletconnect://3a6f486c4e03aee41330ea1f6826943d8e350630439d5cc6ff84447210620f6b?relay=wss://relay.getalby.com&relay=wss://relay2.getalby.com&secret=633a24fb39839734b9d377fdadb5aea1dcae121c1c62e35744474c2fab2ed860&lud16=goldenacai479786@getalby.com';
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
