import { Sidebar } from "components";
import { ContentWrapper, Switch } from "ui";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function MainLayout({ children }) {
  const { theme, setTheme } = useTheme();

  return (
    <section className="flex items-start pt-[32px] md:pt-[56px] flex-col min-h-screen">
      <Sidebar />
      <main className="relative w-full ">{children}</main>
      <footer className="w-full mt-auto pt-12  ">
        <ContentWrapper
          width="620px"
          className="border-t border-gray-500/10 py-3 flex justify-between items-center"
        >
          <div>
            <span className="text-sm opacity-60">Theme →</span>
            <div className="mx-2 bg-white dark:bg-[#111] border border-gray-200 rounded-lg cursor-pointer dark:border-gray-800 hover:border-gray-800 dark:hover:border-gray-300 inline-flex text-sm">
              <select
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-white dark:bg-[#111] outline-none appearance-none cursor-pointer py-1 px-2 rounded-lg"
                defaultValue={theme}
                placeholder="Select theme"
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
          <div>
            <Link
              className="text-sm opacity-60 hover:underline hover:opacity-100"
              href="https://github.com/rishimohan/rishimohan.me"
              target="_blank"
            >
              Code on Github
            </Link>
          </div>
        </ContentWrapper>
      </footer>
    </section>
  );
}
