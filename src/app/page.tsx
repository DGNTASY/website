import Landing from "@/components/Landing";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div
        className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-r from-fuchsia-500 to-cyan-500
      "
      >
        <Landing />
        <div className="flex flex-col items-center justify-center z-20 absolute inset-0 w-full h-full text-theme text-center pt-[80px]">
          <div className="flex flex-col justify-center items-center gap-8 ">
            <h1 className="text-white text-7xl font-extrabold drop-shadow-2xl">
              DGNTASY
            </h1>
            <h2 className=" text-white text-3xl font-extrabold ">
              IS WHERE YOU BET ON FANTASYPREMIERLEAGUE.COM
            </h2>
          </div>

          <div className="flex justify-center items-center gap-32">
            <div className="mt-8">
              <Link href={"/about"}>
                <Button
                  className="font-extrabold bg-connect text-theme hover:bg-connect hover:text-theme"
                  size="lg"
                  color="primary"
                >
                  ABOUT
                </Button>
              </Link>
            </div>
            <div className="mt-8">
              <Link href={"/dapp"}>
                <Button
                  className="font-extrabold bg-connect text-theme hover:bg-connect hover:text-theme"
                  size="lg"
                  color="primary"
                >
                  APP
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
