export const formatDateTime = (timestamp: string): string => {
  const date = new Date(timestamp)

  date.setUTCHours(date.getUTCHours() + 7)

  const day = date.getUTCDate();
  const month = date.toLocaleString('id-ID', { month: '2-digit' });
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  // Format date and time components into desired format
  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${minutes}`;

  const timeZoneAbbr = 'WIB';
  return `${formattedDate} ${formattedTime} ${timeZoneAbbr}`
}
