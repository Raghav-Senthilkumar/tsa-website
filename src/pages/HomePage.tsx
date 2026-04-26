import StaggeredMenu from "@/components/staggered-menu/StaggeredMenu";
import type {
  StaggeredMenuItem,
  StaggeredMenuSocialItem,
} from "@/components/staggered-menu/StaggeredMenu";
import AboutUsScroll from "@/components/about/AboutUsScroll";
import BoardMembersSection from "@/components/board/BoardMembersSection";
import UpcomingEvents from "@/components/events/UpcomingEvents";
import Footer from "@/components/footer/Footer";
import AeroHero2 from "@/components/ui/aero-hero-2";

const base = import.meta.env.BASE_URL;

const menuItems: StaggeredMenuItem[] = [
  { label: "Home", ariaLabel: "Go to top of page", link: "/" },
  { label: "About", ariaLabel: "Go to about section", link: "#about" },
  { label: "Events", ariaLabel: "Go to events section", link: "#events" },
  { label: "Board", ariaLabel: "Go to board section", link: "#board" },
  { label: "Gallery", ariaLabel: "View the gallery page", link: "/gallery" },
  { label: "Contact", ariaLabel: "Go to contact section", link: "#contact" },
];

const socialItems: StaggeredMenuSocialItem[] = [
  { label: "Instagram", link: "https://instagram.com" },
  { label: "Facebook", link: "https://facebook.com" },
];

export default function HomePage() {
  return (
    <>
      <StaggeredMenu
        isFixed
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displayLogo={false}
        displaySocials
        displayItemNumbering
        menuButtonColor="#ffffff"
        openMenuButtonColor="#ffffff"
        changeMenuColorOnOpen
        colors={["#ED1C24", "#FFFFFF", "#241D4F"]}
        accentColor="#E8C547"
        logoUrl={`${base}logo.jpg`}
        className="font-manrope"
      />

      <AeroHero2 />

      <div id="about">
        <AboutUsScroll />
      </div>

      <div id="events">
        <UpcomingEvents />
      </div>

      <div id="board">
        <BoardMembersSection />
      </div>

      <Footer />
    </>
  );
}

