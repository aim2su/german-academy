export function formatDushanbe(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";

  const dushanbeDate = new Date(date.getTime() + 5 * 60 * 60 * 1000);

  const day = String(dushanbeDate.getUTCDate()).padStart(2, "0");
  const month = String(dushanbeDate.getUTCMonth() + 1).padStart(2, "0");
  const year = dushanbeDate.getUTCFullYear();
  const hours = String(dushanbeDate.getUTCHours()).padStart(2, "0");
  const minutes = String(dushanbeDate.getUTCMinutes()).padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export function formatRelative(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  const now = new Date();
  const diffMin = Math.floor((now - date) / 60000);

  if (diffMin < 1) return "только что";
  if (diffMin < 60) return `${diffMin} мин назад`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} ч назад`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "вчера";
  if (diffDays < 7) return `${diffDays} дн назад`;

  return formatDushanbe(dateString);
}