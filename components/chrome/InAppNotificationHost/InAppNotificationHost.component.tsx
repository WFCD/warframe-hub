'use client';

import './InAppNotificationHost.component.scss';

import { useEffect, useState, type FC } from 'react';

import {
  subscribeInAppNotifications,
  type InAppNotification,
} from '@/lib/notifications/inAppNotificationBus';

const DISMISS_MS = 6000;

const InAppNotificationHost: FC = () => {
  const [items, setItems] = useState<InAppNotification[]>([]);

  useEffect(() => {
    return subscribeInAppNotifications((notification) => {
      setItems((current) => [...current, notification]);

      window.setTimeout(() => {
        setItems((current) => current.filter((entry) => entry.id !== notification.id));
      }, DISMISS_MS);
    });
  }, []);

  if (!items.length) return null;

  return (
    <div className="hub-in-app-notifications" aria-live="polite">
      {items.map((notification) => (
        <button
          key={notification.id}
          type="button"
          className="hub-in-app-notification"
          onClick={() => {
            if (notification.link) {
              window.open(notification.link, '_blank', 'noopener,noreferrer');
            }
            setItems((current) => current.filter((entry) => entry.id !== notification.id));
          }}
        >
          <img className="hub-in-app-notification-icon" src={notification.icon} alt="" />
          <span className="hub-in-app-notification-copy">
            <strong className="hub-in-app-notification-title">{notification.title}</strong>
            {notification.body ? (
              <span className="hub-in-app-notification-body">{notification.body}</span>
            ) : null}
          </span>
        </button>
      ))}
    </div>
  );
};

export default InAppNotificationHost;
