"use client";

import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { LanguageContext } from "@/providers/language-provider";
import { useTheme } from "next-themes";
import { Message, useChat } from "ai/react";
import { UIInterface } from "@/types/types";
import { AuroraBackground } from "@/components/ui/aurora-background";
import MessageList from "@/components/MessageList";
import EmptyState from "@/components/EmptyState";
import InputForm, { InputFormRef } from "@/components/InputForm";
import TypewriterTitle from "@/components/ui/typewritertitle";

export default function HomePageContent() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(true);
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { language, setLanguage, translations, loadTranslations } =
    useContext(LanguageContext);
  const {
    messages,
    setMessages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    stop,
  } = useChat({
    api: "/api/chat",
    sendExtraMessageFields: true,
    onResponse: () => {
      setIsLoading(false);
    },
    onFinish: () => {
      setIsFinished(true);
    },
  });

  const inputFormRef = useRef<InputFormRef>(null);

  const [pendingSubmit, setPendingSubmit] = useState(false);

  const [ui, setUI] = useState<UIInterface>({
    theme: theme === "dark" ? "dark" : "light",
    language: language,
    url: "",
  });

  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const lastUserMessageId = useRef<string | null>(null);
  const typewriterRef = useRef<HTMLDivElement>(null);
  const [showTypewriter, setShowTypewriter] = useState(true);

  useEffect(() => {
    setUI((prev) => ({
      ...prev,
      theme: theme === "dark" ? "dark" : "light",
    }));
  }, [theme]);

  useEffect(() => {
    setUI((prev) => ({ ...prev, language }));
    loadTranslations(language);
  }, [language]);

  useEffect(() => {
    if (pendingSubmit && input) {
      inputFormRef.current?.submitForm();
      setPendingSubmit(false);
    }
  }, [input, pendingSubmit]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setHasUserScrolled(true);
    };

    container.addEventListener("wheel", handleScroll);
    return () => container.removeEventListener("wheel", handleScroll);
  }, []);

  // Hide TypewriterTitle when PromptCarousel scrolls within 5dvh of it
  useEffect(() => {
    const container = containerRef.current;
    const typewriterEl = typewriterRef.current;
    if (!container || !typewriterEl) return;

    const checkOverlap = () => {
      const carousel = container.querySelector(".prompt-carousel");
      if (!carousel) {
        setShowTypewriter(true);
        return;
      }

      const carouselRect = carousel.getBoundingClientRect();
      const typewriterRect = typewriterEl.getBoundingClientRect();
      const threshold = window.innerHeight * 0.05; // 5dvh

      // If the bottom of the carousel is within 5dvh of the top of the TypewriterTitle
      if (carouselRect.bottom > typewriterRect.top - threshold) {
        setShowTypewriter(false);
      } else {
        setShowTypewriter(true);
      }
    };

    container.addEventListener("scroll", checkOverlap);
    // Also check on resize and after renders
    window.addEventListener("resize", checkOverlap);
    checkOverlap();

    return () => {
      container.removeEventListener("scroll", checkOverlap);
      window.removeEventListener("resize", checkOverlap);
    };
  }, [messages]);

  useEffect(() => {
    const handleImagesLoaded = () => {
      // Vérifier si le dernier message contient un PhotoGrid
      const lastMessage = messages[messages.length - 1];
      const hasPhotoGrid = lastMessage?.parts?.some(
        (part) =>
          part.type === "tool-invocation" &&
          part.toolInvocation.toolName === "getPhotos",
      );

      if (
        messages.length > 1 &&
        messages[messages.length - 1].role === "user" &&
        !hasUserScrolled &&
        hasPhotoGrid
      ) {
        scrollToLastUserMessage(messages[messages.length - 1]);
      }
    };

    window.addEventListener("imagesLoaded", handleImagesLoaded);
    return () => window.removeEventListener("imagesLoaded", handleImagesLoaded);
  }, [messages, hasUserScrolled]);

  // Scroll vers le dernier message user et maintenir la position
  useEffect(() => {
    if (messages.length <= 0 || hasUserScrolled) return;

    const lastMessage = messages[messages.length - 1];

    // Quand un nouveau message user arrive, sauvegarder son ID et smooth scroll
    if (lastMessage.role === "user") {
      lastUserMessageId.current = lastMessage.id;
      scrollToLastUserMessage(lastMessage, true);
      return;
    }

    // Pendant et après le streaming, maintenir la position avec instant scroll
    if (lastUserMessageId.current) {
      const userMsg = messages.find((m) => m.id === lastUserMessageId.current);
      if (userMsg) {
        scrollToLastUserMessage(userMsg, false);
      }
    }
  }, [messages, hasUserScrolled]);

  const handleSubmitPrePrompt = async (content: string) => {
    setInput(content);
    setIsLoading(true);
    setIsFinished(false);
    setPendingSubmit(true);
    setHasUserScrolled(false);
  };

  const handleSubmitMain = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsFinished(false);
    setHasUserScrolled(false);
    handleSubmit(e);
  };

  const scrollToLastUserMessage = useCallback(
    (message: Message, smooth = true) => {
      const doScroll = () => {
        const messageElement = messageRefs.current[message.id];
        const container = containerRef.current;
        if (messageElement && container) {
          const containerRect = container.getBoundingClientRect();
          const messageRect = messageElement.getBoundingClientRect();
          const scrollTop =
            container.scrollTop + (messageRect.top - containerRect.top);
          container.scrollTo({
            top: scrollTop,
            behavior: smooth ? "smooth" : "instant",
          });
        }
      };

      // Double rAF to ensure DOM layout is fully computed (including heavy components)
      requestAnimationFrame(() => {
        requestAnimationFrame(doScroll);
      });
    },
    [],
  );

  return (
    <AuroraBackground>
      <div className="container flex flex-col h-[100dvh] p-2 md:px-8 w-full gap-2">
        <main className="flex-1 w-full glass-gradient-border overflow-hidden p-2 text-white bg-white/5 dark:bg-black/5 backdrop-blur-2xl">
          <div className="absolute inset-0 bg-[url('/textures/noise.svg')] opacity-10 pointer-events-none" />
          <div className="rounded-2xl overflow-hidden h-full mask">
            {messages.length === 0 ? (
              <EmptyState
                handleSubmitPrePrompt={handleSubmitPrePrompt}
                translations={translations}
                ui={ui}
              />
            ) : (
              <MessageList
                messages={messages}
                isLoading={isLoading}
                handleSubmitPrePrompt={handleSubmitPrePrompt}
                translations={translations}
                isFinished={isFinished}
                containerRef={containerRef}
                messageRefs={messageRefs}
              />
            )}
          </div>
          {messages.length > 0 && (
            <div
              ref={typewriterRef}
              className={`absolute bottom-6 left-6 z-10 font-doto text-gray-700 dark:text-white transition-opacity duration-300 ${showTypewriter && isFinished ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <TypewriterTitle translations={translations} />
            </div>
          )}
        </main>

        <div className="w-full">
          <InputForm
            ref={inputFormRef}
            input={input}
            setInput={handleInputChange}
            handleSubmit={handleSubmitMain}
            isLoading={isLoading}
            isFinished={isFinished}
            translations={translations}
          />
        </div>
      </div>
    </AuroraBackground>
  );
}
