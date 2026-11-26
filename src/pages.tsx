import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Button,
  Input,
  Select,
  FormField,
  DataTable,
  Pagination,
  EmptyState,
  Skeleton,
  ErrorState,
  Dialog,
  ConfirmDialog,
  FileUploader,
  ImagePreview,
  Tabs,
} from '@base/ui';
import { permissionCodes, itemSchema } from '@base/shared';
import { api, request, post, patch, useAuth, fileUrl } from './api';
import { useI18n, errorMessage } from './i18n';
import { notificationEvents } from './realtime';
import { PwaSettings } from './pwa';
import { Transfers } from './Transfers';
import { PageHeader, type PublicConfig } from './App';
type Notify = (message?: string) => void;
function useAction(notify: Notify) {
  const { t } = useI18n(),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const run = async (fn: () => Promise<void>) => {
    setError('');
    setBusy(true);
    try {
      await fn();
      notify(t('saved'));
    } catch (e) {
      setError(errorMessage(e, t));
    } finally {
      setBusy(false);
    }
  };
  return { error, busy, run, setError };
}
export function ResourcePage({
  kind,
  config,
  notify,
}: {
  kind: string;
  config: PublicConfig;
  notify: Notify;
}) {
  const { t } = useI18n(),
    user = useAuth((s) => s.user)!,
    [params, setParams] = useSearchParams(),
    [search, setSearch] = useState(params.get('search') || ''),
    [rows, setRows] = useState<any[]>([]),
    [total, setTotal] = useState(0),
    [loading, setLoading] = useState(true),
    [loadError, setLoadError] = useState(''),
    [revision, setRevision] = useState(0),
    [editor, setEditor] = useState<any>(null),
    [removing, setRemoving] = useState<any>(null),
    [roles, setRoles] = useState<any[]>([]),
    [selected, setSelected] = useState(new Set<string>()),
    action = useAction(notify);
  const page = Math.max(1, Number(params.get('page') || 1)),
    deleted = params.get('deleted') === 'true',
    sort = params.get('sort') || 'createdAt',
    order = params.get('order') || 'desc';
  const permission = (
    {
      users: 'users.read',
      roles: 'roles.read',
      audit: 'audit.read',
      items: 'items.read',
    } as Record<string, string>
  )[kind];
  const allowed =
    (!permission || user.permissions.includes(permission)) &&
    (kind !== 'notifications' || config.modules.notifications);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (params.get('search') || ''))
        setParams(
          (p) => {
            p.set('search', search);
            p.set('page', '1');
            return p;
          },
          { replace: true },
        );
    }, 300);
    return () => clearTimeout(timer);
  }, [search, params, setParams]);
  useEffect(() => {
    let active = true;
    if (!allowed) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError('');
    setSelected(new Set());
    request('/' + kind + '?' + params.toString())
      .then((result) => {
        if (!active) return;
        const list = kind === 'notifications' ? result.data.rows : result.data;
        setRows(list);
        setTotal(result.meta?.total ?? list.length);
      })
      .catch((e) => {
        if (active) setLoadError(errorMessage(e, t));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [kind, params, revision, allowed, t]);
  const refresh = () => setRevision((v) => v + 1);
  useEffect(() => {
    const update = () => setRevision((v) => v + 1);
    notificationEvents.addEventListener('change', update);
    return () => notificationEvents.removeEventListener('change', update);
  }, []);
  async function openEditor(row: any) {
    action.setError('');
    if (kind === 'users' && user.permissions.includes('roles.read'))
      try {
        setRoles(await api('/roles'));
      } catch (e) {
        action.setError(errorMessage(e, t));
        return;
      }
    setEditor(
      kind === 'roles'
        ? { ...row, permissions: row?.permissions?.map((p: any) => p.permissionId) || [] }
        : row || {},
    );
  }
  if (!allowed)
    return <PageHeader title={t('forbiddenTitle')} description={t('forbiddenDescription')} />;
  const canAdd =
    (kind === 'items' && user.permissions.includes('items.create')) ||
    (kind === 'users' && user.permissions.includes('users.create')) ||
    (kind === 'roles' && user.permissions.includes('roles.update'));
  const canEdit =
    (kind === 'items' && user.permissions.includes('items.update') && !deleted) ||
    (kind === 'users' && user.permissions.includes('users.update')) ||
    (kind === 'roles' && user.permissions.includes('roles.update'));
  const columns =
    kind === 'items'
      ? [
          {
            key: 'title',
            label: t('title'),
            sortable: true,
            render: (r: any) => <strong>{r.title}</strong>,
          },
          {
            key: 'description',
            label: t('description'),
            render: (r: any) => <span className="truncate">{r.description || '—'}</span>,
          },
          {
            key: 'createdAt',
            label: t('created'),
            sortable: true,
            render: (r: any) => new Date(r.createdAt).toLocaleDateString(),
          },
        ]
      : kind === 'users'
        ? [
            {
              key: 'name',
              label: t('name'),
              sortable: true,
              render: (r: any) => <strong>{r.name}</strong>,
            },
            { key: 'email', label: t('email'), sortable: true, render: (r: any) => r.email },
            { key: 'roles', label: t('roles'), render: (r: any) => r.roles.join(', ') },
            {
              key: 'active',
              label: t('status'),
              render: (r: any) => (
                <span className={r.active ? 'status-active' : 'muted'}>
                  {r.active ? t('active') : t('locked')}
                </span>
              ),
            },
          ]
        : kind === 'roles'
          ? [
              { key: 'name', label: t('roles'), render: (r: any) => <strong>{r.name}</strong> },
              {
                key: 'description',
                label: t('description'),
                render: (r: any) => r.description || '—',
              },
              {
                key: 'permissions',
                label: t('roles'),
                render: (r: any) => r.permissions.length,
              },
            ]
          : kind === 'notifications'
            ? [
                { key: 'title', label: t('title'), render: (r: any) => <strong>{r.title}</strong> },
                { key: 'body', label: t('content'), render: (r: any) => r.body },
                {
                  key: 'readAt',
                  label: t('status'),
                  render: (r: any) => (r.readAt ? t('read') : t('unread')),
                },
              ]
            : [
                {
                  key: 'createdAt',
                  label: t('createdAt'),
                  render: (r: any) => new Date(r.createdAt).toLocaleString(),
                },
                { key: 'action', label: t('actions'), render: (r: any) => r.action },
                { key: 'entity', label: t('items'), render: (r: any) => r.entity },
                ...(kind === 'audit'
                  ? [
                      { key: 'actorId', label: t('name'), render: (r: any) => r.actorId || 'System' },
                      {
                        key: 'requestId',
                        label: 'Request ID',
                        render: (r: any) => <code className="truncate">{r.requestId || '—'}</code>,
                      },
                    ]
                  : []),
              ];
  columns.push({
    key: 'actions',
    label: t('actions'),
    render: (r: any) => (
      <div className="row-actions">
        {canEdit && !(kind === 'roles' && r.name === 'ADMIN') && (
          <Button variant="ghost" onClick={() => openEditor(r)}>
            {t('edit')}
          </Button>
        )}
        {kind === 'items' && !deleted && user.permissions.includes('items.delete') && (
          <Button variant="ghost" onClick={() => setRemoving(r)}>
            {t('delete')}
          </Button>
        )}
        {kind === 'items' && deleted && (
          <>
            {user.permissions.includes('items.restore') && (
              <Button
                variant="ghost"
                onClick={() =>
                  action.run(async () => {
                    await post('/items/' + r.id + '/restore');
                    refresh();
                  })
                }
              >
                {t('restore')}
              </Button>
            )}
            {user.permissions.includes('items.purge') && (
              <Button variant="ghost" onClick={() => setRemoving(r)}>
                {t('deletePermanently')}
              </Button>
            )}
          </>
        )}
        {kind === 'notifications' && !r.readAt && (
          <Button
            variant="ghost"
            onClick={() =>
              action.run(async () => {
                await patch('/notifications/' + r.id + '/read', {});
                refresh();
              })
            }
          >
            {t('markRead')}
          </Button>
        )}
        {kind === 'audit' && (
          <Button variant="ghost" onClick={() => setEditor(r)}>
            {t('details')}
          </Button>
        )}
      </div>
    ),
  });
  async function save() {
    await action.run(async () => {
      if (kind === 'items') {
        const body = itemSchema.parse(editor);
        await (editor.id ? patch('/items/' + editor.id, body) : post('/items', body));
      }
      if (kind === 'users') {
        if (editor.id) {
          const body: any = { name: editor.name, active: editor.active };
          if (editor.roleIds) body.roleIds = editor.roleIds;
          await patch('/users/' + editor.id, body);
        } else
          await post('/users', {
            name: editor.name,
            email: editor.email,
            password: editor.password,
          });
      }
      if (kind === 'roles') {
        const body = {
          name: editor.name,
          description: editor.description || '',
          permissions: editor.permissions,
        };
        await (editor.id ? patch('/roles/' + editor.id, body) : post('/roles', body));
      }
      setEditor(null);
      refresh();
    });
  }
  return (
    <>
      <PageHeader
        title={t(kind)}
        description={
          kind === 'items'
            ? t('manage_records_hint', 'Manage your records. Deleted items can be restored from Trash.')
            : undefined
        }
        action={
          canAdd && !deleted ? (
            <Button onClick={() => openEditor(null)}>{t('add')}</Button>
          ) : undefined
        }
      />
      <div className="list-toolbar">
        {kind === 'items' && config.modules.import_export && !deleted && (
          <Transfers onImported={refresh} notify={notify} />
        )}
        <Input
          aria-label={t('search')}
          placeholder={t('search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {kind === 'items' && (
          <Tabs
            tabs={[
              { id: 'active', label: t('active') },
              { id: 'deleted', label: t('trash') },
            ]}
            value={deleted ? 'deleted' : 'active'}
            onChange={(v) =>
              setParams((p) => {
                p.set('deleted', String(v === 'deleted'));
                p.set('page', '1');
                return p;
              })
            }
          />
        )}
        <span className="muted">{total} {t('records')}</span>
      </div>
      {action.error && <ErrorState message={action.error} />}{' '}
      {loading ? (
        <Skeleton />
      ) : loadError ? (
        <ErrorState message={loadError} retry={refresh} />
      ) : rows.length ? (
        <>
          <DataTable
            columns={columns}
            rows={rows}
            sortKey={sort}
            onSort={(key) =>
              setParams((p) => {
                p.set('sort', key);
                p.set('order', sort === key && order === 'asc' ? 'desc' : 'asc');
                return p;
              })
            }
            selected={selected}
            onSelect={kind === 'items' && !deleted ? setSelected : undefined}
          />
          {selected.size > 0 && user.permissions.includes('items.delete') && (
            <div className="bulk-actions">
              <span>{selected.size} {t('selected')}</span>
              <Button variant="danger" onClick={() => setRemoving({ bulk: true })}>
                {t('deleteSelected')}
              </Button>
            </div>
          )}
          <Pagination
            page={page}
            pageSize={20}
            total={total}
            onChange={(v) =>
              setParams((p) => {
                p.set('page', String(v));
                return p;
              })
            }
          />
        </>
      ) : (
        <EmptyState title={t('empty')} description={t('emptyHint')} />
      )}
      <Dialog
        open={!!editor}
        title={kind === 'audit' ? t('details') : t(editor?.id ? 'edit' : 'add')}
        onClose={() => setEditor(null)}
      >
        {editor && kind === 'audit' ? (
          <pre className="audit-details">{JSON.stringify(editor, null, 2)}</pre>
        ) : (
          editor && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                save();
              }}
            >
              <FormField label={t(kind === 'items' ? 'title' : 'name')}>
                <Input
                  required
                  value={editor.title ?? editor.name ?? ''}
                  onChange={(e) =>
                    setEditor({ ...editor, [kind === 'items' ? 'title' : 'name']: e.target.value })
                  }
                />
              </FormField>
              {['items', 'roles'].includes(kind) && (
                <FormField label={t('description')}>
                  <textarea
                    className="input"
                    rows={3}
                    value={editor.description || ''}
                    onChange={(e) => setEditor({ ...editor, description: e.target.value })}
                  />
                </FormField>
              )}
              {kind === 'users' && !editor.id && (
                <>
                  <FormField label={t('email')}>
                    <Input
                      type="email"
                      required
                      value={editor.email || ''}
                      onChange={(e) => setEditor({ ...editor, email: e.target.value })}
                    />
                  </FormField>
                  <FormField label={t('password')}>
                    <Input
                      type="password"
                      required
                      minLength={12}
                      value={editor.password || ''}
                      onChange={(e) => setEditor({ ...editor, password: e.target.value })}
                    />
                  </FormField>
                </>
              )}
              {kind === 'users' && editor.id && (
                <>
                  <label className="check-line">
                    <input
                      type="checkbox"
                      checked={editor.active}
                      onChange={(e) => setEditor({ ...editor, active: e.target.checked })}
                    />
                    {t('active')}
                  </label>
                  {user.permissions.includes('roles.update') && (
                    <fieldset>
                      <legend>{t('roles')}</legend>
                      {roles.map((role) => (
                        <label key={role.id} className="check-line">
                          <input
                            type="checkbox"
                            checked={
                              editor.roleIds
                                ? editor.roleIds.includes(role.id)
                                : editor.roles.includes(role.name)
                            }
                            onChange={(e) => {
                              const ids =
                                editor.roleIds ||
                                roles.filter((r) => editor.roles.includes(r.name)).map((r) => r.id);
                              setEditor({
                                ...editor,
                                roleIds: e.target.checked
                                  ? [...ids, role.id]
                                  : ids.filter((v: string) => v !== role.id),
                              });
                            }}
                          />
                          {role.name}
                        </label>
                      ))}
                    </fieldset>
                  )}
                </>
              )}
              {kind === 'roles' && (
                <fieldset className="permission-list">
                  <legend>{t('roles')}</legend>
                  {permissionCodes.map((p) => (
                    <label key={p} className="check-line">
                      <input
                        type="checkbox"
                        checked={editor.permissions.includes(p)}
                        onChange={(e) =>
                          setEditor({
                            ...editor,
                            permissions: e.target.checked
                              ? [...editor.permissions, p]
                              : editor.permissions.filter((v: string) => v !== p),
                          })
                        }
                      />
                      <code>{p}</code>
                    </label>
                  ))}
                </fieldset>
              )}
              {action.error && (
                <p className="field-error" role="alert">
                  {action.error}
                </p>
              )}
              <footer className="actions">
                <Button type="button" variant="secondary" onClick={() => setEditor(null)}>
                  {t('cancel')}
                </Button>
                <Button loading={action.busy}>{t('save')}</Button>
              </footer>
            </form>
          )
        )}
      </Dialog>
      <ConfirmDialog
        open={!!removing}
        title={t(deleted ? 'confirmPurgeTitle' : 'confirmDeleteTitle')}
        description={t(deleted ? 'deleteWarningUndo' : 'deleteWarningTrash')}
        confirmLabel={t('confirm')}
        cancelLabel={t('cancel')}
        loading={action.busy}
        onClose={() => setRemoving(null)}
        onConfirm={() =>
          action.run(async () => {
            const ids = removing.bulk ? [...selected] : [removing.id];
            await Promise.all(
              ids.map((id) =>
                api('/items/' + id + (deleted ? '/purge' : ''), { method: 'DELETE' }),
              ),
            );
            setRemoving(null);
            refresh();
          })
        }
      />
    </>
  );
}
export function SessionsPage({ notify }: { notify: Notify }) {
  const { t } = useI18n(),
    [rows, setRows] = useState<any[] | null>(null),
    [target, setTarget] = useState<any>(null),
    action = useAction(notify),
    clear = useAuth((s) => s.clear);
  const load = useCallback(() => api('/auth/sessions').then(setRows), []);
  useEffect(() => {
    load().catch(() => action.setError(t('error')));
  }, [load]);
  return (
    <>
      <PageHeader
        title={t('sessions')}
        description={t('revokeSessionsPageDesc')}
      />
      {action.error && <ErrorState message={action.error} />}{' '}
      {!rows ? (
        <Skeleton />
      ) : (
        <DataTable
          rows={rows}
          columns={[
            {
              key: 'userAgent',
              label: t('device'),
              render: (r) => (
                <span className="truncate">
                  {r.userAgent || 'Unknown'}
                  {r.current && <strong> ({t('currentDevice')})</strong>}
                </span>
              ),
            },
            { key: 'ip', label: 'IP', render: (r) => r.ip },
            {
              key: 'createdAt',
              label: t('signedIn'),
              render: (r) => new Date(r.createdAt).toLocaleString(),
            },
            {
              key: 'actions',
              label: t('actions'),
              render: (r) => (
                <Button variant="secondary" onClick={() => setTarget(r)}>
                  {t('revoke')}
                </Button>
              ),
            },
          ]}
        />
      )}
      <ConfirmDialog
        open={!!target}
        title={t('revokeSessionTitle')}
        description={t('revokeSessionDesc')}
        confirmLabel={t('confirm')}
        cancelLabel={t('cancel')}
        loading={action.busy}
        onClose={() => setTarget(null)}
        onConfirm={() =>
          action.run(async () => {
            await api('/auth/sessions/' + target.id, { method: 'DELETE' });
            if (target.current) clear();
            else await load();
            setTarget(null);
          })
        }
      />
    </>
  );
}
export function ProfilePage({ notify }: { notify: Notify }) {
  const { t } = useI18n(),
    { user, reload, clear } = useAuth(),
    [name, setName] = useState(user!.name),
    [currentPassword, setCurrent] = useState(''),
    [newPassword, setNew] = useState(''),
    [code, setCode] = useState(''),
    [twofa, setTwofa] = useState<any>(null),
    [recovery, setRecovery] = useState<string[]>([]),
    [privacy, setPrivacy] = useState({ kind: 'ACCESS', message: '' }),
    action = useAction(notify);
  return (
    <>
      <PageHeader title={t('profile')} />
      {action.error && <ErrorState message={action.error} />}
      <div className="settings-sections">
        <PwaSettings />
        <section>
          <h2>{t('personalProfile')}</h2>
          <p className="muted">{user!.email}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              action.run(async () => {
                await patch('/auth/profile', { name });
                await reload();
              });
            }}
          >
            <FormField label={t('name')}>
              <Input
                required
                minLength={2}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormField>
            <Button loading={action.busy}>{t('save')}</Button>
          </form>
        </section>
        <section>
          <h2>{t('passwordAndSecurity')}</h2>
          <FormField label={t('currentPassword')}>
            <Input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </FormField>
          {user!.totpEnabled && (
            <FormField label={t('totpLabel')}>
              <Input
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </FormField>
          )}
          <FormField label={t('newPasswordLabel')}>
            <Input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNew(e.target.value)}
            />
          </FormField>
          <div className="actions">
            <Button
              variant="secondary"
              loading={action.busy}
              onClick={() =>
                action.run(async () => {
                  await post('/auth/password', { currentPassword, newPassword, code });
                  clear();
                })
              }
            >
              {t('changePassword')}
            </Button>
            <Button
              variant="secondary"
              loading={action.busy}
              onClick={() =>
                action.run(async () => {
                  await post('/auth/sessions/revoke-others', { password: currentPassword, code });
                })
              }
            >
              {t('signOutOtherDevices')}
            </Button>
          </div>
        </section>
        <section>
          <h2>{t('twoFactorAuth')}</h2>
          <p>{user!.totpEnabled ? t('enabled') : t('notEnabled')}</p>
          {user!.totpEnabled ? (
            <Button
              variant="secondary"
              loading={action.busy}
              onClick={() =>
                action.run(async () => {
                  await post('/auth/2fa/disable', { password: currentPassword, code });
                  await reload();
                })
              }
            >
              {t('disable2FA')}
            </Button>
          ) : (
            <Button
              variant="secondary"
              loading={action.busy}
              onClick={() =>
                action.run(async () =>
                  setTwofa(await post('/auth/2fa/setup', { password: currentPassword })),
                )
              }
            >
              {t('setUpAuthenticator')}
            </Button>
          )}
          {twofa && (
            <div className="twofa-setup">
              <p>{t('twoFaSecretHint')}</p>
              <code>{twofa.secret}</code>
              <FormField label={t('verificationCode')}>
                <Input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </FormField>
              <Button
                loading={action.busy}
                onClick={() =>
                  action.run(async () => {
                    const result = await post('/auth/2fa/enable', { code });
                    setRecovery(result.recoveryCodes);
                    setTwofa(null);
                    await reload();
                  })
                }
              >
                {t('enable2FA')}
              </Button>
            </div>
          )}
        </section>
        <section>
          <h2>{t('personalDataRequest')}</h2>
          <p className="muted">{t('personalDataRequestHint')}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              action.run(async () => {
                await post('/privacy-requests', privacy);
                setPrivacy({ ...privacy, message: '' });
              });
            }}
          >
            <FormField label={t('requestType')}>
              <Select
                value={privacy.kind}
                onChange={(e) => setPrivacy({ ...privacy, kind: e.target.value })}
              >
                <option value="ACCESS">{t('accessMyData')}</option>
                <option value="CORRECT">{t('correctMyData')}</option>
                <option value="DELETE">{t('deleteMyData')}</option>
              </Select>
            </FormField>
            <FormField label={t('detailsPrompt')}>
              <textarea
                className="input"
                required
                minLength={10}
                value={privacy.message}
                onChange={(e) => setPrivacy({ ...privacy, message: e.target.value })}
              />
            </FormField>
            <Button loading={action.busy}>{t('submitRequest')}</Button>
          </form>
        </section>
      </div>
      <Dialog
        open={recovery.length > 0}
        title={t('saveRecoveryCodesTitle')}
        onClose={() => setRecovery([])}
      >
        <p>{t('saveRecoveryCodesDesc')}</p>
        <pre>{recovery.join('\n')}</pre>
        <Button onClick={() => setRecovery([])}>{t('savedCodesConfirm')}</Button>
      </Dialog>
    </>
  );
}
export function FilesPage({ notify }: { notify: Notify }) {
  const { t } = useI18n(),
    [rows, setRows] = useState<any[] | null>(null),
    [preview, setPreview] = useState(''),
    [target, setTarget] = useState<any>(null),
    action = useAction(notify),
    reloadUser = useAuth((s) => s.reload);
  const load = useCallback(() => api('/files').then(setRows), []);
  useEffect(() => {
    load().catch(() => action.setError(t('error')));
  }, [load]);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  return (
    <>
      <PageHeader
        title={t('files')}
        description={t('filesSpec')}
      />
      {action.error && <ErrorState message={action.error} />}
      <FileUploader
        onUpload={async (file) => {
          const body = new FormData();
          body.append('file', file);
          await api('/files', { method: 'POST', body });
          await load();
          notify(t('saved'));
        }}
      />
      {!rows ? (
        <Skeleton />
      ) : rows.length ? (
        <DataTable
          rows={rows}
          columns={[
            { key: 'name', label: t('fileLabel'), render: (r) => r.name },
            { key: 'size', label: t('sizeLabel'), render: (r) => Math.round(r.size / 1024) + ' KB' },
            {
              key: 'createdAt',
              label: t('created'),
              render: (r) => new Date(r.createdAt).toLocaleString(),
            },
            {
              key: 'actions',
              label: t('actions'),
              render: (r) => (
                <div className="row-actions">
                  <Button
                    variant="ghost"
                    onClick={() => action.run(async () => setPreview(await fileUrl(r.id)))}
                  >
                    {t('preview')}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      action.run(async () => {
                        await post('/files/' + r.id + '/avatar');
                        await reloadUser();
                      })
                    }
                  >
                    {t('useAsAvatar')}
                  </Button>
                  <Button variant="ghost" onClick={() => setTarget(r)}>
                    {t('delete')}
                  </Button>
                </div>
              ),
            },
          ]}
        />
      ) : (
        <EmptyState title={t('empty')} />
      )}
      <ImagePreview src={preview} alt="Image preview" onClose={() => setPreview('')} />
      <ConfirmDialog
        open={!!target}
        title={t('deleteFileTitle')}
        description={t('deleteFileDesc')}
        confirmLabel={t('confirm')}
        cancelLabel={t('cancel')}
        onClose={() => setTarget(null)}
        loading={action.busy}
        onConfirm={() =>
          action.run(async () => {
            await api('/files/' + target.id, { method: 'DELETE' });
            setTarget(null);
            await load();
          })
        }
      />
    </>
  );
}
const defaultSettings = {
  display_name: 'Fullstack Base',
  timezone: 'Asia/Ho_Chi_Minh',
  date_format: 'dd/MM/yyyy',
  company: {
    name: '',
    address: '',
    taxId: '',
    email: '',
    phone: '',
    representative: '',
    registration: '',
  },
  commerce: { status: 'unconfigured', verificationUrl: '' },
};
export function SettingsPage({ notify }: { notify: Notify }) {
  const { t } = useI18n(),
    [form, setForm] = useState<any>(null),
    action = useAction(notify),
    user = useAuth((s) => s.user);
  useEffect(() => {
    api('/settings')
      .then((data) => setForm({ ...defaultSettings, ...data }))
      .catch(() => action.setError(t('error')));
  }, []);
  return (
    <>
      <PageHeader title={t('settings')} />
      {action.error && <ErrorState message={action.error} />}{' '}
      {!form ? (
        <Skeleton />
      ) : (
        <form
          className="settings-sections"
          onSubmit={(e) => {
            e.preventDefault();
            action.run(async () => {
              await api('/settings', { method: 'PUT', body: JSON.stringify(form) });
              document.title = form.display_name;
            });
          }}
        >
          <section>
            <h2>{t('applicationSettings')}</h2>
            {['display_name', 'timezone'].map((key) => (
              <FormField key={key} label={key}>
                <Input
                  value={form[key]}
                  required
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </FormField>
            ))}
            <FormField label={t('dateFormat')}>
              <Select
                value={form.date_format}
                onChange={(e) => setForm({ ...form, date_format: e.target.value })}
              >
                {['dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd'].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </Select>
            </FormField>
          </section>
          <section>
            <h2>{t('ownerInformation')}</h2>
            <p className="muted">{t('ownerInfoHint')}</p>
            {Object.keys(form.company).map((key) => (
              <FormField key={key} label={key}>
                <Input
                  value={form.company[key]}
                  onChange={(e) =>
                    setForm({ ...form, company: { ...form.company, [key]: e.target.value } })
                  }
                />
              </FormField>
            ))}
          </section>
          <section>
            <h2>{t('moitHeading')}</h2>
            <FormField label={t('status')}>
              <Select
                value={form.commerce.status}
                onChange={(e) =>
                  setForm({ ...form, commerce: { ...form.commerce, status: e.target.value } })
                }
              >
                {['unconfigured', 'pending', 'approved'].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </Select>
            </FormField>
            <FormField label={t('verificationUrl')}>
              <Input
                type="url"
                value={form.commerce.verificationUrl}
                onChange={(e) =>
                  setForm({
                    ...form,
                    commerce: { ...form.commerce, verificationUrl: e.target.value },
                  })
                }
              />
            </FormField>
          </section>
          {user?.permissions.includes('settings.update') && (
            <Button loading={action.busy}>{t('save')}</Button>
          )}
        </form>
      )}
    </>
  );
}
export function LegalEditor({ notify }: { notify: Notify }) {
  const { t } = useI18n(),
    [rows, setRows] = useState<any[] | null>(null),
    [slug, setSlug] = useState('terms'),
    [form, setForm] = useState<any>(null),
    action = useAction(notify);
  useEffect(() => {
    api('/legal-pages')
      .then((data) => {
        setRows(data);
        setForm(data.find((p: any) => p.slug === 'terms'));
      })
      .catch(() => action.setError('Unable to load policies'));
  }, []);
  return (
    <>
      <PageHeader
        title={t('legal')}
        description={t('legalDraftsHint')}
      />
      {action.error && <ErrorState message={action.error} />}{' '}
      {!rows || !form ? (
        <Skeleton />
      ) : (
        <>
          <Tabs
            tabs={rows.map((r) => ({ id: r.slug, label: r.title }))}
            value={slug}
            onChange={(value) => {
              setSlug(value);
              setForm(rows.find((r) => r.slug === value));
            }}
          />
          <form
            className="legal-editor"
            onSubmit={(e) => {
              e.preventDefault();
              action.run(async () => {
                await api('/legal-pages/' + slug, {
                  method: 'PUT',
                  body: JSON.stringify({
                    title: form.title,
                    content: form.content,
                    version: form.version,
                    published: form.published,
                    effectiveAt: form.effectiveAt ? new Date(form.effectiveAt).toISOString() : null,
                  }),
                });
                setRows(rows.map((r) => (r.slug === slug ? form : r)));
              });
            }}
          >
            <FormField label={t('title')}>
              <Input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </FormField>
            <div className="form-grid">
              <FormField label={t('version')}>
                <Input
                  required
                  value={form.version}
                  onChange={(e) => setForm({ ...form, version: e.target.value })}
                />
              </FormField>
              <FormField label={t('effectiveDate')}>
                <Input
                  type="date"
                  value={form.effectiveAt?.slice(0, 10) || ''}
                  onChange={(e) => setForm({ ...form, effectiveAt: e.target.value })}
                />
              </FormField>
            </div>
            <FormField label={t('content')}>
              <textarea
                className="input"
                rows={18}
                required
                minLength={20}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </FormField>
            <label className="check-line">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              {t('publishThisVersion')}
            </label>
            <Button loading={action.busy}>{t('savePolicy')}</Button>
          </form>
        </>
      )}
    </>
  );
}
export function SystemPage() {
  const { t } = useI18n(),
    [data, setData] = useState<any>(null),
    [error, setError] = useState('');
  useEffect(() => {
    Promise.all([api('/system/health'), api('/system/config')])
      .then(([health, config]) => setData({ health, config }))
      .catch(() => setError('System probe failed. Check API logs.'));
  }, []);
  return (
    <>
      <PageHeader title={t('system')} />
      {error ? (
        <ErrorState message={error} />
      ) : !data ? (
        <Skeleton />
      ) : (
        <>
          <dl className="system-list">
            {Object.entries(data.health).map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{String(value)}</dd>
              </div>
            ))}
          </dl>
          <h2>{t('system')}</h2>
          <dl className="system-list">
            {Object.entries(data.config.modules).map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{value ? t('enabled') : t('notEnabled')}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </>
  );
}
