import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Gbade Gesin | Senior Data Analyst & BI Engineer Portfolio",
    template: "%s | Gbade Gesin"
  },
  description: "Explore the Senior Data Analyst portfolio of Gbade Gesin, based in Lagos, Nigeria. Specializing in SQL performance optimization, predictive machine learning models, ETL pipelines, and interactive BI dashboards.",
  keywords: ["Data Analyst", "BI Engineer", "Business Intelligence", "SQL Performance", "BigQuery", "Python", "Tableau", "Power BI", "Cohort Analysis", "Machine Learning Portfolio"],
  authors: [{ name: "Gbade Gesin", url: "https://gbadegesin.com" }],
  creator: "Gbade Gesin",
  publisher: "Gbade Gesin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gbadegesin.com",
    title: "Gbade Gesin | Senior Data Analyst & BI Engineer Portfolio",
    description: "Senior Data Analyst portfolio showcasing SQL optimization, customer segment cohorts, ETL, and interactive dashboard mockups.",
    siteName: "Gbade Gesin Portfolio",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "Gbade Gesin Portfolio Preview",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gbade Gesin | Senior Data Analyst & BI Engineer",
    description: "Interactive data analytics cases, SQL benchmarks, and predictive metrics visualizations.",
    creator: "@gbadegesin",
    images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200"],
  },
  alternates: {
    canonical: "https://gbadegesin.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
