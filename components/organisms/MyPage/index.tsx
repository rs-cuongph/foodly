"use client";

import { Scroller } from "@/components/atoms/Scroller";
import MyDebtHistory from "@/components/molecules/MyDebtHistory";
import PaymentSetting from "@/components/molecules/PaymentSetting";
import UserInformation from "@/components/molecules/UserInformation";
import { useWindowSize } from "@/hooks/window-size";

export default function MyPageOrg() {
  const { isMobile } = useWindowSize();

  return (
    <Scroller height={`calc(100vh - ${isMobile ? 130 : 100}px)`}>
      <div className="flex gap-2 flex-col">
        <UserInformation />
        <PaymentSetting />
        <MyDebtHistory />
      </div>
    </Scroller>
  );
}
