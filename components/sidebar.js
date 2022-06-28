import {useState} from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  HomeIcon,
  BlogIcon,
  TravelIcon,
  SideProjectsIcon,
  TwitterIcon,
  InstagramIcon,
  ExternalLinkIcon,
  EmailIcon,
  ExperimentsIcon,
} from "lib/icons";
import { Newspaper } from "phosphor-react";
import classnames from "classnames";
import { useTheme } from "next-themes";


export default function Sidebar() {
  const { pathname } = useRouter();
  const [mobileNav, showMobileNav] = useState(false);
  const {theme, setTheme} = useTheme();

  const LINKS = [
    {
      title: "Home",
      url: "/",
      icon: HomeIcon,
      active: pathname === "/",
    },
    {
      title: "Blog",
      url: "/blog",
      icon: BlogIcon,
      active: pathname.includes("/blog"),
    },
    {
      title: "Side Projects",
      url: "/projects",
      icon: SideProjectsIcon,
      active: pathname.includes("/projects"),
    },
    {
      title: "Experiments",
      url: "/experiments",
      icon: ExperimentsIcon,
      active: pathname.includes("/experiments"),
    },
    {
      title: "Travel Map",
      url: "/map",
      icon: TravelIcon,
      active: pathname === "/map",
    },
    {
      title: "Newsletter",
      url: "http://newsletter.rishimohan.me",
      icon: (
        <div className="relative right-[-10px]">
          <Newspaper size={20} weight="bold" />
        </div>
      ),
      active: false,
    },
  ];

  const SOCIAL = [
    {
      title: "Twitter",
      url: `https://twitter.com/${process.env.twitter}`,
      icon: TwitterIcon,
      external: true,
    },
    {
      title: "Instagram",
      url: `https://instagram.com/${process.env.instagram}`,
      icon: InstagramIcon,
      external: true,
    },
    {
      title: "Email",
      url: `mailto:iamrishi.ms@gmail.com`,
      icon: EmailIcon,
      external: false,
    },
  ];

  const renderLinks = () => {
    return (
      LINKS.map((link) => (
        <div className="px-4" key={link.title}>
          <Link href={link.url}>
            <a
              className={classnames(
                "flex items-center w-full px-4 py-[5px] mb-2 transition-all duration-150 ease-in-out rounded-lg dark:hover:bg-black",
                { "bg-black text-white": link?.active },
                { "hover:bg-gray-100": !link?.active }
              )}
            >
              <span className="w-5 h-5 min-w-[40px]">{link?.icon}</span>
              <span>{link?.title}</span>
            </a>
          </Link>
        </div>
      ))    
    )
  }

  const renderSocials = () => {
    return (
      <>
        <h4 className="px-10 mt-4 mb-2 text-gray-400">Social</h4>
        {SOCIAL.map((link) => (
          <div className="px-4" key={link.title}>
            <Link href={link.url}>
              <a
                className={classnames(
                  "flex items-center w-full px-4 py-[5px] mb-2 transition-all duration-150 ease-in-out rounded-lg dark:hover:bg-black",
                  { "bg-black text-white": link?.active },
                  { "hover:bg-gray-100": !link?.active }
                )}
                target={link?.external ? "_blank" : undefined}
              >
                <span className="w-5 h-5 min-w-[40px]">{link?.icon}</span>
                <span>{link?.title}</span>
                {link?.external ? (
                  <span className="w-4 h-4 ml-auto text-gray-400 dark:text-gray-600">
                    {ExternalLinkIcon}
                  </span>
                ) : (
                  ""
                )}
              </a>
            </Link>
          </div>
        ))}
      </>
    );
  }

  const renderPrefs = () => {
    return (theme ? 
      <>
        <h4 className="px-10 mt-4 mb-2 text-gray-400">Theme</h4>
        <div className="px-2 py-1 mx-6 dark:bg-[#111] border border-gray-200 rounded-lg cursor-pointer dark:border-gray-800">
          <select
            onChange={(e) => setTheme(e.target.value)}
            className="w-full bg-transparent dark:bg-[#111] outline-none appearance-none cursor-pointer"
            defaultValue={theme}
            placeholder="Select theme"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </>
    : "");
  }

  return (
    <>
      <aside className="w-full max-w-[250px] md:border-r border-gray-100 h-screen pt-6 pb-10 md:flex flex-col flex-none hidden dark:border-gray-800">
        {renderLinks()}
        {renderSocials()}
        {renderPrefs()}
      </aside>
      <nav className="fixed bottom-0 left-0 z-10 block w-full p-2 md:hidden">
        <div className="border border-gray-200 rounded-lg bg-white/70 backdrop-filter backdrop-blur dark:bg-gray-900/50 dark:border-gray-700">
          <div
            className="py-2 text-center cursor-pointer"
            onClick={() => showMobileNav(!mobileNav)}
          >
            {!mobileNav ? "Menu" : "Close"}
          </div>
          {mobileNav ? (
            <div className="pb-8">
              <div onClick={() => showMobileNav(false)}>
                {renderLinks()}
                {renderSocials()}
              </div>
              {renderPrefs()}
            </div>
          ) : (
            ""
          )}
        </div>
      </nav>
    </>
  );
}
