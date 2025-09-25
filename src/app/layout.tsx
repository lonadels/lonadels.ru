import type {Metadata, Viewport} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import {Toaster} from '@/components/ui/sonner';
import {ThemeProvider} from '@/components/theme-provider';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import LanguageSelect from '@/components/language-select';
import {ToggleColorMode} from '@/components/toggle-color-mode';
import {ThemeColorMeta} from '@/components/theme-color-meta';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const APP_NAME = 'Lonadels';
const APP_DEFAULT_TITLE = 'Lonadels';
const APP_TITLE_TEMPLATE = '%s - Lonadels';
const APP_DESCRIPTION = 'Сайт Lonadels';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default async function RootLayout({
                                           children,
                                         }: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  return (
    <html dir="ltr" suppressHydrationWarning>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextIntlClientProvider messages={messages}>
        <ThemeColorMeta />
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <LanguageSelect/>
          <ToggleColorMode/>
        </div>
        {children}
        <Toaster/>
      </NextIntlClientProvider>
    </ThemeProvider>
    </body>
    </html>
  );
}
