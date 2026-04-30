"use client";

import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";

export default function NavbarRight() {
  return (
    <div className="flex items-center gap-4">
      <NotificationBell />
      <UserMenu />
    </div>
  );
}