import { Sidebar } from "components";

export default function MainLayout({ children }) {
  return (
    <section className="flex items-start pt-[32px] md:pt-[56px] pb-12">
      <Sidebar />
      <main className="relative w-full ">{children}</main>
    </section>
  );
}
