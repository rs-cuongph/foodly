import MyDebtHistory from "@/components/molecules/MyDebtHistory";
import PaymentSetting from "@/components/molecules/PaymentSetting";
import UserInformation from "@/components/molecules/UserInformation";

export default function MyPage() {
  return (
    <div className="flex gap-2 flex-col">
      <UserInformation />
      <PaymentSetting />
      <MyDebtHistory />
    </div>
  );
}
