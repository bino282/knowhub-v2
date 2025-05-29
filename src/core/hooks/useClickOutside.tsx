import { RefObject, useEffect } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useClickOutSide<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: () => void,
  excludeSelector?: string
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (
        ref.current &&
        !ref.current.contains(target as Node) &&
        (!excludeSelector || !target?.closest(excludeSelector))
      ) {
        handler();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler]);
}
