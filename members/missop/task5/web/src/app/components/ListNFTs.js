import { useGetListsNFTs, useNftList, useWrite } from "@/hooks/contract";
import { waitForTransactionReceipt } from "@wagmi/core";
import React from "react";
import { useAccount } from "wagmi";
import config from "../wagmi";
import Image from "next/image";

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
            <Image
              width={275}
              height={183}
              src={
                "https://bronze-elderly-pheasant-478.mypinata.cloud/ipfs/QmdktNY4EURfKCvHiLNGqmu2RSJxY4RmzP1z7w8Dg2nqQM"
              }
              alt={nft.name}
            />
            <h2>NFT：#{nft.tokenId.toString()}</h2>
            <p title={nft.seller} className="overflow-hidden overflow-ellipsis whitespace-nowrap">
              持有者：{nft.seller}
            </p>
            <p>价格：{nft.price.toString()}MT</p>
            <p>上架时间：{nft.listTime?.toString?.()}</p>
            {nft.seller === address ? (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
                onClick={async () => {
                  const isConfirm = window.confirm("确定下架？");
                  if (isConfirm) {
                    // 授予操作权限
                    const approvalHash = await setApprovalForAll();
                    if (approvalHash) {
                      console.log("setApprovalForAll processing......");
                      await waitForTransactionReceipt(config, {
                        hash: approvalHash,
                      });
                      console.log("setApprovalForAll success");
                    }
                    const unlistHash = await unlistNFT(nft.tokenId.toString());
                    if (unlistHash) {
                      console.log("unlistNFT processing......");
                      await waitForTransactionReceipt(config, {
                        hash: unlistHash,
                      });
                      alert("unlistNFT success");
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
                  const approveHash = await approveAmount(1000000);
                  if (approveHash) {
                    console.log("approveAmount processing......");
                    await waitForTransactionReceipt(config, {
                      hash: approveHash,
                    });
                    console.log("approveAmount success");
                  }
                  const buyHash = await buyNFT(nft.tokenId.toString());
                  if (buyHash) {
                    console.log("buyNFT processing......");
                    await waitForTransactionReceipt(config, {
                      hash: buyHash,
                    });
                    alert("buyNFT success");
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
