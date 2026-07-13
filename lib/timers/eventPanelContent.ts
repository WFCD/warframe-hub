type HubEventLike = {
  active?: boolean;
};

export const getActiveEvents = (events: unknown): HubEventLike[] => {
  if (!Array.isArray(events)) return [];
  return events.filter((event): event is HubEventLike => {
    if (!event || typeof event !== 'object') return false;
    return Boolean((event as HubEventLike).active);
  });
};

export const hasActiveEvents = (events: unknown): boolean => getActiveEvents(events).length > 0;
