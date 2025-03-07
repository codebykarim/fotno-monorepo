import { BellDotIcon } from "lucide-react";
import React from "react";

type Props = {};

const Notifications = (props: Props) => {
  return (
    <div className="bg-white rounded-full p-2 text-center">
      <BellDotIcon className="h-5 w-5 text-primary" />
    </div>
  );
};

export default Notifications;
