type PageShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <section className="mx-auto w-full max-w-6xl min-w-0 px-3 py-8 min-[480px]:px-4 min-[480px]:py-12 sm:px-6">
      <header className="mb-6 max-w-3xl min-w-0 sm:mb-8">
        <h1 className="section-title break-words text-[clamp(2rem,7vw,3.25rem)] leading-[0.95] text-foreground">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground min-[480px]:mt-3 min-[480px]:text-base">
          {description}
        </p>
      </header>
      {children}
    </section>
  );
}
