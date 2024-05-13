import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function NotFound() {
  return (
    <section className="container mt-24">
      <div className="flex items-center justify-center flex-col">
        <Image
          src="/not-found.svg"
          width={250}
          height={250}
          alt="No room Image"
          className="drop-shadow-sm"
          priority={false}
        />
        <p className="text-sm mt-4">Somebody stole the requested page.</p>
        <a href={process.env.NEXTAUTH_URL!} className="mt-2 font-medium ">
          <Button className="bg-[--theme-color] hover:bg-[--theme-color] hover:opacity-90">
            Take me to home
          </Button>
        </a>
      </div>
    </section>
  );
}
