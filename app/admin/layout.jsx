import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
  title: "Gigadget - Admin",
  description: "Gigadget - Admin",
};

export default function RootAdminLayout({ children }) {
  return (
    <>
      <AdminLayout>{children}</AdminLayout>
    </>
  );
}
