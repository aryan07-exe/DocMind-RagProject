import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Typewriter({ text, onComplete, animate = true, scrollToBottom }) {
    const [displayedText, setDisplayedText] = useState(animate ? "" : text);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!animate) {
            setDisplayedText(text);
            return;
        }

        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text.charAt(index));
                setIndex((prev) => prev + 1);
                if (scrollToBottom) scrollToBottom(true);
            }, 5); // Faster typing speed
            return () => clearTimeout(timeout);
        } else {
            if (onComplete) onComplete();
        }
    }, [index, text, animate, onComplete, scrollToBottom]);

    return (
        <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900/50 prose-pre:border prose-pre:border-slate-700 max-w-none text-slate-200">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {displayedText}
            </ReactMarkdown>
        </div>
    );
}
