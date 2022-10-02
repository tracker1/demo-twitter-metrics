export function hour() {
  return +(new Date().toISOString().replace(/\D/g, "").substring(0, 10));
}

export function prev(hour: number, hoursBack = 1) {
  const [_, y, m, d, h] = `${hour}`.match(/(\d{4})(\d{2})(\d{2})(\d{2})/) || [];
  const dtm = new Date(`${y}-${m}-${d}T${h}:00:00Z`);
  dtm.setHours(dtm.getHours() - hoursBack);
  return +dtm.toISOString().replace(/\D/g, "").substring(0, 10);
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
