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
  // Support: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
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

  // Auto-scroll to latest message
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
      <div className="url-section">
        <div className="url-input-wrapper">
          <div className="url-input-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
                fill="currentColor"
              />
            </svg>
          </div>
          <input
            type="text"
            {...register('video_url', { required: true })}
            placeholder="Paste a YouTube URL — e.g. https://youtube.com/watch?v=..."
            className="url-input"
            id="video-url-input"
            autoComplete="off"
          />
        </div>
        {errors.video_url && (
          <div className="url-error" id="url-error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            YouTube URL is required
          </div>
        )}
        {error && (
          <div className="url-error" id="general-error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            {error}
          </div>
        )}

        {/* Thumbnail preview */}
        {currentVideoId && (
          <div className="thumbnail-preview" id="thumbnail-preview">
            <img
              src={`https://img.youtube.com/vi/${currentVideoId}/mqdefault.jpg`}
              alt="Video thumbnail"
              className="thumbnail-img"
            />
            <div className="thumbnail-info">
              <span className="thumbnail-label">Video ID</span>
              <span className="thumbnail-id">{currentVideoId}</span>
            </div>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="chat-area" id="chat-area">
        <div className="chat-messages" id="chat-messages">
          {messages.length === 0 && !isLoading ? (
            <div className="chat-empty" id="chat-empty-state">
              <div className="chat-empty-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                </svg>
              </div>
              <div className="chat-empty-title">Ask anything about the video</div>
              <div className="chat-empty-desc">
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
        <form onSubmit={handleSubmit(onSubmit)} className="chat-input-area" id="chat-form">
          <div className="chat-input-wrapper">
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
              className="chat-input"
              id="query-input"
              disabled={isLoading}
              autoComplete="off"
            />
            <button
              type="submit"
              className="chat-submit"
              id="submit-button"
              disabled={isLoading}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
          {errors.query && !isLoading && (
            <div className="url-error" style={{ marginTop: '8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
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