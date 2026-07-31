'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useState, useRef, useEffect } from 'react';
import ChatMessage from '../ui/ChatMessage';
import LoadingDots from '../ui/LoadingDots';

interface FormInput {
  video_url: string;
  query: string;
}

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function UserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    resetField,
  } = useForm<FormInput>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryInputRef = useRef<HTMLInputElement | null>(null);

  const videoUrl = watch('video_url', '');
  const currentVideoId = extractVideoId(videoUrl);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    const videoId = extractVideoId(data.video_url);

    if (!videoId) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setError(null);
    setActiveVideoId(videoId);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: data.query,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    resetField('query');

    try {
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video_id: videoId,
          query: data.query,
        }),
      });

      const result = await response.json();

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        content:
          result.status === 'success'
            ? result.response
            : result.message || 'Something went wrong. Please try again.',
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        content: 'Could not connect to the server. Make sure the backend is running.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      queryInputRef.current?.focus();
    }
  };

  const { ref: queryRegRef, ...queryRegRest } = register('query', { required: true });

  return (
    <>
      {/* URL Input Section */}
      <div className="mb-5">
        <div className="relative flex items-center gap-3">
          <div className="pointer-events-none absolute left-4 flex items-center text-[#5a5a6a] transition-colors duration-200 peer-focus:text-[#ff0033]">
            <svg
              className="h-[18px] w-[18px] fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
            </svg>
          </div>
          <input
            type="text"
            {...register('video_url', { required: true })}
            placeholder="Paste a YouTube URL — e.g. https://youtube.com/watch?v=..."
            className="peer w-full rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.05)] py-3.5 pr-4 pl-12 text-sm text-[#f0f0f5] outline-none transition-all duration-200 placeholder:text-[#5a5a6a] focus:border-[#ff0033]/50 focus:bg-[rgba(255,255,255,0.08)] focus:shadow-[0_0_20px_rgba(255,0,51,0.2)]"
            id="video-url-input"
            autoComplete="off"
          />
        </div>
        {errors.video_url && (
          <div
            className="mt-2 flex items-center gap-1.5 rounded border border-[#ff4757]/20 bg-[#ff4757]/8 px-3 py-2 text-xs font-medium text-[#ff4757]"
            id="url-error"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            YouTube URL is required
          </div>
        )}
        {error && (
          <div
            className="mt-2 flex items-center gap-1.5 rounded border border-[#ff4757]/20 bg-[#ff4757]/8 px-3 py-2 text-xs font-medium text-[#ff4757]"
            id="general-error"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            {error}
          </div>
        )}

        {/* Thumbnail preview */}
        {currentVideoId && (
          <div
            className="mt-3 flex items-center gap-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-3"
            id="thumbnail-preview"
          >
            <img
              src={`https://img.youtube.com/vi/${currentVideoId}/mqdefault.jpg`}
              alt="Video thumbnail"
              className="h-[68px] w-[120px] rounded object-cover bg-[#12121a]"
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5a5a6a]">
                Video ID
              </span>
              <span className="font-mono text-xs text-[#8a8a9a]">{currentVideoId}</span>
            </div>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div
        className="flex flex-1 flex-col min-h-[400px] overflow-hidden rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] backdrop-blur-md"
        id="chat-area"
      >
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6" id="chat-messages">
          {messages.length === 0 && !isLoading ? (
            <div
              className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center"
              id="chat-empty-state"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgba(255,0,51,0.08)] text-[#ff0033] animate-pulse">
                <svg
                  className="h-7 w-7 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                </svg>
              </div>
              <div className="text-lg font-semibold text-[#f0f0f5]">
                Ask anything about the video
              </div>
              <div className="max-w-[360px] text-sm leading-relaxed text-[#5a5a6a]">
                Paste a YouTube URL above, type your question below, and get AI-powered answers from
                the video transcript.
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
              ))}
              {isLoading && <LoadingDots />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-t border-[rgba(255,255,255,0.08)] bg-[#0a0a0f]/50 px-6 py-4"
          id="chat-form"
        >
          <div className="flex items-center gap-3">
            <input
              type="text"
              {...queryRegRest}
              ref={(e) => {
                queryRegRef(e);
                queryInputRef.current = e;
              }}
              placeholder={
                activeVideoId
                  ? 'Ask another question about this video...'
                  : 'Type your question here...'
              }
              className="flex-1 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-[#f0f0f5] outline-none transition-all duration-200 placeholder:text-[#5a5a6a] focus:border-[#ff0033]/50 focus:bg-[rgba(255,255,255,0.08)] focus:shadow-[0_0_0_3px_rgba(255,0,51,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
              id="query-input"
              disabled={isLoading}
              autoComplete="off"
            />
            <button
              type="submit"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ff0033] text-white shadow-[0_0_20px_rgba(255,0,51,0.2)] transition-all duration-200 hover:scale-105 hover:bg-[#e6002e] hover:shadow-[0_0_24px_rgba(255,0,51,0.2)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              id="submit-button"
              disabled={isLoading}
              aria-label="Send message"
            >
              <svg
                className="h-[18px] w-[18px] fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
          {errors.query && !isLoading && (
            <div className="mt-2 flex items-center gap-1.5 rounded border border-[#ff4757]/20 bg-[#ff4757]/8 px-3 py-2 text-xs font-medium text-[#ff4757]">
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              Please enter a question
            </div>
          )}
        </form>
      </div>
    </>
  );
}
