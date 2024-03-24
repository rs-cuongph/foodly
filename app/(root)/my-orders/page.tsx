"use client";

import MyGroupOrderList from "@/components/molecules/MyGroupOrderList";
import SearchHeaderHome from "@/components/molecules/SearchHome";

export default function MyOrdersPage() {
  return (
    <>
      <SearchHeaderHome />
      <div className="mt-5">
        <MyGroupOrderList />
      </div>
    </>
  );
}
