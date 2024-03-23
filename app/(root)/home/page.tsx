import ModalCreateRoom from "@/components/molecules/ModalCreateRoom";
import GroupOrderList from "@/components/molecules/GroupOrderList";
import SearchHeaderHome from "@/components/molecules/SearchHome";

export default function HomePage() {
  return (
    <>
      <SearchHeaderHome />
      <div className="mt-5">
        <GroupOrderList />
      </div>
    </>
  );
}
