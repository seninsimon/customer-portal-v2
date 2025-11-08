import { Suspense } from "react";
import QuoteApprovePage from "@/components/QuoteApprovePage";

export default function Page() {
  return (
    <Suspense fallback={<div></div>}>
      <div className="pt-24 sm:pt-28 md:pt-32 lg:pt-40 bg-gray-50 p-2">
        <div className="max-w-7xl mx-auto">
          <QuoteApprovePage />
        </div>
      </div>
    </Suspense>
  );
}
