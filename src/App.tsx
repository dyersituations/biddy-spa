import { useEffect, useRef, useState } from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa6";
import {
  FiCalendar,
  FiClock,
  FiMail,
  FiMapPin,
  FiMenu,
  FiX,
} from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import eventsData from "@/content/events.json";
import navItemsData from "@/content/nav-items.json";
import panelSectionsData from "@/content/panel-sections.json";
import performanceHighlightsData from "@/content/performance-highlights.json";
import siteConfig from "@/content/site-config.json";
import storyParagraphsData from "@/content/story-paragraphs.json";

const {
  heroImage,
  youtubeEmbedUrl,
  youtubeUploadsPlaylistId,
  bandcampEmbedUrl,
  bandcampBaseWidth,
  bandcampBaseHeight,
  siteUrl,
  seoDescription,
} = siteConfig;

const navItems = navItemsData;
const storyParagraphs = storyParagraphsData;
const performanceHighlights = performanceHighlightsData;
const panelSections = panelSectionsData;
const events = eventsData;
const buildYoutubePlaylistEmbedUrl = (playlistId, index) =>
  `https://www.youtube.com/embed?listType=playlist&list=${encodeURIComponent(playlistId)}&index=${index}&rel=0`;
const youtubeVideoEmbeds = youtubeUploadsPlaylistId
  ? Array.from({ length: 4 }, (_, index) =>
      buildYoutubePlaylistEmbedUrl(youtubeUploadsPlaylistId, index),
    )
  : Array.from({ length: 4 }, () => youtubeEmbedUrl);

const buildDateTime = (dateValue, timeValue, utcOffset) =>
  `${dateValue}T${timeValue}:00${utcOffset}`;

