import clsx from "clsx";

// A heading that links to itself, so sections can be shared directly
export default function AnchorHeading({
  as: Tag = "h2",
  id,
  className,
  children,
}) {
  return (
    <Tag id={id} className={clsx("group scroll-mt-24", className)}>
      <a href={`#${id}`} className="!no-underline !border-0 text-inherit">
        {children}
        <span
          aria-hidden
          className="ml-2 font-normal opacity-0 group-hover:opacity-30 transition-opacity"
        >
          #
        </span>
      </a>
    </Tag>
  );
}
