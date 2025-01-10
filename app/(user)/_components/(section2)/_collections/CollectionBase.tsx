import Image from "next/image";
import Link from "next/link";

interface CollectionProps {
  title: string;
  image: string;
  href: string;
  backgroundColor?: string;
  isHotList?: boolean;
}

export function CollectionBase({
  title,
  image,
  href,
  isHotList = false,
}: CollectionProps) {
  return (
    <div className="group relative h-full w-full overflow-hidden rounded-lg">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
        {isHotList && (
          <span className="mb-2 text-sm font-medium uppercase tracking-wider">
            Hot List
          </span>
        )}
        <h3 className="mb-2 text-xl md:text-2xl font-bold uppercase">
          {title}
        </h3>
        <Link
          href={href}
          className="inline-block border-b border-black pb-1 text-sm font-medium uppercase tracking-wider hover:opacity-80"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}
