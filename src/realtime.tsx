import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { authEvents, getAccessToken, useAuth } from './api';
export const notificationEvents = new EventTarget();
export function NotificationBridge({
  enabled,
  onMessage,
}: {
  enabled: boolean;
  onMessage: (message: string) => void;
}) {
  const user = useAuth((s) => s.user);
  useEffect(() => {
    if (!enabled || !user) return;
    const socket = io({ autoConnect: false, auth: { token: getAccessToken() } });
    const connect = () => {
      const token = getAccessToken();
      socket.disconnect();
      if (token) {
        socket.auth = { token };
        socket.connect();
      }
    };
    socket.on('notification', (row) => {
      notificationEvents.dispatchEvent(new Event('change'));
      onMessage(row.title);
    });
    authEvents.addEventListener('token', connect);
    connect();
    return () => {
      authEvents.removeEventListener('token', connect);
      socket.disconnect();
    };
  }, [enabled, user?.id, onMessage]);
  return null;
}
