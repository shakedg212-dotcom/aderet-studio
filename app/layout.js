import "./globals.css";

export const metadata = {
  title: "אדרת | קדושה בסטייל",
  description:
    "אדרת - טליתות מעוצבות בהתאמה אישית ברמת גימור גבוהה. בחרו דגם, הוסיפו שם או פסוק, וקבלו טלית בוטיק מהודרת עד הבית.",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/images/favicon.svg",
    shortcut: "/images/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "אדרת - קדושה בסטייל",
    title: "אדרת | קדושה בסטייל",
    description: "טליתות מעוצבות בהתאמה אישית, ברמת גימור שטרם הכרתם.",
    images: ["/images/social-preview.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "אדרת | קדושה בסטייל",
    description: "טליתות מעוצבות בהתאמה אישית, ברמת גימור שטרם הכרתם.",
    images: ["/images/social-preview.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <meta name="theme-color" content="#1A1A1A" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@300;400;500;700;900&family=Heebo:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
