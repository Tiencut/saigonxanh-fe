import { useState } from 'react';
import { Button, DataTable, Dialog, ErrorState, FormField, Select } from '@base/ui';
import { api, downloadExport, useAuth } from './api';
import { useI18n, errorMessage } from './i18n';
type Preview = {
  valid?: number;
  preview?: { title: string; description: string }[];
  errors: { row: number; errors: Record<string, string[]> }[];
};
const texts = {
  vi: {
    open: 'Nhập / Xuất',
    title: 'Nhập và xuất dữ liệu',
    format: 'Định dạng xuất',
    download: 'Tải dữ liệu',
    importTitle: 'Nhập từ file',
    hint: 'CSV hoặc XLSX, tối đa 2 MB và 1.000 dòng. Hai cột bắt buộc: title, description. Dữ liệu sẽ được thêm vào danh sách của bạn.',
    file: 'Chọn file dữ liệu',
    preview: 'Kiểm tra và xem trước',
    confirm: 'Xác nhận nhập',
    cancel: 'Đóng',
    row: 'Dòng',
    error: 'Lỗi',
    ready: 'Số dòng hợp lệ',
    sample: 'Xem trước tối đa 10 dòng',
    invalid: 'File có dòng lỗi; chưa có dữ liệu nào được nhập.',
    uploaded: 'Đã nhập',
    select: 'Chọn file CSV hoặc XLSX trước.',
    size: 'File phải nhỏ hơn hoặc bằng 2 MB.',
    empty: 'File không có dòng dữ liệu.',
  },
  en: {
    open: 'Import / Export',
    title: 'Import and export data',
    format: 'Export format',
    download: 'Download data',
    importTitle: 'Import from file',
    hint: 'CSV or XLSX, at most 2 MB and 1,000 rows. Required columns: title, description. Records are added to your own list.',
    file: 'Choose data file',
    preview: 'Validate and preview',
    confirm: 'Confirm import',
    cancel: 'Close',
    row: 'Row',
    error: 'Error',
    ready: 'Valid rows',
    sample: 'Preview of up to 10 rows',
    invalid: 'The file has invalid rows. No records have been imported.',
    uploaded: 'Imported',
    select: 'Choose a CSV or XLSX file first.',
    size: 'The file must be at most 2 MB.',
    empty: 'The file has no data rows.',
  },
};
export function Transfers({
  onImported,
  notify,
}: {
  onImported: () => void;
  notify: (message?: string) => void;
}) {
  const { locale, t } = useI18n(),
    text = texts[locale],
    user = useAuth((s) => s.user)!,
    canImport = user.permissions.includes('data.import'),
    canExport = user.permissions.includes('data.export');
  const [open, setOpen] = useState(false),
    [file, setFile] = useState<File | null>(null),
    [preview, setPreview] = useState<Preview | null>(null),
    [format, setFormat] = useState<'csv' | 'xlsx'>('csv'),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  if (!canImport && !canExport) return null;
  function describe(e: any) {
    return (
      (
        {
          INVALID_IMPORT_COLUMNS:
            locale === 'vi'
              ? 'Tên và thứ tự cột phải là title, description.'
              : 'Column names and order must be title, description.',
          IMPORT_EMPTY: text.empty,
          IMPORT_LIMIT_EXCEEDED:
            locale === 'vi' ? 'File vượt quá 1.000 dòng.' : 'The file exceeds 1,000 rows.',
          INVALID_IMPORT_FILE:
            locale === 'vi' ? 'Không đọc được file dữ liệu.' : 'Unable to read this data file.',
        } as Record<string, string>
      )[e.code] || errorMessage(e, t)
    );
  }
  async function send(validate: boolean) {
    if (!file) {
      setError(text.select);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const body = new FormData();
      body.append('file', file);
      const result = await api('/transfers/items/import?preview=' + String(validate), {
        method: 'POST',
        body,
      });
      if (result.errors?.length) {
        setPreview(result);
        return;
      }
      if (validate) setPreview(result);
      else {
        notify(text.uploaded + ': ' + result.imported);
        onImported();
        setOpen(false);
        setFile(null);
        setPreview(null);
      }
    } catch (e) {
      setError(describe(e));
    } finally {
      setBusy(false);
    }
  }
  function close() {
    if (busy) return;
    setOpen(false);
    setFile(null);
    setPreview(null);
    setError('');
  }
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {text.open}
      </Button>
      <Dialog open={open} title={text.title} onClose={close}>
        {canExport && (
          <section>
            <FormField label={text.format}>
              <Select
                value={format}
                disabled={busy}
                onChange={(e) => setFormat(e.target.value as 'csv' | 'xlsx')}
              >
                <option value="csv">CSV</option>
                <option value="xlsx">Excel (.xlsx)</option>
              </Select>
            </FormField>
            <Button
              variant="secondary"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setError('');
                try {
                  await downloadExport(format);
                } catch (e) {
                  setError(describe(e));
                } finally {
                  setBusy(false);
                }
              }}
            >
              {text.download}
            </Button>
          </section>
        )}
        {canImport && (
          <section className="transfer-import">
            <h3>{text.importTitle}</h3>
            <p className="muted">{text.hint}</p>
            <FormField label={text.file}>
              <input
                type="file"
                accept=".csv,.xlsx"
                disabled={busy}
                onChange={(e) => {
                  const selected = e.target.files?.[0] || null;
                  setPreview(null);
                  setError('');
                  setFile(null);
                  if (!selected) return;
                  if (!/\.(csv|xlsx)$/i.test(selected.name)) {
                    setError(text.select);
                    return;
                  }
                  if (selected.size > 2 * 1024 * 1024) {
                    setError(text.size);
                    return;
                  }
                  setFile(selected);
                }}
              />
            </FormField>
            <Button variant="secondary" disabled={!file || busy} onClick={() => send(true)}>
              {text.preview}
            </Button>
            {preview?.errors.length ? (
              <>
                <p className="field-error" role="alert">
                  {text.invalid}
                </p>
                <DataTable
                  rows={preview.errors.map((entry, index) => ({ ...entry, id: String(index) }))}
                  columns={[
                    { key: 'row', label: text.row, render: (r) => r.row },
                    {
                      key: 'error',
                      label: text.error,
                      render: (r) =>
                        Object.entries(r.errors).map(([field, messages]) => (
                          <p key={field}>
                            {field === 'title'
                              ? t('title')
                              : field === 'description'
                                ? t('description')
                                : field}
                            :{' '}
                            {field === 'title'
                              ? locale === 'vi'
                                ? 'Tiêu đề phải có từ 1 đến 160 ký tự.'
                                : 'Title must contain 1 to 160 characters.'
                              : field === 'description'
                                ? locale === 'vi'
                                  ? 'Mô tả phải là văn bản, tối đa 10.000 ký tự.'
                                  : 'Description must be text with at most 10,000 characters.'
                                : messages.join(', ')}
                          </p>
                        )),
                    },
                  ]}
                />
              </>
            ) : (
              preview && (
                <div className="transfer-preview" role="status">
                  <p>
                    {text.ready}: {preview.valid}
                  </p>
                  <small className="muted">{text.sample}</small>
                  <DataTable
                    rows={(preview.preview || []).map((row, index) => ({
                      ...row,
                      id: String(index),
                    }))}
                    columns={[
                      { key: 'title', label: t('title'), render: (r) => r.title },
                      { key: 'description', label: t('description'), render: (r) => r.description },
                    ]}
                  />
                </div>
              )
            )}
          </section>
        )}
        {error && <ErrorState message={error} />}
        <footer className="actions">
          <Button variant="secondary" disabled={busy} onClick={close}>
            {text.cancel}
          </Button>
          {canImport && (
            <Button
              loading={busy}
              disabled={!preview?.valid || !!preview.errors.length}
              onClick={() => send(false)}
            >
              {text.confirm}
            </Button>
          )}
        </footer>
      </Dialog>
    </>
  );
}
