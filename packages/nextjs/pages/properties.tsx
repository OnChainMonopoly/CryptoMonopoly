import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useWalletClient } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const Properties: NextPage = () => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { data: cryptoMonopolyContract } = useScaffoldContract({
    contractName: "CryptoMonopoly",
    walletClient,
  });

  const { data: playerProperties } = useScaffoldContractRead({
    contractName: "CryptoMonopoly",
    functionName: "getPlayerProperties",
    args: [address],
  });

  const { data: gridData } = useScaffoldContractRead({
    contractName: "CryptoMonopoly",
    functionName: "getGrid",
  });

  const upgradeBuilding = async (id: string) => {
    await cryptoMonopolyContract?.write.upgradeBuilding([id]);
    notification.success("Building Upgraded");
  };

  return (
    <>
      <MetaHeader
        title="Properties"
        description="Properties created with 🏗 Scaffold-ETH 2, showcasing some of its features."
      >
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl mt-5">Your Properties</h1>
        {playerProperties &&
          playerProperties.map((item, index) => (
            <div key={index} className="">
              <p>ID: {gridData && gridData[item?.toString() as any]?.id.toString()}</p>
              <p>Rent: {gridData && +gridData[item?.toString() as any]?.rent.toString() / 10 ** 18} Coins</p>
              <p>Level: {gridData && gridData[item?.toString() as any]?.level.toString()}</p>
              <button
                className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
                onClick={() => upgradeBuilding(item?.toString())}
              >
                Upgrade for 50 Coins
              </button>
            </div>
          ))}
      </div>
    </>
  );
};

export default Properties;
