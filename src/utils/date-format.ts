// src/utils/date-format.ts
import { formatDistanceToNowStrict } from 'date-fns';

export const formatTimeAgo = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return formatDistanceToNowStrict(date, { addSuffix: true })
      .replace(' ago', ' ago') // Default
      .replace('seconds', 's') // Optional: Shorten if you want "1m" instead of "1 minute"
      .replace('minute', 'm')
      .replace('hour', 'h')
      .replace('day', 'd');
  } catch (error) {
    return '';
  }
};