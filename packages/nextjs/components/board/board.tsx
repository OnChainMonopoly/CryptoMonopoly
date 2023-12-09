import { useState } from "react";
import Image from "next/image";
import { BOARD_COLORS, BOARD_STYLES } from "./style";
import { useAccount } from "wagmi";
import {
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useScaffoldEventHistory,
  useScaffoldEventSubscriber,
} from "~~/hooks/scaffold-eth";

interface Log {
  player: string;
  detail: string;
  num: number;
}

export const Board = () => {
  const { address } = useAccount();

  const [logs, setLogs] = useState<any>([]);

  useScaffoldEventSubscriber({
    contractName: "CryptoMonopoly",
    eventName: "PlayEvent",
    listener: (data: any) => {
      setLogs([data[0].args, ...logs]);
    },
  });

  useScaffoldEventSubscriber({
    contractName: "CryptoMonopoly",
    eventName: "RollResult",
    listener: (data: any) => {
      data[0].detail = "roll";
      setLogs([data[0].args, ...logs]);
    },
  });

  const { data: gridData } = useScaffoldContractRead({
    contractName: "CryptoMonopoly",
    functionName: "getGrid",
  });

  const { data: you } = useScaffoldContractRead({
    contractName: "CryptoMonopoly",
    functionName: "player",
    args: [address],
  });

  const { data: isPaid } = useScaffoldContractRead({
    contractName: "CryptoMonopoly",
    functionName: "isPaid",
    args: [address],
  });

  const { data: isJail } = useScaffoldContractRead({
    contractName: "CryptoMonopoly",
    functionName: "isJail",
    args: [address],
  });

  const { data: isChest } = useScaffoldContractRead({
    contractName: "CryptoMonopoly",
    functionName: "isChest",
    args: [address],
  });

  const { data: isChance } = useScaffoldContractRead({
    contractName: "CryptoMonopoly",
    functionName: "isChance",
    args: [address],
  });

  const { data: isOwnRent } = useScaffoldContractRead({
    contractName: "CryptoMonopoly",
    functionName: "isOwnRent",
    args: [address],
  });

  const { data: coinBalance } = useScaffoldContractRead({
    contractName: "CoinToken",
    functionName: "balanceOf",
    args: [address],
  });

  const { writeAsync: playGame, isLoading: playLoading } = useScaffoldContractWrite({
    contractName: "CryptoMonopoly",
    functionName: "addPlayer",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: roll, isLoading: rollLoading } = useScaffoldContractWrite({
    contractName: "CryptoMonopoly",
    functionName: "movePlayer",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: buyProperty } = useScaffoldContractWrite({
    contractName: "CryptoMonopoly",
    functionName: "buyProperty",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: leaveJail, isLoading: leaveLoading } = useScaffoldContractWrite({
    contractName: "CryptoMonopoly",
    functionName: "leaveJail",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: collectChest, isLoading: collectChestLoading } = useScaffoldContractWrite({
    contractName: "CryptoMonopoly",
    functionName: "collectChest",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: playChance, isLoading: playChanceLoading } = useScaffoldContractWrite({
    contractName: "CryptoMonopoly",
    functionName: "playChance",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: payRent, isLoading: payRentLoading } = useScaffoldContractWrite({
    contractName: "CryptoMonopoly",
    functionName: "payRent",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { data: events } = useScaffoldEventHistory({
    contractName: "CryptoMonopoly",
    eventName: "PlayEvent",
    fromBlock: 0n,
  });

  console.log(events);

  return (
    <div className="mt-5">
      <div>
        <div className="flex">
          <div>
            <div className="flex justify-between">
              <h2 className="mt-4 text-3xl">Board</h2>
              <p>{(coinBalance?.toString() as any) / 10 ** 18} Coin</p>
            </div>
            <div className="relative mt-3" style={{ width: "500px", height: "600px" }}>
              <div className="grid-action">
                {!isPaid && (
                  <button
                    className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50 w-[260px] ml-2"
                    onClick={() => playGame()}
                    disabled={playLoading}
                  >
                    {playLoading ? "Adding..." : "Play"}
                  </button>
                )}
                {isPaid && !isJail && !isChest && !isChance && !isOwnRent && (
                  <button
                    className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50 w-[260px] ml-2"
                    onClick={() => roll()}
                    disabled={rollLoading}
                  >
                    {rollLoading ? "Rolling..." : "Roll"}
                  </button>
                )}
                {gridData &&
                  gridData[you?.toString() as any]?.owner === "0x0000000000000000000000000000000000000000" &&
                  gridData[you?.toString() as any]?.typeGrid === "Building" && (
                    <button
                      className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50 w-[260px] ml-2"
                      onClick={() => buyProperty()}
                    >
                      Buy Property
                    </button>
                  )}
                {isJail && (
                  <button
                    className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50 w-[260px] ml-2"
                    onClick={() => leaveJail()}
                    disabled={leaveLoading}
                  >
                    {leaveLoading ? "Escaping" : "Leave Jail"}
                  </button>
                )}
                {isChest && (
                  <button
                    className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50 w-[260px] ml-2"
                    onClick={() => collectChest()}
                    disabled={collectChestLoading}
                  >
                    {collectChestLoading ? "Collecting.." : "Collect Chest"}
                  </button>
                )}
                {isChance && (
                  <button
                    className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50 w-[260px] ml-2"
                    onClick={() => playChance()}
                    disabled={playChanceLoading}
                  >
                    {playChanceLoading ? "Playing..." : "Play Chance"}
                  </button>
                )}
                {isOwnRent && (
                  <button
                    className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50 w-[260px] ml-2"
                    onClick={() => payRent()}
                    disabled={payRentLoading}
                  >
                    {payRentLoading ? "Paying..." : "Pay Rent"}
                  </button>
                )}
                <div className="h-[150px] overflow-auto bg-yellow-50 mt-3 px-2">
                  {logs.map((log: Log, index: any) => (
                    <p key={index}>
                      - {log.player.slice(0, 3)}...{log.player.slice(37, 42)} {log.detail} {log.num.toString()}
                    </p>
                  ))}
                  {events?.map((log: any, index: any) => (
                    <p key={index}>
                      - {log.args.player.slice(0, 3)}...{log.args.player.slice(37, 42)} {log.args.detail}
                      {"·"}
                      {log.args.num.toString()}
                    </p>
                  ))}
                </div>
              </div>
              {gridData &&
                gridData.map((item, index) => (
                  <div
                    key={index}
                    className={
                      "relative w-20 h-20 border border-gray-300 font-bold bg-white" + " " + BOARD_STYLES[index] ||
                      "grid-1"
                    }
                  >
                    {item.typeGrid === "Building" && <div className={"label" + " " + BOARD_COLORS[index]}></div>}
                    {you?.toString() === item.id.toString() && (
                      <Image
                        className="car z-30 bg-black rounded-xl p-1"
                        width={40}
                        height={40}
                        src="/assets/car.png"
                        alt="Car"
                      />
                    )}
                    {item.typeGrid === "Home" && (
                      <Image className="home" width={45} height={45} src="/assets/go.png" alt="Home" />
                    )}
                    {item.typeGrid === "Chest" && (
                      <Image className="car" src="/assets/chest.png" width={45} height={45} alt="Chest" />
                    )}
                    {item.typeGrid === "Passing" && (
                      <Image className="passing" width={45} height={45} src="/assets/visiting.png" alt="Visiting" />
                    )}
                    {item.typeGrid === "Chance" && (
                      <Image className="car" width={45} height={45} src="/assets/chance.png" alt="Chance" />
                    )}
                    {item.typeGrid === "Jail" && (
                      <Image className="car" width={50} height={50} src="/assets/jail.png" alt="Jail" />
                    )}
                    {item.typeGrid === "Free Parking" && (
                      <Image className="car" width={45} height={45} src="/assets/freeparking.png" alt="Free Parking" />
                    )}
                    {item.typeGrid === "Go to Jail" && (
                      <Image className="car" width={45} height={45} src="/assets/police.png" alt="Police" />
                    )}
                    {item.typeGrid === "Building" && <p className="building">Building # {index}</p>}
                    {item.numberOfPlayers > 0 && (
                      <div className="numberplayers">
                        <p className="mr-1">{item.numberOfPlayers.toString()}</p>
                        <Image className="w-5 h-4" width={45} height={45} src="/assets/head.png" alt="Players" />
                      </div>
                    )}
                    <p className="price ml-3">
                      {item.owner !== "0x0000000000000000000000000000000000000000"
                        ? "Rent for " + (item.rent?.toString() as any) / 10 ** 18
                        : item.typeGrid === "Building"
                        ? "Buy for " + (item?.price?.toString() as any) / 10 ** 18
                        : item.typeGrid}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
