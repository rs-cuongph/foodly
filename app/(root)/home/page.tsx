import OrderList from "@/components/molecules/OrderList";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Input } from "@nextui-org/react";

export default function HomePage() {
  return (
    <>
      <div>
        <Input
          type="text"
          label=""
          placeholder="Type to search..."
          labelPlacement="outside"
          className="w-[250px] "
          classNames={{
            inputWrapper: ["!bg-white"],
          }}
          startContent={
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-500 pointer-events-none flex-shrink-0" />
          }
        />
      </div>
      <div className="mt-5">
        {/* <div className="bg-white p-2 rounded text-center text-[14px]">
          Not Found
        </div> */}
        <OrderList></OrderList>
      </div>
    </>
  );
}
