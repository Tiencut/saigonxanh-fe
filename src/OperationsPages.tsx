import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Button,
  ConfirmDialog,
  DataTable,
  Dialog,
  EmptyState,
  ErrorState,
  FormField,
  Pagination,
  Select,
  Skeleton,
} from '@base/ui';
import { request, patch, post, useAuth } from './api';
import { useI18n, errorMessage } from './i18n';
import { PageHeader } from './App';
type Row = {
  id: string;
  userId?: string;
  kind: string;
  message?: string;
  status: string;
  attempts?: number;
  maxAttempts?: number;
  runAt?: string;
  error?: string;
  createdAt: string;
};
const copy = {
  vi: {
    jobs: 'Công việc nền',
    privacy: 'Yêu cầu dữ liệu cá nhân',
    jobHint: 'Theo dõi lần chạy và thử lại công việc thất bại.',
    privacyHint: 'Theo dõi yêu cầu truy cập, chỉnh sửa hoặc xóa dữ liệu.',
    all: 'Tất cả trạng thái',
    status: 'Trạng thái',
    kind: 'Loại',
    created: 'Tạo lúc',
    attempts: 'Số lần chạy',
    actions: 'Thao tác',
    retry: 'Thử lại',
    retryTitle: 'Thử lại công việc?',
    retryBody: 'Công việc sẽ được đưa về hàng đợi và có thể tạo lại tác động bên ngoài.',
    details: 'Chi tiết',
    owner: 'Người yêu cầu',
    save: 'Lưu trạng thái',
    noData: 'Chưa có yêu cầu',
    emptyJobs: 'Chưa có công việc nền',
    reviewHint:
      'Xác minh danh tính và thực hiện yêu cầu theo chính sách trước khi đánh dấu hoàn tất.',
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    completed: 'Hoàn tất',
    rejected: 'Từ chối',
    done: 'Đã chạy',
    running: 'Đang chạy',
    failed: 'Thất bại',
    access: 'Truy cập dữ liệu',
    correct: 'Chỉnh sửa dữ liệu',
    delete: 'Xóa dữ liệu',
  },
  en: {
    jobs: 'Background jobs',
    privacy: 'Personal data requests',
    jobHint: 'Inspect runs and retry failed jobs.',
    privacyHint: 'Track requests to access, correct or delete personal data.',
    all: 'All statuses',
    status: 'Status',
    kind: 'Type',
    created: 'Created',
    attempts: 'Attempts',
    actions: 'Actions',
    retry: 'Retry',
    retryTitle: 'Retry this job?',
    retryBody: 'The job will return to the queue and may repeat external effects.',
    details: 'Details',
    owner: 'Requester',
    save: 'Save status',
    noData: 'No requests yet',
    emptyJobs: 'No background jobs',
    reviewHint:
      'Verify identity and fulfil the request according to your policy before marking it complete.',
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    rejected: 'Rejected',
    done: 'Done',
    running: 'Running',
    failed: 'Failed',
    access: 'Access data',
    correct: 'Correct data',
    delete: 'Delete data',
  },
};
export function OperationsPage({
  kind,
  notify,
}: {
  kind: 'jobs' | 'privacy-requests';
  notify: (message?: string) => void;
}) {
  const { locale, t } = useI18n(),
    text = copy[locale],
    user = useAuth((s) => s.user)!;
  const [params, setParams] = useSearchParams(),
    [rows, setRows] = useState<Row[]>([]),
    [total, setTotal] = useState(0),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [revision, setRevision] = useState(0),
    [selected, setSelected] = useState<Row | null>(null),
    [status, setStatus] = useState(''),
    [busy, setBusy] = useState(false);
  const page = Number(params.get('page') || 1),
    filter = params.get('status') || '',
    isJobs = kind === 'jobs',
    canManage = user.permissions.includes(isJobs ? 'jobs.manage' : 'users.update');
  const refresh = useCallback(() => setRevision((v) => v + 1), []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    request<Row[]>('/' + kind + '?' + params.toString())
      .then((result) => {
        if (active) {
          setRows(result.data);
          setTotal(result.meta?.total || 0);
        }
      })
      .catch((e) => {
        if (active) setError(errorMessage(e, t));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [kind, params, revision, t]);
  async function submit() {
    if (!selected) return;
    setBusy(true);
    setError('');
    try {
      if (isJobs) await post('/jobs/' + selected.id + '/retry');
      else await patch('/privacy-requests/' + selected.id, { status });
      setSelected(null);
      refresh();
      notify(t('saved'));
    } catch (e) {
      setError(errorMessage(e, t));
    } finally {
      setBusy(false);
    }
  }
  const label = (value: string) =>
    (
      ({
        PENDING: text.pending,
        PROCESSING: text.processing,
        COMPLETED: text.completed,
        REJECTED: text.rejected,
        DONE: text.done,
        RUNNING: text.running,
        FAILED: text.failed,
        ACCESS: text.access,
        CORRECT: text.correct,
        DELETE: text.delete,
      }) as Record<string, string>
    )[value] || value;
  const statuses = isJobs
    ? ['PENDING', 'RUNNING', 'DONE', 'FAILED']
    : ['PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED'];
  const columns = [
    { key: 'kind', label: text.kind, render: (row: Row) => label(row.kind) },
    { key: 'status', label: text.status, render: (row: Row) => label(row.status) },
    ...(isJobs
      ? [
          {
            key: 'attempts',
            label: text.attempts,
            render: (row: Row) => `${row.attempts}/${row.maxAttempts}`,
          },
        ]
      : canManage
        ? [
            {
              key: 'userId',
              label: text.owner,
              render: (row: Row) => <code className="truncate">{row.userId}</code>,
            },
          ]
        : []),
    {
      key: 'createdAt',
      label: text.created,
      render: (row: Row) => new Date(row.createdAt).toLocaleString(locale),
    },
    {
      key: 'actions',
      label: text.actions,
      render: (row: Row) => (
        <Button
          variant="ghost"
          onClick={() => {
            setError('');
            setSelected(row);
            setStatus(row.status);
          }}
        >
          {isJobs && row.status === 'FAILED' ? text.retry : text.details}
        </Button>
      ),
    },
  ];
  return (
    <>
      <PageHeader
        title={isJobs ? text.jobs : text.privacy}
        description={isJobs ? text.jobHint : text.privacyHint}
      />
      <div className="list-toolbar">
        <Select
          aria-label={text.status}
          value={filter}
          onChange={(e) =>
            setParams((p) => {
              if (e.target.value) p.set('status', e.target.value);
              else p.delete('status');
              p.set('page', '1');
              return p;
            })
          }
        >
          <option value="">{text.all}</option>
          {statuses.map((value) => (
            <option key={value} value={value}>
              {label(value)}
            </option>
          ))}
        </Select>
      </div>
      {error && <ErrorState message={error} retry={refresh} />}{' '}
      {loading ? (
        <Skeleton />
      ) : rows.length ? (
        <>
          <DataTable rows={rows} columns={columns} />
          <Pagination
            page={page}
            pageSize={20}
            total={total}
            onChange={(value) =>
              setParams((p) => {
                p.set('page', String(value));
                return p;
              })
            }
          />
        </>
      ) : (
        !error && <EmptyState title={isJobs ? text.emptyJobs : text.noData} />
      )}
      {isJobs ? (
        <ConfirmDialog
          open={!!selected && selected.status === 'FAILED'}
          title={text.retryTitle}
          description={text.retryBody}
          loading={busy}
          onClose={() => setSelected(null)}
          onConfirm={submit}
          variant="primary"
          confirmLabel={text.retry}
          cancelLabel={t('cancel')}
        />
      ) : (
        <Dialog open={!!selected} title={text.details} onClose={() => setSelected(null)}>
          {selected && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <p className="legal-copy">{selected.message}</p>
              {canManage ? (
                <>
                  <p className="muted">{text.reviewHint}</p>
                  <FormField label={text.status}>
                    <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                      {statuses.map((value) => (
                        <option key={value} value={value}>
                          {label(value)}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                  {error && (
                    <p className="field-error" role="alert">
                      {error}
                    </p>
                  )}
                  <footer className="actions">
                    <Button type="button" variant="secondary" onClick={() => setSelected(null)}>
                      {t('cancel')}
                    </Button>
                    <Button loading={busy}>{text.save}</Button>
                  </footer>
                </>
              ) : (
                <p>{label(selected.status)}</p>
              )}
            </form>
          )}
        </Dialog>
      )}
      {isJobs && selected && selected.status !== 'FAILED' && (
        <Dialog open title={text.details} onClose={() => setSelected(null)}>
          <dl className="system-list">
            {Object.entries(selected).map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{String(value ?? '—')}</dd>
              </div>
            ))}
          </dl>
        </Dialog>
      )}
    </>
  );
}
