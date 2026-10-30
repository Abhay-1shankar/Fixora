"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import classnames from "classnames";
import {
  Avatar,
  Box,
  Container,
  DropdownMenu,
  Flex,
  Text,
} from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { signOut, useSession } from "next-auth/react";
import { Skeleton } from "./components";

const NavBar = () => {
  return (
    <Container>
      <nav className="border-b border-white/5 mb-5 px-5 py-3">
        <Flex justify="between" align="center">
          <Flex align="center" gap="6">
            <Link
              href="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-zinc-900 border border-white/10 text-xs font-bold text-white tracking-tighter">
                F
              </div>
              <span className="text-zinc-100 font-semibold tracking-tight text-sm">
                Fixora
              </span>
            </Link>
            <NavLinks />
          </Flex>
          <Flex align="center" gap="4">
            <button
              onClick={() =>
                window.dispatchEvent(new CustomEvent("open-command-menu"))
              }
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 hover:bg-zinc-900 rounded-lg border border-white/5 transition-colors cursor-pointer"
              title="Search and commands (Cmd+K or Ctrl+K)"
            >
              <MagnifyingGlassIcon className="w-3.5 h-3.5" />
              <span>Search...</span>
              <kbd className="font-mono text-[10px] px-1 py-0.5 bg-zinc-950 border border-zinc-800 rounded text-zinc-400">
                ⌘K
              </kbd>
            </button>
            <AuthStatus />
          </Flex>
        </Flex>
      </nav>
    </Container>
  );
};

export default NavBar;

const AuthStatus = () => {
  const { status, data: session } = useSession();

  if (status === "loading") return <Skeleton width="3rem" />;
  if (status === "unauthenticated" || !session)
    return (
      <Link className="nav-link text-xs font-medium" href="/api/auth/signin">
        Log in
      </Link>
    );

  const user = session?.user;
  const userInitials =
    user?.name
      ? user.name
          .trim()
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <Box>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <button
            type="button"
            className="flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 cursor-pointer p-0.5 border border-transparent hover:border-white/20 transition-all active:scale-95"
            aria-label="User navigation menu"
          >
            <Avatar
              src={user?.image || undefined}
              fallback={userInitials}
              size="2"
              radius="full"
              className="ring-1 ring-white/10"
            />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="!bg-[#09090b] !border !border-white/10 !shadow-2xl min-w-[200px] p-1.5 rounded-xl z-50"
        >
          <DropdownMenu.Label className="px-2.5 py-1.5">
            {user?.name && (
              <Text size="2" weight="medium" className="text-zinc-200 block truncate">
                {user.name}
              </Text>
            )}
            <Text size="1" className="text-zinc-500 font-normal block truncate">
              {user?.email}
            </Text>
          </DropdownMenu.Label>
          <DropdownMenu.Separator className="bg-white/5 my-1" />
          <DropdownMenu.Item
            onSelect={() => signOut({ callbackUrl: "/" })}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 focus:text-white hover:text-white focus:bg-zinc-800/60 hover:bg-zinc-800/60 transition-colors cursor-pointer outline-none"
          >
            Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Box>
  );
};

const NavLinks = () => {
  const currentPath = usePathname();

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/issues/list" },
  ];

  return (
    <ul className="flex items-center gap-5 text-sm">
      {links.map((link) => {
        const isActive =
          link.href === "/"
            ? currentPath === "/"
            : currentPath.startsWith(link.href);

        return (
          <li key={link.href}>
            <Link
              className={classnames("transition-colors font-medium text-xs sm:text-sm", {
                "text-zinc-100": isActive,
                "text-zinc-400 hover:text-zinc-200": !isActive,
              })}
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
