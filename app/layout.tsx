// app/layout.tsx
import { ReactNode } from 'react';

/**
 * Ce layout est le "Root Layout" parent. 
 * Next.js en a besoin pour stabiliser l'arborescence.
 * On se contente de retourner les enfants car le layout de [lang] 
 * s'occupe déjà de définir <html> et <body>.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
    return children;
}