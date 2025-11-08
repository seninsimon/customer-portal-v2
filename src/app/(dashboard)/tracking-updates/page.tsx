import { Suspense } from "react";
import AWBDashboard from "@/components/AWBDashboard";

export const dynamic = "force-dynamic"; // optional but helps avoid pre-render issues

export default function TrackingUpdatesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading tracking updates...</div>}>
      <AWBDashboard />
    </Suspense>
  );
}
