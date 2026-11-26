export async function detachPush(unsubscribe: (endpoint: string) => Promise<unknown>) {
  if (!__PWA_ENABLED__ || !('serviceWorker' in navigator) || !navigator.serviceWorker.controller)
    return;
  const reg = await navigator.serviceWorker.getRegistration(),
    subscription = await reg?.pushManager?.getSubscription();
  if (subscription)
    try {
      await unsubscribe(subscription.endpoint);
    } finally {
      await subscription.unsubscribe();
    }
}
