"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Square } from "lucide-react"

interface InputFormProps {
    input: string;
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    stop: () => void;
}

const InputForm: React.FC<InputFormProps> = ({
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [scrollbarWidth, setScrollbarWidth] = useState(0);

    useEffect(() => {
        // Calculer la largeur de la scrollbar
        const hasScrollbar = document.documentElement.scrollHeight > document.documentElement.clientHeight;
        if (hasScrollbar) {
            const width = window.innerWidth - document.documentElement.clientWidth;
            setScrollbarWidth(width);
        } else {
            setScrollbarWidth(0);
        }

        // Observer les changements de taille
        const resizeObserver = new ResizeObserver(() => {
            const hasScrollbar = document.documentElement.scrollHeight > document.documentElement.clientHeight;
            if (hasScrollbar) {
                const width = window.innerWidth - document.documentElement.clientWidth;
                setScrollbarWidth(width);
            } else {
                setScrollbarWidth(0);
            }
        });

        resizeObserver.observe(document.body);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            handleSubmit(e);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.trim()) {
                handleSubmit(e as any);
            }
        }
    };

    return (
        <div className="group relative flex w-full items-end" style={{ paddingRight: `${scrollbarWidth}px` }}>
            <div className="flex w-full flex-col transition-colors contain-inline-size cursor-text rounded-3xl px-2.5 py-1 bg-black/15 dark:bg-white/5 backdrop-blur-md">
                {!isLoading && (
                    <form onSubmit={onSubmit} className="flex min-h-[44px] items-end px-2">
                        <div className="max-w-full flex-1">
                            <div className="max-h-[25dvh] overflow-auto">
                                <Textarea
                                    ref={textareaRef}
                                    value={input}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Message Roland AI"
                                    className="block min-h-[44px] w-full resize-none rounded-none border-0 bg-transparent px-0 py-2 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:ring-0 focus:outline-none"
                                    style={{ overflow: "hidden" }}
                                />
                            </div>
                        </div>
                    </form>
                )}

                <div className="flex h-[44px] items-center justify-end">
                    {isLoading ? (
                        <Button
                            size="icon"
                            onClick={stop}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white hover:opacity-70 dark:bg-white dark:text-black"
                            aria-label="Stop generating"
                        >
                            <Square className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            size="icon"
                            onClick={onSubmit}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white hover:opacity-70 dark:bg-white dark:text-black disabled:bg-[#534e4e] disabled:text-[#f4f4f4] dark:disabled:bg-zinc-600 dark:disabled:text-zinc-400"
                            aria-label="Send message"
                            disabled={!input.trim()}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InputForm;