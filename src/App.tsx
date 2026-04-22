import StaggeredMenu from "@/components/staggered-menu/StaggeredMenu";
import type {
  StaggeredMenuItem,
  StaggeredMenuSocialItem,
} from "@/components/staggered-menu/StaggeredMenu";
import AeroHero2 from "@/components/ui/aero-hero-2";
import AboutUsScroll from "@/components/about/AboutUsScroll";
import UpcomingEvents from "@/components/events/UpcomingEvents";
import BoardMembersSection from "@/components/board/BoardMembersSection";

const base = import.meta.env.BASE_URL;

const menuItems: StaggeredMenuItem[] = [
  { label: "Home", ariaLabel: "Go to top of page", link: "#" },
  { label: "About", ariaLabel: "Go to about section", link: "#about" },
  { label: "Events", ariaLabel: "Go to events section", link: "#events" },
  { label: "Board", ariaLabel: "Go to board section", link: "#board" },
];

const socialItems: StaggeredMenuSocialItem[] = [
  { label: "Instagram", link: "https://instagram.com" },
  { label: "Facebook", link: "https://facebook.com" },
];

function App() {
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
      <UpcomingEvents />
      <BoardMembersSection />
    </>
  );
}

export default App;
