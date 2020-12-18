const MILLISECONDS_IN_SECONDS = 1000;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTE = 60;
function getTimeString(time: number | undefined): string {
  if (!time) return '';
  const timeString = new Date(time).toLocaleTimeString();
  const [clock, meridiem] = timeString.split(' ');
  return `${clock.split(':').slice(0, 2).join(':')} ${meridiem.toLowerCase()}`;
}

function padNum(num: number) {
  return num.toString().padStart(2, '0');
}

function getTotalTime(startTime: number, endTime: number): string {
  let totalSeconds = (endTime - startTime) / MILLISECONDS_IN_SECONDS;
  const hours = Math.floor(totalSeconds / SECONDS_IN_HOUR);
  // remove hours if any
  totalSeconds = Math.abs(totalSeconds - hours * SECONDS_IN_HOUR);

  const mins = Math.floor(totalSeconds / SECONDS_IN_MINUTE);

  totalSeconds = Math.abs(totalSeconds - mins * SECONDS_IN_MINUTE);
  return `${padNum(hours)}:${padNum(mins)}:${padNum(Math.floor(totalSeconds))}`;
}

export { getTimeString, getTotalTime };
