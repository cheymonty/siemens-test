import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.extend(relativeTime);

export function transformDate(dateStr: string): string {
  const date = dayjs(dateStr);

  if (date.isToday()) return 'Today';
  if (date.isTomorrow()) return 'Tomorrow';

  return date.format('MMM D');
}

export function getTimeFromNow(dateStr: string): string {
  const date = dayjs(dateStr);

  return date.fromNow();
}
