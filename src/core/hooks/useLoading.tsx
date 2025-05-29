import { useState } from 'react';

export function useLoading(initial: boolean = false) {
  const [loading, setLoading] = useState<boolean>(initial);

  const toggleLoading = () => setLoading((state) => !state);

  return { loading, toggleLoading, setLoading };
}
