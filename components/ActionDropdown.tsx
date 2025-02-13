"use client";
import { Models } from "node-appwrite";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useState } from "react";
import Image from "next/image";
import { actionsDropdownItems } from "@/constants";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  deleteFile,
  renameFile,
  updatedFileUsers,
} from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { FileDetails, ShareInput } from "./ActionsModalContent";

const ActionDropdown = ({ file }: { file: Models.Document }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [isloading, setIsloading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);

  const pathname = usePathname();
  const closeAllModals = () => {
    setIsDialogOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
  };

  const handleAction = async () => {
    if (!action) return;

    setIsloading(true);
    let success = false;

    const actions = {
      rename: () =>
        renameFile({
          fileId: file.$id,
          name: name,
          extension: file.extension,
          path: pathname,
        }),
      share: () =>
        updatedFileUsers({ fileId: file.$id, emails: emails, path: pathname }),
      delete: () =>
        deleteFile({
          fileId: file.$id,
          bucketFileId: file.bucketFile,
          path: pathname,
        }),
    };
    success = await actions[action.value as keyof typeof actions]();

    if (success) closeAllModals();
    setIsloading(false);
  };

  const handleRemoveUser = async (email: string) => {
    const updatedEmails = emails.filter((e) => e !== email);

    const success = await updatedFileUsers({
      fileId: file.$id,
      emails: updatedEmails,
      path: pathname,
    });

    if (success) setEmails(updatedEmails);

    closeAllModals();
  };

  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;

    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>

          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {value === "details" && <FileDetails file={file} />}
          {value === "share" && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}

          {value === "delete" && (
            <p className="delete-confirmation">
              Are you sure you want to delete this file{" "}
              <span className="delete-file-name">{file.name}</span>?
            </p>
          )}
        </DialogHeader>
        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllModals} className="modal-cancel-button">
              Cancel
            </Button>
            <Button onClick={handleAction} className="modal-submit-button">
              <p className="capitalize">{value}</p>
              {isloading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="ml-2 animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="More"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((item) => (
            <DropdownMenuItem
              className="shad-dropdown-item"
              key={item.value}
              onClick={() => {
                setAction(item);
                if (
                  ["rename", "share", "delete", "details"].includes(item.value)
                ) {
                  setIsDialogOpen(true);
                }
              }}
            >
              {item.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFile)}
                  download={file.name}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={item.icon}
                    alt={action?.label || "icon"}
                    width={34}
                    height={34}
                  />
                  {item.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={item.icon}
                    alt={action?.label || "icon"}
                    width={34}
                    height={34}
                  />
                  {item.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
};
export default ActionDropdown;
