export default function Footer() {
  return (
    <footer className="w-full bottom-0 border-t border-primary bg-background z-40 relative py-6">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 gap-6 md:gap-0">
        <div className="font-code text-code font-bold text-primary">
          © 2026 AARONNOFRAIL — ALL RIGHTS RESERVED
        </div>
        <div className="flex gap-6 font-code text-code">
          <a
            className="text-secondary hover:text-primary transition-colors hover:opacity-80 uppercase"
            href="https://github.com/aaronnofrail"
            target="_blank"
            rel="noopener noreferrer"
          >
            GITHUB
          </a>
          <a
            className="text-secondary hover:text-primary transition-colors hover:opacity-80 uppercase"
            href="https://www.linkedin.com/in/arundaffa/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LINKEDIN
          </a>
          <a
            className="text-secondary hover:text-primary transition-colors hover:opacity-80 uppercase"
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
