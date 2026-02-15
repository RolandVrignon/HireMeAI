import { LanguageProvider } from "@/providers/language-provider";
import HomePageContent from "@/components/HomePageContent";

export default async function Home() {
  return (
    <LanguageProvider initLanguage="en">
      <HomePageContent />
    </LanguageProvider>
  );
}
