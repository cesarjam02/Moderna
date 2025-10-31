import { useEffect, useState, useCallback } from 'preact/hooks';

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fn();
      setData(res);
      setError(null);
      return res;
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fn();
        if (mounted) {
          setData(res);
          setError(null);
        }
      } catch (e) {
        if (mounted) setError(e as Error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, deps);

  return { data, loading, error, refetch, setData };
}
