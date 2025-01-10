import { UserRole } from "@prisma/client";
import { fetchUsersByRole } from "../../actions";
import UserTable from "../../_components/UserTable";

export default async function Page() {
  const result = await fetchUsersByRole(UserRole.SHOPMANAGER);

  if (!result.success) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {result.error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <UserTable users={result.data} title="Shop Manager" />
    </div>
  );
}
