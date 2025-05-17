import { Inter, Hind_Siliguri } from "next/font/google";
import "../globals.css";
import { TranslationsProvider } from "@/context/TranslationsContext";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });
const hindSiliguri = Hind_Siliguri({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['bengali'],
    display: 'swap',
    variable: '--font-hind-siliguri',
});

export const metadata = {
    title: "Hamba Village Union",
    description: "Manage village union deposits and cow purchases",
};

type LayoutParams = {
    locale: string;
};

export default function RootLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: LayoutParams;
}) {
    const locale = params.locale || 'en';

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${inter.className} ${hindSiliguri.variable}`} suppressHydrationWarning>
                <TranslationsProvider initialLocale={locale}>
                    <main className={`min-h-screen bg-gray-50 ${locale === 'bn' ? 'font-hind-siliguri' : ''}`}>
                        {children}
                    </main>
                </TranslationsProvider>
            </body>
        </html>
    );
} 