export function getScore(key) {
  const value = localStorage.getItem(key);
  return value ? Number(value) : 0;
}

export function setScore(key, newScore) {
  const current = getScore(key);

  if (newScore > current) {
    localStorage.setItem(key, newScore);
  }
}
