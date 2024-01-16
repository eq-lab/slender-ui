'use client';

export function FaqLink({
  href,
  children,
  sameTab,
}: {
  href: string;
  sameTab?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={sameTab ? '_self' : '_blank'}
      rel="noreferrer"
      onClick={(event) => event.stopPropagation()}
    >
      {children}
    </a>
  );
}