const musicEventSchema = {
  "@context": "https://schema.org",
  "@graph": events.map((eventItem) => ({
    "@type": "MusicEvent",
    name: eventItem.name,
    url: eventItem.url,
    image: eventItem.image,
    startDate: buildDateTime(
      eventItem.startDate,
      eventItem.startTime,
      eventItem.utcOffset,
    ),
    endDate: buildDateTime(eventItem.startDate, eventItem.endTime, eventItem.utcOffset),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description: `${eventItem.name} in ${eventItem.location}. ${eventItem.time}.`,
    location: {
      "@type": "Place",
      name: eventItem.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: eventItem.addressLocality,
        addressRegion: eventItem.addressRegion,
        addressCountry: eventItem.addressCountry,
      },
    },
    performer: {
      "@type": "MusicGroup",
      name: "Biddy on the Bench",
      url: `${siteUrl}/`,
      description: seoDescription,
    },
    organizer: {
      "@type": "Organization",
      name: "Biddy on the Bench",
      url: `${siteUrl}/`,
    },
    offers: {
      "@type": "Offer",
      url: eventItem.url,
      availability: "https://schema.org/InStock",
    },
  })),
};

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bandcampScale, setBandcampScale] = useState(1);
  const bandcampWrapperRef = useRef(null);

  useEffect(() => {
    const wrapper = bandcampWrapperRef.current;
    if (!wrapper) {
      return undefined;
    }

    const updateScale = () => {
      const width = wrapper.clientWidth || bandcampBaseWidth;
      setBandcampScale(width / bandcampBaseWidth);
    };

    updateScale();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateScale);
      return () => window.removeEventListener("resize", updateScale);
    }

    const observer = new ResizeObserver(updateScale);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  const handleLogoClick = (event) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f5efdf] text-zinc-900">
      <header className="sticky top-0 z-50 border-b border-zinc-900/15 bg-[#f5efdf]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[59.5rem] items-center justify-between gap-4 px-4 py-2 md:px-6 md:py-3">
          <a
            href="#home"
            className="font-biddy text-2xl text-zinc-900 uppercase md:text-4xl"
            onClick={handleLogoClick}
          >
            BIDDY ON THE BENCH
          </a>

          <nav className="hidden items-center justify-end gap-4 text-xs font-semibold tracking-[0.12em] uppercase md:flex md:text-sm">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition hover:text-zinc-600"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-zinc-900/20 bg-transparent p-2 md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {mobileMenuOpen ? (
              <FiX className="size-4" />
            ) : (
              <FiMenu className="size-4" />
            )}
          </button>
        </div>

        {mobileMenuOpen ? (
          <nav
            id="mobile-nav"
            className="absolute inset-x-0 top-full z-40 border-t border-zinc-900/15 bg-[#f5efdf]/98 shadow-md backdrop-blur md:hidden"
          >
            <div className="mx-auto flex w-full max-w-[59.5rem] flex-col px-4 py-2 text-sm font-semibold tracking-[0.08em] uppercase md:px-6">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="py-2 transition hover:text-zinc-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        ) : null}
      </header>

      <main id="home">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(musicEventSchema) }}
        />
        <h1 className="sr-only">
          Biddy on the Bench official website and upcoming Irish folk music
          events
        </h1>
        <section className="relative">
          <div
            className="hero-parallax"
            style={{ backgroundImage: `url(${heroImage})` }}
            role="img"
            aria-label="Biddy on the Bench group photo"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/20" />
        </section>

        <section id="story">
          <div className="mx-auto w-full max-w-[59.5rem] space-y-5 px-4 py-12 md:px-6 md:py-14">
            <h2 className="font-biddy text-2xl uppercase md:text-4xl">
              The Story
            </h2>
            <div className="w-full space-y-4 text-zinc-700">
              {storyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="text-zinc-700">Performance highlights:</p>
            <ul className="list-disc space-y-1 pl-5 text-zinc-700">
              {performanceHighlights.map((item) => (
                <li
                  key={`${item.year}-${item.label}`}
                  className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {item.year} -{" "}
                  {item.url ? (
                    <a
                      className="underline hover:no-underline"
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
            <p className="text-sm text-zinc-600">
              Photos by Joshua Dommermuth Photography:{" "}
              <a
                className="underline hover:no-underline"
                href="http://www.quixoticimages.com/"
                target="_blank"
                rel="noreferrer"
              >
                www.quixoticimages.com
              </a>
            </p>
          </div>
        </section>

        <section id="members">
          {panelSections.map((member) => (
            <article id={member.id} key={member.id}>
              <div
                className="member-parallax"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.34)), url(${member.image})`,
                }}
                role="img"
                aria-label={`${member.name} portrait`}
              />
              <div className="mx-auto w-full max-w-[59.5rem] space-y-3 px-4 py-8 md:px-6 md:py-10">
                <p className="text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase">
                  {member.role}
                </p>
                <h3 className="font-biddy text-2xl uppercase md:text-4xl">
                  {member.name}
                </h3>
                <p className="w-full leading-relaxed text-zinc-700">
                  {member.bio}
                </p>
              </div>
            </article>
          ))}
        </section>

        <section id="events" className="border-t border-zinc-900/15">
          <div className="mx-auto w-full max-w-[59.5rem] space-y-6 px-4 py-12 md:px-6 md:py-14">
            <h2 className="font-biddy text-2xl uppercase md:text-4xl">
              Upcoming Events
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              {events.map((eventItem) => (
                <a
                  key={eventItem.name}
                  href={eventItem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block h-full"
                >
                  <Card className="relative h-full overflow-hidden border-zinc-900/20 bg-[#f9f4e7] shadow-none transition hover:brightness-105 md:h-[232px]">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${eventItem.image})` }}
                      aria-hidden="true"
                    />
                    <div
                      className="absolute inset-0 bg-black/60"
                      aria-hidden="true"
                    />
                    <CardHeader className="relative pb-3">
                      <CardTitle className="font-biddy text-2xl text-zinc-50 uppercase">
                        {eventItem.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative mt-auto space-y-2 text-sm text-zinc-100">
                      <p className="flex items-center gap-2">
                        <FiCalendar className="size-4 text-amber-300" />
                        {eventItem.date}
                      </p>
                      <p className="flex items-center gap-2">
                        <FiClock className="size-4 text-amber-300" />
                        {eventItem.time}
                      </p>
                      <p className="flex items-center gap-2">
                        <FiMapPin className="size-4 text-amber-300" />
                        {eventItem.location}
                      </p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="media" className="border-t border-zinc-900/15">
          <div className="mx-auto w-full max-w-[59.5rem] space-y-6 px-4 py-12 md:px-6 md:py-14">
            <h2 className="font-biddy text-2xl uppercase md:text-4xl">
              Latest Videos & Music
            </h2>

            <div className="space-y-5">
              <Card className="border-zinc-900/20 bg-[#f9f4e7] shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="font-biddy text-2xl uppercase">
                    YouTube
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {youtubeVideoEmbeds.map((embedUrl, index) => (
                      <div
                        key={`${embedUrl}-${index}`}
                        className="relative aspect-video overflow-hidden bg-black"
                      >
                        <iframe
                          className="absolute inset-x-0 -top-[3px] h-[calc(100%+6px)] w-full border-0 outline-none"
                          src={embedUrl}
                          title={`Biddy on the Bench YouTube video ${index + 1}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                          style={{ border: 0 }}
                          tabIndex={-1}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-zinc-900/20 bg-[#f9f4e7] shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="font-biddy text-2xl uppercase">
                    Bandcamp
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div
                    ref={bandcampWrapperRef}
                    className="w-full overflow-hidden bg-white"
                    style={{ height: `${bandcampBaseHeight * bandcampScale}px` }}
                  >
                    <iframe
                      className="block"
                      src={bandcampEmbedUrl}
                      title="Biddy on the Bench - Make the Rafters Roar on Bandcamp"
                      loading="lazy"
                      style={{
                        border: 0,
                        height: `${bandcampBaseHeight}px`,
                        width: `${bandcampBaseWidth}px`,
                        transform: `scale(${bandcampScale})`,
                        transformOrigin: "top left",
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="contact" className="border-y border-zinc-900/15">
          <div className="mx-auto w-full max-w-[59.5rem] space-y-5 px-4 py-12 md:px-6 md:py-14">
            <h2 className="font-biddy text-2xl uppercase md:text-4xl">
              Contact
            </h2>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button
                asChild
                className="border border-[#cc0000] bg-[#ff0000] text-white hover:bg-[#d90000]"
              >
                <a
                  href="https://www.youtube.com/@biddyonthebench"
                  target="_blank"
                  rel="noreferrer"
                >
                  YouTube
                  <FaYoutube className="size-4" />
                </a>
              </Button>
              <Button
                asChild
                className="border border-[#f77737] bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white hover:brightness-95"
              >
                <a
                  href="https://instagram.com/biddyonthebench"
                  target="_blank"
                  rel="noreferrer"
                >
                  Follow on Instagram
                  <FaInstagram className="size-4" />
                </a>
              </Button>
              <Button
                asChild
                className="border border-[#1877f2] bg-[#1877f2] text-white hover:bg-[#166fe5]"
              >
                <a
                  href="https://www.facebook.com/biddyonthebench/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Facebook
                  <FaFacebookF className="size-4" />
                </a>
              </Button>
              <Button
                asChild
                className="border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
              >
                <a href="mailto:biddyonthebench@gmail.com">
                  Email
                  <FiMail className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
