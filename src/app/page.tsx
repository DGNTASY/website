import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Image
        src={"/bg.webp"}
        alt="logo"
        width={1200}
        height={400}
        className="w-full min-h-screen object-cover fixed top-0  z-0 blur-[4px] brightness-50"
      />
      <main
        className={`flex min-h-screen items-center justify-center p-12 lg:py-24 `}
      >
        <div className="flex items-center justify-start flex-col lg:flex-row self-stretch">
          <div className="lg:w-1/2 flex flex-col items-start justify-center gap-16 z-20">
            <div className="flex flex-col ">
              <h1 className="font-extrabold text-primary text-4xl text-white">
                SolFootball
              </h1>
              <h1 className="font-extrabold text-xl text-white">
                lets you challenge anyone in your favourite league
              </h1>
            </div>

            <div className="pl-0 sm:pl-10">
              <p className="font-semibold text-white">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Necessitatibus consectetur atque aspernatur quaerat temporibus
                est nobis consequuntur autem, harum ratione nostrum, odio ullam
                officia explicabo tempora a ex. Numquam, magni!
              </p>
            </div>

            <div>
              <Link href={"/login"}>
                <Button
                  className="font-extrabold bg-connect text-theme"
                  size="lg"
                  color="primary"
                >
                  PLAY
                </Button>
              </Link>
            </div>
          </div>
          {/* <div className="w-1/2">
            <Image src="/test2.png" alt="iu" width={500} height={500} />
          </div> */}
        </div>
      </main>
    </>
  );
}
