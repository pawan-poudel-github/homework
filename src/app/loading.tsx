import { Loader2 } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className="container mt-24 flex justify-center">
      <Loader2
        strokeWidth={2.2}
        height={30}
        width={30}
        className="animate-spin"
      />
    </div>
  );
};

export default loading;
