import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default function MarkdownRenderer({ content }) {
    return(
        <div className="prose max-w-none">
            <ReactMarkdown 
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={
                    {
                        code({ inline, children }) {
                            return inline ? (
                                <code className="bg-base-300 px-1 rounded">
                                    {children}
                                </code>
                            ) : (
                                <pre className="bg-base-300 p-4 rounded-lg overflow-x-auto">
                                    <code>
                                        {children}
                                    </code>
                                </pre>
                            )
                        }
                    }
                }
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}