import type {Metadata, Viewport} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import {Toaster} from '@/components/ui/sonner';
import {ThemeProvider} from '@/components/theme-provider';
import {headers} from 'next/headers';
import {I18nProvider, type Locale} from '@/lib/i18n';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const APP_NAME = "Lonadels";
const APP_DEFAULT_TITLE = "Lonadels";
const APP_TITLE_TEMPLATE = "%s - Lonadels";
const APP_DESCRIPTION = "Сайт Lonadels";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const h = headers();
    const accept = h.get('accept-language')?.toLowerCase() || '';
    const initialLocale: Locale = accept.startsWith('en') ? 'en' : 'ru';
    return (
        <html lang={initialLocale} dir="ltr" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <I18nProvider initialLocale={initialLocale}>
                {children}
                <Toaster/>
            </I18nProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
