export function getTimestamp(messageDate: Date): string {
  const now = new Date();
  const diffInSeconds: number = Math.floor((now.getTime() - messageDate.getTime()) / 1000);
  const diffInMinutes: number = Math.floor(diffInSeconds / 60);
  const diffInHours: number = Math.floor(diffInMinutes / 60);
  const diffInDays: number = Math.floor(diffInHours / 24);

  if (diffInDays === 0) {
    if (diffInHours < 1) {
      if (diffInMinutes < 1) {
        return diffInSeconds <= 1 ? "Just now" : `${diffInSeconds} sec ago`;
      }
      return `${diffInMinutes} min ago`;
    }
    return `${diffInHours} h ago`;
  }

  if (diffInDays === 1) {
    return "Yesterday";
  }

  const sameYear = messageDate.getFullYear() === now.getFullYear();
  const day = messageDate.getDate().toString().padStart(2, "0");
  const month = (messageDate.getMonth() + 1).toString().padStart(2, "0");
  const year = messageDate.getFullYear();

  return sameYear ? `${day}/${month}` : `${day}/${month}/${year}`;
}
