'use client';

import React from 'react';
import {createRoot, Root} from 'react-dom/client';
import {NextIntlClientProvider, useLocale, useMessages} from 'next-intl';
import {Locale} from '@/i18n/locales';

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
  const destroyed = false;

  // Will be provided by the surrounding app via Viewport hooks
  let currentMessages: Record<string, unknown> | null = null;
  let currentLocale: Locale | null = null;

  const hasIntl = () => Boolean(currentMessages && currentLocale);

  const ensureMount = () => {
    if (destroyed) return;
    if (root) return;
    // Only mount when i18n context is ready to avoid rendering null into a root
    if (!hasIntl()) return;
    container = document.createElement('div');
    container.setAttribute('data-overlay-root', '');
    document.body.appendChild(container);
    root = createRoot(container);
    rerender();
  };

  const rerender = () => {
    if (destroyed || !root) return;
    const content = React.createElement(Component, {
      ...(props as P),
      open: isOpen,
      onOpenChange: (next: boolean) => {
        isOpen = next;
        rerender();
      },
    });

    type IntlProviderProps = { locale?: string; messages: Record<string, unknown>; children?: React.ReactNode };
    const IntlProvider = NextIntlClientProvider as unknown as React.ComponentType<IntlProviderProps>;

    if (!hasIntl()) return; // Do not render null to avoid React deletions on a detached container

    const node = React.createElement(
      IntlProvider,
      { locale: currentLocale as string, messages: currentMessages as Record<string, unknown> },
      content
    );

    root.render(node);
  };

  const destroyInternal = () => {
    // Instead of tearing down the container/root (which can race with React's deletion phase),
    // just clear the content and keep the container for reuse across route transitions.
    isOpen = false;

    const doClear = () => {
      try {
        if (root) {
          // Render an empty tree to allow React to commit deletions safely within the container.
          root.render(React.createElement(React.Fragment));
        }
      } catch {
      }
      // Do NOT remove the container or null out the root; keep them for subsequent mounts.
    };

    if (typeof window !== 'undefined') {
      setTimeout(doClear, 0);
    } else {
      doClear();
    }
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
    const messages = useMessages();
    const locale = useLocale() as Locale;

    React.useEffect(() => {
      currentMessages = messages as unknown as Record<string, unknown>;
      currentLocale = locale;
      ensureMount();
      rerender();
      return () => {
        destroyInternal();
      };
    }, [messages, locale]);
    return null;
  };

  return Object.assign(api, {Viewport});
}
