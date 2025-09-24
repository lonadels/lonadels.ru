'use client';

import React from 'react';
import {createRoot, Root} from 'react-dom/client';

export type OverlayComponent<P> = React.ComponentType<
  P & { open: boolean; onOpenChange: (open: boolean) => void }
>;

export type OverlayInstance<P> = {
  open: () => void;
  close: () => void;
  destroy: () => void;
  update: (next: Partial<P>) => void;
};

export type OverlayController<P> = OverlayInstance<P> & {
  Viewport: React.FC;
};

// Overlay factory with a ViewPort component to control mount/unmount lifecycle.
export function createOverlay<P>(Component: OverlayComponent<P>, initialProps: P): OverlayController<P> {
  let container: HTMLDivElement | null = null;
  let root: Root | null = null;

  let isOpen = false;
  let props = initialProps;
  let destroyed = false;

  const ensureMount = () => {
    if (destroyed) return;
    if (root) return;
    container = document.createElement('div');
    container.setAttribute('data-overlay-root', '');
    document.body.appendChild(container);
    root = createRoot(container);
    rerender();
  };

  const rerender = () => {
    if (destroyed || !root) return;
    root.render(
      React.createElement(Component, {
        ...(props as P),
        open: isOpen,
        onOpenChange: (next: boolean) => {
          isOpen = next;
          rerender();
        },
      }),
    );
  };

  const destroyInternal = () => {
    if (destroyed) return;
    destroyed = true;
    try {
      root?.unmount();
    } catch {
    }
    if (container?.parentNode) container.parentNode.removeChild(container);
    root = null;
    container = null;
  };

  const api: OverlayInstance<P> = {
    open: () => {
      ensureMount();
      isOpen = true;
      rerender();
    },
    close: () => {
      ensureMount();
      isOpen = false;
      rerender();
    },
    destroy: () => {
      destroyInternal();
    },
    update: (next) => {
      props = {...props, ...(next as P)};
      if (root) rerender();
    },
  };

  const Viewport: React.FC = () => {
    React.useEffect(() => {
      ensureMount();
      return () => {
        destroyInternal();
      };
    }, []);
    return null;
  };

  return Object.assign(api, {Viewport});
}
