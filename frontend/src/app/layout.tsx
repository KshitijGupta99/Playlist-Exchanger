// src/app/layout.tsx
"use-client";
import SessionProviderWrapper from "@/app/SessionProviderWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <SessionProviderWrapper>{children}</SessionProviderWrapper>
            </body>
        </html>
    );
}
