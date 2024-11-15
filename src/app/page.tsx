// src/app/page.tsx
import { headers } from 'next/headers';
import { LanguageProvider, Language } from '@/providers/language-provider';
import HomePageContent from '@/components/HomePageContent';
import { AI } from './ai';

export default async function HomePage() {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || 'en';

    // Liste des langues possibles
    const availableLanguages: Language[] = ['en', 'fr', 'es', 'nl'];

    // Trouve la langue qui correspond
    const language = availableLanguages.find(lang => acceptLanguage.split(',')[0].startsWith(lang)) || 'en';

    return (
        <LanguageProvider initLanguage={language}>
            <AI>
                <HomePageContent />
            </AI>
        </LanguageProvider>
    );
}

