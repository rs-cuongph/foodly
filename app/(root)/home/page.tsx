import ModalCreateRoom from "@/components/molecules/ModalCreateRoom";
import OrderList from "@/components/molecules/OrderList";
import SearchHeaderHome from "@/components/molecules/SearchHome";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Input } from "@nextui-org/react";

export default function HomePage() {
  return (
    <>
      <SearchHeaderHome />
      <div className="mt-5">
        <OrderList />
      </div>
    </>
  );
}
