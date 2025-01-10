import { Loader2 } from "lucide-react";
import React from "react";

export const LoadingSpinner = React.memo(() => (
  <div className="flex justify-center items-center">
    <Loader2 className="h-4 w-4 animate-spin" />
  </div>
));

LoadingSpinner.displayName = "LoadingSpinner";
