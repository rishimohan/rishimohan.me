export default function WithoutSidebar(props) {
  return (
    <section className="flex items-start">
      <main className="relative w-full h-screen overflow-y-auto">
        {props.children}
      </main>
    </section>
  );
}
