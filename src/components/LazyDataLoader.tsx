import React, { Suspense, lazy, useState, useEffect } from 'react';

interface LazyDataLoaderProps<T> {
  loader: () => Promise<T>;
  fallback?: React.ReactNode;
  children: (data: T) => React.ReactNode;
  cacheKey?: string;
  preload?: boolean;
}

/**
 * Component for lazy loading large datasets
 * Reduces initial bundle size by loading data on demand
 */
export function LazyDataLoader<T>({
  loader,
  fallback = <div>Loading...</div>,
  children,
  cacheKey,
  preload = false
}: LazyDataLoaderProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Check cache first
  useEffect(() => {
    if (cacheKey) {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          setData(JSON.parse(cached));
          return;
        } catch (e) {
          // Invalid cache, continue with loading
        }
      }
    }

    if (preload) {
      loadData();
    }
  }, [cacheKey, preload]);

  const loadData = async () => {
    if (data || loading) return;

    setLoading(true);
    setError(null);

    try {
      const result = await loader();
      setData(result);
      
      // Cache the result
      if (cacheKey) {
        sessionStorage.setItem(cacheKey, JSON.stringify(result));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load data'));
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-red-500">
        Error loading data: {error.message}
        <button 
          onClick={loadData}
          className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data && !loading) {
    return (
      <button 
        onClick={loadData}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Load Data
      </button>
    );
  }

  if (loading) {
    return <>{fallback}</>;
  }

  return <>{children(data!)}</>;
}

/**
 * Lazy load a component with data
 */
export function LazyComponentWithData<T>({
  component: Component,
  loader,
  fallback,
  cacheKey,
  ...props
}: {
  component: React.ComponentType<{ data: T } & any>;
  loader: () => Promise<T>;
  fallback?: React.ReactNode;
  cacheKey?: string;
  [key: string]: any;
}) {
  return (
    <LazyDataLoader
      loader={loader}
      fallback={fallback}
      cacheKey={cacheKey}
    >
      {(data) => <Component data={data} {...props} />}
    </LazyDataLoader>
  );
}

/**
 * Preload data for better UX
 */
export function usePreloadData<T>(
  loader: () => Promise<T>,
  cacheKey?: string
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check cache first
    if (cacheKey) {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          setData(JSON.parse(cached));
          return;
        } catch (e) {
          // Invalid cache, continue with loading
        }
      }
    }

    // Preload data
    setLoading(true);
    loader()
      .then(result => {
        setData(result);
        if (cacheKey) {
          sessionStorage.setItem(cacheKey, JSON.stringify(result));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [loader, cacheKey]);

  return { data, loading };
}

/**
 * Hook for lazy loading with intersection observer
 * Loads data when component comes into view
 */
export function useLazyLoadOnVisible<T>(
  loader: () => Promise<T>,
  cacheKey?: string
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    // Check cache first
    if (cacheKey) {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          setData(JSON.parse(cached));
          return;
        } catch (e) {
          // Invalid cache, continue with loading
        }
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !data && !loading) {
            setLoading(true);
            loader()
              .then(result => {
                setData(result);
                if (cacheKey) {
                  sessionStorage.setItem(cacheKey, JSON.stringify(result));
                }
              })
              .catch(console.error)
              .finally(() => setLoading(false));
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, loader, cacheKey, data, loading]);

  return { data, loading, ref: setRef };
}

/**
 * Example usage:
 * 
 * // Lazy load Pokemon data
 * <LazyDataLoader
 *   loader={() => import('../data/speciesData.json')}
 *   cacheKey="pokemon-data"
 *   fallback={<PokemonListSkeleton />}
 * >
 *   {(data) => <PokemonList pokemon={data} />}
 * </LazyDataLoader>
 * 
 * // Lazy load component with data
 * <LazyComponentWithData
 *   component={PokemonModal}
 *   loader={() => import('../data/speciesData.json')}
 *   cacheKey="pokemon-data"
 *   pokemonId={selectedId}
 * />
 */