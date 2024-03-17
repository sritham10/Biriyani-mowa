/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React, { useContext, useState } from "react";
import { CartContext } from "./AppContext";
import toast from "react-hot-toast";
import MenuItemTile from "./MenuItemTile";

type SizeType = {
  name: string;
  price: string;
  _id: string;
};

type PriorityType = { isPriority: boolean; priorityLabel: string };

type MenuItemType = {
  _id: string;
  itemName: string;
  itemDesc: string;
  itemPrice: number;
  menuImg: string;
  sizes?: SizeType[];
  category: string;
  priority: PriorityType;
};

type Props = {
  item: MenuItemType;
};

type ContextType = {
  addToCart: (item: MenuItemType, size: SizeType | null) => void;
  cartProducts: MenuItemType[];
};

export default function MenuCard({ item }: Props) {
  const { menuImg, itemName, itemDesc, itemPrice, sizes } = item;

  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<SizeType | null>(sizes?.[0] || null);

  const { addToCart, cartProducts }: ContextType = useContext<any>(CartContext);

  function handleAddToCart(item: MenuItemType, size: SizeType | null) {
    const hasSizes = sizes !== undefined && sizes.length > 0;
    if(hasSizes && !showPopUp){
        setShowPopUp(true);
        return;
    }
    addToCart(item, size);
    setShowPopUp(false);
    toast.success(`Added "${item.itemName}" to cart!`);
  }

  let selectedPrice = Number(itemPrice);
  if(selectedSize){
    selectedPrice += Number(selectedSize.price);
  }

  return (
    <>
      {showPopUp && (
        <div onClick={() => setShowPopUp(false)} className="fixed z-10 inset-0 bg-black/80 flex items-center justify-center">
          <div onClick={(e) => e.stopPropagation()} className="bg-white p-4 rounded-lg max-w-md max-h-[90vh] overflow-y-scroll">
            <div className="flex justify-end">
              <span
                onClick={() => setShowPopUp(false)}
                className="rounded-md cursor-pointer text-4xl"
              >
                &times;
              </span>
            </div>
            <Image
              className="mx-auto"
              src={menuImg}
              alt="DISH"
              width={300}
              height={300}
            />
            <h2 className="text-lg font-bold text-center">{itemName}</h2>
            <p className="p-2 text-justify text-xs text-slate-500">
              {itemDesc}
            </p>
            {sizes !== undefined && sizes.length > 0 && (
              <div className="bg-slate-300 p-2 rounded-md mt-2 mb-6">
                <h3 className="text-center">Pick your size</h3>
                {sizes.map((size) => (
                  <label
                    key={size._id}
                    className="flex flex-row items-center p-2"
                  >
                    <input
                      type="radio"
                      name={size.name}
                      onChange={() => setSelectedSize(size)}
                      checked={selectedSize?._id === size._id}
                    />
                    <span className="px-1">{size.name}</span>
                    <span>
                      &#8377; {Number(itemPrice) + Number(size.price)}/-
                    </span>
                  </label>
                ))}
              </div>
            )}
            <button onClick={() => handleAddToCart(item, selectedSize)} className="bg-primary text-white sticky bottom-2" type="button">
              Add to cart &#8377; {selectedPrice}/-
            </button>
          </div>
        </div>
      )}
      <MenuItemTile item={item} handleAddToCart={handleAddToCart} />
      {/* <div className="bg-slate-100 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-white transition-all hover:shadow-md hover:shadow-black/25 relative">
                {priority.isPriority && (
                    <div className='absolute left-1 top-1 bg-black text-white px-4 py-1 rounded-lg'>
                        <span>{priority?.priorityLabel}</span>
                    </div>
                )}
                <div className='text-center'>
                    <img src={menuImg} alt={"DISH"} className='max-h-auto max-h-24 block mx-auto rounded-md object-fill' />
                </div>
                <h4 className='font-semibold text-lg my-3 text-wrap'>{itemName}</h4>
                <p className='text-slate-500 text-sm text-wrap line-clamp-3'>
                    {itemDesc}
                </p>
                <button 
                    type='button'
                    onClick={() => handleAddToCart(item)}
                    className="bg-primary text-white rounded-full px-4 py-2 mt-4"
                    >
                    Add to cart &#8377; {itemPrice}/-
                </button>
            </div> */}
    </>
  );
}
