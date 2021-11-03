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
} from "lib/icons";
import classnames from "classnames";

export default function Sidebar() {
  const { pathname } = useRouter();
  const [mobileNav, showMobileNav] = useState(false);

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
      title: "Work",
      url: "/work",
      icon: SideProjectsIcon,
      active: pathname.includes("/work"),
    },
    {
      title: "Travel Map",
      url: "/map",
      icon: TravelIcon,
      active: pathname === "/map",
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
                "flex items-center w-full px-4 py-[5px] mb-2 transition-all duration-150 ease-in-out rounded-lg",
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
                  "flex items-center w-full px-4 py-[5px] mb-2 transition-all duration-150 ease-in-out rounded-lg",
                  { "bg-black text-white": link?.active },
                  { "hover:bg-gray-100": !link?.active }
                )}
                target={link?.external ? "_blank" : undefined}
              >
                <span className="w-5 h-5 min-w-[40px]">{link?.icon}</span>
                <span>{link?.title}</span>
                {link?.external ? (
                  <span className="w-4 h-4 ml-auto text-gray-400">
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

  return (
    <>
      <aside className="w-full max-w-[250px] border-r border-gray-100 h-screen py-10 md:flex flex-col flex-none hidden">
        {renderLinks()}
        {renderSocials()}
      </aside>
      <nav className="fixed bottom-0 left-0 z-10 block w-full p-2 md:hidden">
        <div className="border border-gray-200 rounded-lg bg-white/70 backdrop-filter backdrop-blur">
          <div
            className="py-2 text-center cursor-pointer"
            onClick={() => showMobileNav(!mobileNav)}
          >
            Menu
          </div>
          {mobileNav ? (
            <div onClick={() => showMobileNav(false)}>
              {renderLinks()}
              {renderSocials()}
            </div>
          ) : (
            ""
          )}
        </div>
      </nav>
    </>
  );
}
