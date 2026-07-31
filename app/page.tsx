import Header from '../components/ui/Header';
import UserForm from '../components/forms/UserForm';

export default function Home() {
  return (
    <div className="relative z-10 flex min-h-screen flex-col" id="app-root">
      <Header />
      <main className="mx-auto flex w-full max-w-[860px] flex-1 flex-col p-6" id="main-content">
        <UserForm />
      </main>
      <footer
        className="border-t border-[rgba(255,255,255,0.08)] bg-[#0a0a0f]/50 py-4 px-6 text-center text-xs text-[#5a5a6a]"
        id="app-footer"
      >
        <p>
          Built with{' '}
          <a
            className="text-[#ff0033] hover:opacity-80 transition-opacity"
            href="https://nextjs.org"
          >
            Next.js
          </a>{' '}
          &{' '}
          <a
            className="text-[#ff0033] hover:opacity-80 transition-opacity"
            href="https://python.langchain.com"
          >
            LangChain
          </a>{' '}
          — by{' '}
          <a
            className="text-[#ff0033] hover:opacity-80 transition-opacity"
            href="https://github.com/amandeep-singh-parihar"
            target="_blank"
            rel="noopener noreferrer"
          >
            Amandeep Singh
          </a>
        </p>
      </footer>
    </div>
  );
}
