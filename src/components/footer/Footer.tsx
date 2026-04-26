function Pill({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-zinc-900 shadow-sm ring-1 ring-black/10">
      {children}
    </span>
  );
}

export default function Footer() {
  return (
    <footer
      id="contact"
      aria-label="Site footer"
      className="w-full bg-background min-h-dvh p-4 sm:p-6 md:p-8"
    >
      <div className="relative h-[calc(100dvh-2rem)] w-full overflow-hidden rounded-[26px] bg-[#241D4F] px-6 pb-0 pt-6 text-white ring-1 ring-black/10 sm:h-[calc(100dvh-3rem)] sm:px-10 sm:pt-8 md:h-[calc(100dvh-4rem)]">
          {/* top row */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Pill>tsa</Pill>
            </div>
          </div>

          {/* content */}
          <div className="mt-5 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
            <div className="space-y-3">
              <Pill>looking to join?</Pill>
              <p className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                we’re always welcoming new members.
              </p>
            </div>

            <div className="space-y-3">
              <Pill>office</Pill>
              <p className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                on campus
                <br />
                thai student association
              </p>
              <a
                href="#"
                className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/90 underline decoration-white/40 underline-offset-4 hover:text-white"
              >
                Google Maps
              </a>
            </div>

            <div className="space-y-3">
              <Pill>contact</Pill>
              <p className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                hello@tsa.club
                <br />
                send us a message
              </p>
              <p className="text-xs font-semibold text-white/80">
                *we reply fastest on socials.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 hover:bg-white/20"
                >
                  <span className="text-xs font-extrabold">in</span>
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 hover:bg-white/20"
                >
                  <span className="text-xs font-extrabold">ig</span>
                </a>
                <a
                  href="#"
                  aria-label="Message"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 hover:bg-white/20"
                >
                  <span className="text-xs font-extrabold">dm</span>
                </a>
              </div>

              <div className="mt-6 flex justify-end md:justify-start">
                <img
                  src={`${import.meta.env.BASE_URL}logo.jpg`}
                  alt="Thai Student Association logo"
                  className="h-14 w-auto select-none object-contain sm:h-16 md:h-[4.5rem]"
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* big wave word + stickers */}
          <div className="relative mt-10 h-[180px] sm:h-[220px] md:h-[260px]">
            <div
              className="absolute bottom-[-30px] left-6 select-none text-[110px] font-extrabold leading-[0.75] tracking-[-0.06em] text-white sm:left-10 sm:text-[160px] md:text-[220px]"
              style={{ textTransform: "lowercase" }}
              aria-hidden="true"
            >
              tsa
            </div>

          </div>
      </div>
    </footer>
  );
}

