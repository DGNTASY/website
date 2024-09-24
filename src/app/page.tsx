import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main
        className={`flex min-h-screen items-center justify-center  lg:py-28 `}
      >
        <div className="flex items-center justify-center flex-col lg:flex-row  w-full md:w-11/12 h-full">
          <Image
            src={"/bg.webp"}
            alt="logo"
            width={1200}
            height={800}
            className="w-full min-h-screen md:min-h-[70vh] object-cover relative  blur-[4px] brightness-75"
          />
          <div className="flex flex-col items-center justify-center z-20 absolute inset-0 w-full h-full text-white text-center">
            <div className="flex flex-col justify-center items-center gap-8">
              <h1 className="font-extrabold  text-5xl">SolFootball</h1>
              <h2 className="font-extrabold text-xl mt-4">
                Lets you challenge anyone in your favourite league
              </h2>
            </div>

            <div className="mt-8">
              <Link href={"/login"}>
                <Button
                  className="font-extrabold bg-connect text-theme hover:bg-connect hover:text-theme"
                  size="lg"
                  color="primary"
                >
                  PLAY
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
