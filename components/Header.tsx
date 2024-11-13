import Image from "next/image";
import { Button } from "./ui/button";
import Search from "./Search";
import FileUploader from "./FileUploader";
import { signOut } from "@/lib/actions/user.actions";
interface Props {
  $id: string;
  accountId: string;
}
const Header = ({ accountId, $id: ownerId }: Props) => {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader ownerId={ownerId} accountId={accountId} />
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button className="sign-out-button" type="submit">
            <Image
              src="/assets/icons/logout.svg"
              alt="Logout"
              width={20}
              height={20}
            />
          </Button>
        </form>
      </div>
    </header>
  );
};
export default Header;
