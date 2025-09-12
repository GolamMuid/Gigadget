import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
  title: "Gigadget - Store Dashboard",
  description: "Gigadget - Store Dashboard",
};

export default function RootAdminLayout({ children }) {
  return (
    <>
      <StoreLayout>{children}</StoreLayout>
    </>
  );
}
