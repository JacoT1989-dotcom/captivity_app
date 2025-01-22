import React, { Suspense } from "react";
import AdminPanel from "./AdminPanel";
import { getRecentActivities } from "./activity/actions";

interface PageProps {
  searchParams: { page?: string };
}

const Page = async ({ searchParams }: PageProps) => {
  const page = Number(searchParams.page) || 1;
  const { activities, pagination } = await getRecentActivities(page);

  return (
    <div className="mx-10 bg-background">
      <Suspense fallback={<div>Loading...</div>}>
        <AdminPanel initialActivities={activities} pagination={pagination} />
      </Suspense>
    </div>
  );
};

export default Page;
