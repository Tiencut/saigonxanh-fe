/**
 * Tiện ích xuất file Excel / CSV chuẩn UTF-8 có BOM tiếng Việt
 */

export function exportToCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  // Thêm BOM (Byte Order Mark) để Excel mở tiếng Việt không bị lỗi font
  const BOM = '\uFEFF';
  const csvContent =
    BOM +
    [
      headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','),
      ...rows.map((row) =>
        row
          .map((cell) => {
            const val = cell === null || cell === undefined ? '' : String(cell);
            return `"${val.replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
