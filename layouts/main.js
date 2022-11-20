import { Sidebar } from "components"

export default function MainLayout({ children }) {
  return (
    <section className="flex items-start">
      <Sidebar />
      <main className="relative w-full bg-white dark:bg-[#111]">
        {children}
      </main>
    </section>
  );
}