"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import Link from "next/link"
interface InputFormProps {
    input: string;
    setInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    translations: any;
}

const InputForm: React.FC<InputFormProps> = ({
    input,
    setInput,
    handleSubmit,
    isLoading,
    translations,
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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
                handleSubmit(e as unknown as React.FormEvent);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e);
    };

    return (
        <div className="group max-h-[20vh] relative flex w-full items-end">
            <div className="flex w-full flex-col transition-colors contain-inline-size cursor-text rounded-3xl px-2 py-1 bg-blue-700/5 dark:bg-white/5 backdrop-blur-md">

                    <form onSubmit={onSubmit} className="flex min-h-[44px] items-end px-2">
                        <div className="max-w-full flex-1">
                            <Textarea
                                ref={textareaRef}
                                value={input}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder={translations.placeholder}
                                className="placeholder:font-bold placeholder:font-doto block font-light focus:ring-offset-transparent min-h-[44px] w-full resize-none rounded-none border-0 bg-transparent px-0 py-2 text-gray-700 dark:text-gray-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
                                disabled={isLoading}
                            />
                        </div>
                    </form>
                
                <div className="flex h-[44px] items-center justify-end">
                    <Button
                        size="icon"
                        onClick={onSubmit}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:opacity-70 dark:bg-white dark:text-black disabled:bg-[#b4b7eb] disabled:text-[#f4f4f4] dark:disabled:bg-zinc-600 dark:disabled:text-zinc-400"
                        aria-label="Send message"
                        disabled={!input.trim() || isLoading}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
                <Link href="https://github.com/RolandVrignon" target="_blank" className="font-doto text-xs w-full text-gray-400 text-center">
                    {translations.footer}
                </Link>
            </div>
        </div>
    );
};

export default InputForm;