import type { ReactNode } from "react";

type Props = {
  eyebrow: ReactNode;
  title: ReactNode;
  children: ReactNode;
  legal?: boolean;
};

export function PageLayout({ eyebrow, title, children, legal = false }: Props) {
  const prose = legal
    ? "[&>p:not(:first-child)]:text-[17px] [&_h2]:mt-10.5 [&_h2]:mb-2.5 [&_h2]:font-display [&_h2]:text-[22px] [&_h2]:leading-[1.2] [&_h2]:font-bold [&_h2]:tracking-[-.025em]"
    : "[&>p:not(:first-child)]:text-[clamp(17px,1.6vw,21px)]";

  return (
    <main className="h-full overflow-y-auto bg-[radial-gradient(circle_at_84%_8%,color-mix(in_srgb,var(--pink)_13%,transparent),transparent_32%),var(--bg)] px-[max(7vw,28px)] pt-[clamp(64px,10vw,130px)] pb-25 max-[760px]:px-5.5 max-[760px]:pt-13.75 max-[760px]:pb-20">
      <article
        className={`max-w-190 [&>p:not(:first-child)]:mb-5.5 [&>p:not(:first-child)]:max-w-175 [&>p:not(:first-child)]:leading-[1.65] [&>p:not(:first-child)]:text-(--muted) [&>p:last-child]:mt-8.5 [&>p:last-child]:text-[15px] [&_a]:font-bold [&_a]:text-(--pink) [&_a]:underline-offset-3 ${prose}`}
      >
        <p className="mb-2 text-[11px] font-bold tracking-[.16em] text-(--pink) uppercase">
          {eyebrow}
        </p>
        <h1
          className={`font-display mb-9 leading-[.98] font-bold tracking-[-.06em] max-[760px]:text-[44px] ${legal ? "text-[clamp(40px,5vw,64px)]" : "text-[clamp(42px,6vw,76px)]"}`}
        >
          {title}
        </h1>
        {children}
      </article>
    </main>
  );
}
