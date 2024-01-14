import Header from "@/components/molecules/Header";
import Main from "@/components/molecules/Main";
import Sidebar from "@/components/molecules/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Main className="h-screen p-2 flex flex-row gap-4">
      <Header />
      <Sidebar />
      <div className="content overscroll-y-auto">{children}</div>
    </Main>
  );
}
