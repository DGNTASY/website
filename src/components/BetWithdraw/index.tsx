import WithdrawButton from "./WithdrawButton";
// import WithdrawStatus from "./WithdrawStatus";

// We can add balance here to update them both

export default function BetWithdraw() {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-5">
        {/* <WithdrawStatus /> */}
        <WithdrawButton />
      </div>
    </>
  );
}
