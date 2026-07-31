'use client';

export default function LoadingDots() {
  return (
    <div
      className="animate-message flex max-w-[85%] gap-3 self-start opacity-0"
      id="loading-indicator"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[rgba(100,50,255,0.15)] text-[#b080ff] text-sm font-bold">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      </div>
      <div className="rounded-2xl rounded-bl-sm border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm">
        <div className="flex items-center gap-1 py-1">
          <div className="animate-dot-bounce h-2 w-2 rounded-full bg-[#8a8a9a]" />
          <div className="animate-dot-bounce h-2 w-2 rounded-full bg-[#8a8a9a] [animation-delay:0.2s]" />
          <div className="animate-dot-bounce h-2 w-2 rounded-full bg-[#8a8a9a] [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  );
}
