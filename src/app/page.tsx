import Landing from "@/components/Landing";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div
        className="flex flex-col items-center justify-center w-full min-h-screen
      "
      >
        <Landing />
        <div className="flex flex-col items-center justify-center z-20 absolute inset-0 w-full h-full text-theme text-center pt-[80px]">
          <div className="flex flex-col justify-center items-center gap-8 ">
            <h1 className="text-black text-7xl font-extrabold ">SolFootball</h1>
            <h2 className=" text-black text-xl font-extrabold ">
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
    </>
  );
}
