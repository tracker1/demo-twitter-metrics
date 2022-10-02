export function hour() {
  return +(new Date().toISOString().replace(/\D/g, "").substring(0, 10));
}

export function prev(hour: number) {
  if (hour % 100 === 0) return hour - 77;
  return hour - 1;
}

export function hoursList(hour: number, hours: number) {
  let current = hour;
  const ret = [];
  while (ret.length < hours) {
    ret.push(current);
    current = prev(current);
  }
  return ret;
}

export function count(hour: number) {
  return `count:${hour}`;
}

export function tag(hour: number) {
  return `hashtag:${hour}`;
}

export function countRollup(hour: number, hours: number) {
  return `rollup:${hour}:count${hours}`;
}

export function tagRollup(hour: number, hours: number) {
  return `rollup:${hour}:hashtag${hours}`;
}
