import ModalCreateRoom from "@/components/molecules/ModalCreateRoom";
import OrderList from "@/components/molecules/OrderList";
import SearchHeaderHome from "@/components/molecules/SearchHome";

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
