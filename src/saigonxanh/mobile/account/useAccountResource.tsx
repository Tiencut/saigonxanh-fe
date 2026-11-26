import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../api';

export function useAccountResource<T>(path: string) {
  const [data, setData] = useState<T | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState('');
  const [version, setVersion] = useState(0);
  const reload = useCallback(() => setVersion((value) => value + 1), []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setData(null);
    api<T>(path)
      .then((value) => {
        if (active) setData(value);
      })
      .catch(() => {
        if (active) setError('Không tải được dữ liệu. Vui lòng thử lại.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [path, version]);
  return { data, loading, error, reload };
}

export function AccountLoadState({
  loading,
  error,
  reload,
}: {
  loading: boolean;
  error: string;
  reload: () => void;
}) {
  return (
    <>
      {loading && (
        <p role="status" className="account-center-state">
          Đang tải…
        </p>
      )}
      {error && (
        <div role="alert" className="account-center-error">
          {error}{' '}
          <button type="button" onClick={reload}>
            Thử lại
          </button>
        </div>
      )}
    </>
  );
}
