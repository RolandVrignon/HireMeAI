"use client"

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import Link from "next/link"

interface InputFormProps {
    input: string;
    setInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    isFinished: boolean;
    translations: any;
}

export interface InputFormRef {
    submitForm: () => void;
}

const InputForm = forwardRef<InputFormRef, InputFormProps>(({
    input,
    setInput,
    handleSubmit,
    isLoading,
    isFinished,
    translations,
}, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    useImperativeHandle(ref, () => ({
        submitForm: () => {
            formRef.current?.requestSubmit();
        }
    }));

    const submitMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            handleSubmit(e);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitMessage(e as unknown as React.FormEvent);
        }
    };

    return (
        <div className="group max-h-[30vh] relative flex w-full items-end">
            <div className="flex w-full flex-col transition-colors contain-inline-size cursor-text rounded-3xl px-2 py-1 bg-white/5 dark:bg-black/5 glass-gradient-border overflow-hidden backdrop-blur-2xl">
                <div className="absolute inset-0 bg-[url('/textures/noise.svg')] opacity-10 pointer-events-none" />            
                <form ref={formRef} onSubmit={submitMessage} className="flex min-h-[44px] items-end px-2">
                    <div className="max-w-full flex-1">
                        <Textarea
                            ref={textareaRef}
                            value={input}
                            onChange={setInput}
                            onKeyDown={handleKeyDown}
                            placeholder={translations.placeholder}
                            className="placeholder:font-bold placeholder:font-doto block font-light focus:ring-offset-transparent min-h-[44px] w-full resize-none rounded-none border-0 bg-transparent px-0 py-2 text-gray-700 dark:text-gray-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
                            disabled={(isLoading || !isFinished)}
                        />
                    </div>
                    <div className="flex h-[44px] items-center justify-end">
                        <Button
                            type="submit"
                            size="icon"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2457ff] text-white hover:opacity-70 dark:bg-white dark:text-black disabled:bg-[#a7a7a7] disabled:text-[#f4f4f4] dark:disabled:bg-zinc-600 dark:disabled:text-zinc-400"
                            aria-label="Send message"
                            disabled={!input.trim() || (isLoading || !isFinished)}
                        >
                        </Button>
                    </div>
                </form>
                <Link href="https://github.com/RolandVrignon" target="_blank" className="font-doto text-xs w-full text-gray-400 text-center">
                    {translations.footer}
                </Link>
            </div>
        </div>
    );
});

InputForm.displayName = 'InputForm';
export default InputForm;