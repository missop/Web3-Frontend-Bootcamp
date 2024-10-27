import { useWatchEvent, useWrite } from "@/hooks/contract";
import React, { useState } from "react";

export default function Operations() {
  const { mintNFT, setApprovalForAll, listNFT } = useWrite();
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");
  const [baseUri, setBaseUri] = useState("");
  useWatchEvent({
    key: "NFTMarketParams",
    eventName: "NftListed",
    onSuccess: (data) => {
      console.log("NFTListed", data);
    },
    onError: (error) => {
      console.log("NFTListed", error);
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="relative mt-2 rounded-md shadow-sm">
          <label for="price" className="block text-sm font-medium leading-6 ">
            NFT baseUri：
          </label>
          <input
            type="text"
            name="price"
            id="price"
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(e) => {
              setBaseUri(e.target.value);
            }}
          />
        </div>
        <button
          onClick={async () => {
            await mintNFT(baseUri);
          }}
          className="bg-blue-500 text-white w-full  px-4 py-2 rounded-md mt-4"
        >
          铸造NFT
        </button>
      </div>
      <div>
        <label for="price" className="block text-sm font-medium leading-6 ">
          上架的 NFT ID：
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <input
            type="text"
            name="price"
            id="price"
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(e) => {
              setTokenId(e.target.value);
            }}
          />
        </div>
      </div>
      <div>
        <label for="price" className="block text-sm font-medium leading-6 ">
          上架价格：
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <input
            type="text"
            name="price"
            id="price"
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(e) => {
              setPrice(e.target.value);
            }}
          />
        </div>
      </div>
      <div>
        <button
          className="bg-blue-500 text-white w-full  px-4 py-2 rounded-md mt-4"
          onClick={async () => {
            if (!tokenId) {
              alert("请输入需要上架的 NFT ID");
            } else if (!price) {
              alert("请输入上架价格");
            } else {
              await setApprovalForAll();
              await listNFT(tokenId, price);
            }
          }}
        >
          上架
        </button>
      </div>
    </div>
  );
}
