import { Sidebar } from "components"

export default function MainLayout(props) {
  return (
    <section className="flex items-start">
      <Sidebar />
      <main className="relative w-full h-screen overflow-y-auto">{props.children}</main>
    </section>
  );
}