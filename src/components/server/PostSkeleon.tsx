import React from "react";
import { Skeleton } from "../ui/skeleton";

const PostSkeleon = () => {
  return (
    <div className="grid gap-y-4 px-4">
      <div className="flex items-center space-x-4 w-full p-2 shadow-sm rounded-md">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-2 w-48" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="flex items-center space-x-4 w-full p-2 shadow-sm rounded-md">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-2 w-48" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="flex items-center space-x-4 w-full p-2 shadow-sm rounded-md">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-2 w-48" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="flex items-center space-x-4 w-full p-2 shadow-sm rounded-md">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-2 w-48" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
};

export default PostSkeleon;
