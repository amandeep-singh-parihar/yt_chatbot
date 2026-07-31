import Header from '../components/ui/Header';
import UserForm from '../components/forms/UserForm';

export default function Home() {
  return (
    <div className="app-container" id="app-root">
      <Header />
      <main className="main-content" id="main-content">
        <UserForm />
      </main>
      <footer className="footer" id="app-footer">
        <p>
          Built with <a href="https://nextjs.org">Next.js</a> &{' '}
          <a href="https://python.langchain.com">LangChain</a> — by{' '}
          <a
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
