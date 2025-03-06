import Image from "next/image";
import React from "react";

type Props = {
  coverImage: string;
};

const Collection = ({ coverImage }: Props) => {
  return (
    <div className="relative h-[200px] w-[250px] border border-dashed rounded-3xl p-5">
      <Image
        src={coverImage}
        alt="Place hodler"
        fill
        className="object-cover rounded-3xl"
      />
    </div>
  );
};

export default Collection;
