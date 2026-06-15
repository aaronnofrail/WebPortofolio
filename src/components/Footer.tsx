export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black py-8 font-mono transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div className="text-[10px] md:text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
          © {new Date().getFullYear()} AARONNOFRAIL — Contact Me Pls for Intern/Projects
        </div>

        <div className="flex gap-6 text-[10px] md:text-xs font-bold tracking-widest">
          <a
            className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors uppercase"
            href="https://github.com/aaronnofrail"
            target="_blank"
            rel="noopener noreferrer"
          >
            GITHUB
          </a>
          <a
            className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors uppercase"
            href="https://www.linkedin.com/in/arundaffa/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LINKEDIN
          </a>
          <a
            className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors uppercase"
            href="https://www.instagram.com/dfnhrr"
            target="_blank"
            rel="noopener noreferrer"
          >
            INSTAGRAM
          </a>
        </div>
      </div>
    </footer>
  );
}
