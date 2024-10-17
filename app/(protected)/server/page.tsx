import { UserInfo } from "@/components/user-info";
import { currentuser } from "@/lib/auth";

export default async function ServerPage() {
  const user = await currentuser();

  return <UserInfo user={user} label="Server component" />;
}
