"use client";

import { Disclosure } from "@headlessui/react";
import {
  CalendarIcon,
  ChartPieIcon,
  ChevronRightIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  HomeModernIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

type NavigatinItem = {
  name: string;
  href?: string;
  icon?: any;
  current?: boolean;
  children?: {
    name: string;
    href: string;
    current: boolean;
  }[];
};

const navigations: NavigatinItem[] = [
  { name: "Home", href: "/", icon: HomeIcon, current: true },
  {
    name: "Inventory",
    icon: HomeModernIcon,
    current: false,
    children: [
      { name: "Dashboard", href: "/inventory", current: false },
      { name: "Products", href: "/inventory/products", current: false },
      { name: "Incomings", href: "/inventory/incomings", current: false },
      { name: "Outgoings", href: "/inventory/outgoings", current: false },
    ],
  },
  {
    name: "Teams",
    icon: UsersIcon,
    current: false,
    children: [
      { name: "Dashboard", href: "/teams", current: false },
      { name: "Human Resources", href: "#", current: false },
      { name: "Customer Success", href: "#", current: false },
    ],
  },
  { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
  { name: "Documents", href: "#", icon: DocumentDuplicateIcon, current: false },
  { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const NavLinks = () => {
  const pathname = usePathname();

  navigations.forEach((item) => {
    if (item.href === pathname) {
      item.current = true;
    } else {
      item.current = false;
      item.children?.forEach((subItem) => {
        if (subItem.href === pathname) {
          subItem.current = true;
          item.current = true;
        }
      });
    }
  });
  return (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="-mx-2 space-y-1">
        {navigations.map((item) => (
          <li key={item.name}>
            {!item.children ? (
              <a
                href={item.href}
                className={classNames(
                  item.current ? "bg-gray-50" : "hover:bg-gray-50",
                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700"
                )}
              >
                <item.icon
                  className="h-6 w-6 shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                {item.name}
              </a>
            ) : (
              <Disclosure as="div">
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      className={classNames(
                        item.current ? "bg-gray-50" : "hover:bg-gray-50",
                        "flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700"
                      )}
                    >
                      <item.icon
                        className="h-6 w-6 shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      {item.name}
                      <ChevronRightIcon
                        className={classNames(
                          open ? "rotate-90 text-gray-500" : "text-gray-400",
                          "ml-auto h-5 w-5 shrink-0"
                        )}
                        aria-hidden="true"
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel as="ul" className="mt-1 px-2">
                      {item.children?.map((subItem) => (
                        <li key={subItem.name}>
                          {/* 44px */}
                          <Disclosure.Button
                            as="a"
                            href={subItem.href}
                            className={classNames(
                              subItem.current
                                ? "bg-gray-50"
                                : "hover:bg-gray-50",
                              "block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-gray-700"
                            )}
                          >
                            {subItem.name}
                          </Disclosure.Button>
                        </li>
                      ))}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavLinks;
