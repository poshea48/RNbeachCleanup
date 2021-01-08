const MILLISECONDS_IN_SECONDS = 1000;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTE = 60;

// returns for example: 3:45 pm
function getTimeString(time: number | undefined): string {
  if (!time) return '';
  const timeString = new Date(time).toLocaleTimeString();
  const [clock, meridiem] = timeString.split(' ');
  return `${clock.split(':').slice(0, 2).join(':')} ${meridiem.toLowerCase()}`;
}

function padNum(num: number) {
  return num.toString().padStart(2, '0');
}

// returns HH:MM:SS
function getTotalTime(startTime: number, endTime: number): string {
  let totalSeconds = (endTime - startTime) / MILLISECONDS_IN_SECONDS;
  const hours = Math.floor(totalSeconds / SECONDS_IN_HOUR);
  // remove hours if any
  totalSeconds = Math.abs(totalSeconds - hours * SECONDS_IN_HOUR);

  const mins = Math.floor(totalSeconds / SECONDS_IN_MINUTE);

  totalSeconds = Math.abs(totalSeconds - mins * SECONDS_IN_MINUTE);
  return `${padNum(hours)}:${padNum(mins)}:${padNum(Math.floor(totalSeconds))}`;
}

function convertTimeForDisplay(
  totalTime: number | undefined,
): { hours: string; mins: string; secs: string } {
  let hours = '00';
  let mins = '00';
  let secs = '00';

  if (totalTime) {
    hours = '0' + String(Math.floor(totalTime / 3600));
    mins = ('0' + String(Math.floor((totalTime % 3600) / 60))).slice(-2);
    secs = ('0' + String(totalTime % 60)).slice(-2);
  }

  return {
    hours,
    mins,
    secs,
  };
}

export { getTimeString, getTotalTime, convertTimeForDisplay };
