'use client';

import React from 'react';
import {createRoot, Root} from 'react-dom/client';
import {NextIntlClientProvider, useLocale, useMessages} from 'next-intl';

type Locale = 'ru' | 'en';

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

// Helper: detect initial locale from <html lang> or navigator
function getInitialLocale(): Locale {
  let lang = 'ru';
  if (typeof document !== 'undefined') {
    const htmlLang = document.documentElement.lang?.toLowerCase();
    if (htmlLang?.startsWith('en')) lang = 'en';
    if (htmlLang?.startsWith('ru')) lang = 'ru';
  }
  if (typeof navigator !== 'undefined') {
    const nav = navigator.language?.toLowerCase();
    if (nav?.startsWith('en')) lang = 'en';
    if (nav?.startsWith('ru')) lang = 'ru';
  }
  return lang as Locale;
}

// Overlay factory with a ViewPort component to control mount/unmount lifecycle.
export function createOverlay<P>(Component: OverlayComponent<P>, initialProps: P): OverlayController<P> {
  let container: HTMLDivElement | null = null;
  let root: Root | null = null;

  let isOpen = false;
  let props = initialProps;
  let destroyed = false;

  // Will be provided by the surrounding app via Viewport hooks
  let currentMessages: Record<string, unknown> | null = null;
  let currentLocale: Locale = getInitialLocale();

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

    const node = currentMessages
      ? React.createElement(
          IntlProvider,
          { locale: currentLocale, messages: currentMessages as Record<string, unknown> },
          content
        )
      : null;

    root.render(node);
  };

  const destroyInternal = () => {
    if (destroyed) return;
    destroyed = true;

    const doUnmount = () => {
      try {
        root?.unmount();
      } catch {
      }
      if (container?.parentNode) container.parentNode.removeChild(container);
      root = null;
      container = null;
    };

    if (typeof window !== 'undefined') {
      setTimeout(doUnmount, 0);
    } else {
      doUnmount();
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
