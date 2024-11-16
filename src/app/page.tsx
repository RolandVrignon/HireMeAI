import { headers } from 'next/headers';
import { LanguageProvider } from '@/providers/language-provider';
import HomePageContent from '@/components/HomePageContent';
import { AI } from './ai';
import { Languages, Language } from "@/types/types";

const availableLanguages: Language[] = Object.keys(Languages) as Language[];

export default async function HomePage() {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || 'en';

    // Trouver la langue dans `availableLanguages`
    const language = availableLanguages.find(lang => acceptLanguage.split(',')[0].startsWith(lang)) || 'en';

    return (
        <LanguageProvider initLanguage={language}>
            <AI>
                <HomePageContent />
            </AI>
        </LanguageProvider>
    );
}