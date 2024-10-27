import { useGetListsNFTs, useNftList, useWrite } from "@/hooks/contract";
import React from "react";
import { useAccount } from "wagmi";

export default function ListNFTs() {
  const { address } = useAccount();
  const listNFTs = useGetListsNFTs() || [];
  console.log("listNFTs", listNFTs);
  const lists = useNftList() || [];
  console.log("lists", lists);
  const { approveAmount, buyNFT, unlistNFT, setApprovalForAll } = useWrite();
  return (
    <div className="flex gap-4 flex-wrap flex-1">
      {listNFTs
        .filter((el) => el.isActive)
        .map((nft, index) => (
          <div key={index} className="rounded-md w-1/4 p-4 shadow-lg">
            <img src={nft.image} alt={nft.name} />
            <h2>NFT：#{nft.tokenId.toString()}</h2>
            <p title={nft.seller} className="overflow-hidden overflow-ellipsis whitespace-nowrap">
              持有者：{nft.seller}
            </p>
            <p>价格：{nft.price.toString()}MT</p>
            {nft.seller === address ? (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
                onClick={async () => {
                  const isConfirm = window.confirm("确定下架？");
                  if (isConfirm) {
                    // 授予操作权限
                    await setApprovalForAll();
                    const res = await unlistNFT(nft.tokenId.toString());
                    if (res) {
                      alert("下架成功");
                    }
                  }
                }}
              >
                下架
              </button>
            ) : (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
                onClick={async () => {
                  // 授予额度权限
                  await approveAmount(1000000);
                  const res = await buyNFT(nft.tokenId.toString());
                  if (res) {
                    alert("购买成功");
                  }
                }}
              >
                购买
              </button>
            )}
          </div>
        ))}
    </div>
  );
}
