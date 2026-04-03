export function exportToCSV(
  filename: string,
  rows: Record<string, string | number>[]
) {
  if (!rows || !rows.length) return;

  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers.map((fieldName) => `"${row[fieldName]}"`).join(',')
    ),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
