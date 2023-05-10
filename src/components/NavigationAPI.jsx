import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'
import { Button } from '@/components/Button'
import { Tag } from '@/components/Tag'
import { remToPx } from '@/lib/remToPx'
import {useIsInsideMobileNavigation} from "@/components/MobileNavigation";

export const apiNavigation = [
  {
    title: 'Guides',
    links: [
      { title: 'Quickstart', href: '/ipa/guides/quickstart' },
      { title: 'Authentication', href: '/ipa/guides/authentication' },
      { title: 'Errors', href: '/ipa/guides/errors' },
      // { title: 'Events', href: '/accounts' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { title: 'Accounts', href: '/ipa/resources/accounts' },
      { title: 'Users', href: '/ipa/resources/users' },
      { title: 'Tokens', href: '/ipa/resources/tokens' },
      { title: 'Peers', href: '/ipa/resources/peers' },
      { title: 'Setup Keys', href: '/ipa/resources/setup-keys' },
      { title: 'Groups', href: '/ipa/resources/groups' },
      { title: 'Rules', href: '/ipa/resources/rules' },
      { title: 'Policies', href: '/ipa/resources/policies' },
      { title: 'Routes', href: '/ipa/resources/routes' },
      { title: 'DNS', href: '/ipa/resources/dns' },
      { title: 'Events', href: '/ipa/resources/events' },
    ],
  },
]

export function NavigationAPI(props) {
  return (
      <nav {...props}>
        <ul role="list">
          <TopLevelNavItem href="https://netbird.io/">Home</TopLevelNavItem>
          <TopLevelNavItem href="/docs/introductions">Docs</TopLevelNavItem>
          <TopLevelNavItem href="/ipa/introductions">API</TopLevelNavItem>
          <TopLevelNavItem href="https://netbird.io/blog/">Blog</TopLevelNavItem>
          <TopLevelNavItem href="https://github.com/netbirdio/netbird">Github</TopLevelNavItem>
          <TopLevelNavItem href="https://join.slack.com/t/netbirdio/shared_invite/zt-vrahf41g-ik1v7fV8du6t0RwxSrJ96A">Support</TopLevelNavItem>
          {apiNavigation.map((group, groupIndex) => (
                <NavigationGroup
                    key={group.title}
                    group={group}
                    tableOfContents={props.tableOfContents}
                    className={groupIndex === 0 && 'md:mt-0'}
                />
            ))}
          <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
            <Button href="https://app.netbird.io/" variant="filled" className="w-full">
              Sign in
            </Button>
          </li>
        </ul>
      </nav>
  )
}
export function TopLevelNavItem({ href, children }) {
  return (
    <li className="md:hidden">
      <Link
        href={href}
        className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}

export function NavLink({ href, tag, active, isAnchorLink = false, children }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex justify-between gap-2 py-1 pr-3 text-sm transition',
        isAnchorLink ? 'pl-7' : 'pl-4',
        active
          ? 'text-zinc-900 dark:text-white'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
      )}
    >
      <span className="truncate">{children}</span>
      {tag && (
        <Tag variant="small" color="zinc">
          {tag}
        </Tag>
      )}
    </Link>
  )
}

export function VisibleSectionHighlight({ group, pathname }) {
  let height = remToPx(2)
  let offset = remToPx(0)
  let activePageIndex = group.links.findIndex((link) => link.href === pathname)
  let top = offset + activePageIndex * height

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 top-0 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5"
      style={{ borderRadius: 8, height, top }}
    />
  )
}

export function ActivePageMarker({ group, pathname }) {
  let itemHeight = remToPx(2)
  let offset = remToPx(0.25)
  let activePageIndex = group.links.findIndex((link) => link.href === pathname)
  let top = offset + activePageIndex * itemHeight

  return (
    <motion.div
      layout
      className="absolute left-2 h-6 w-px bg-orange-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      style={{ top }}
    />
  )
}

function NavigationGroup({ group, className, tableOfContents }) {
  let router = useRouter()

  let isActiveGroup =
    group.links.findIndex((link) => link.href === router.pathname) !== -1

  return (
    <li className={clsx('relative mt-6', className)}>
      <motion.h2
        layout="position"
        className="text-xs font-semibold text-zinc-900 dark:text-white"
      >
        {group.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        <AnimatePresence >
          {isActiveGroup && (
              <VisibleSectionHighlight group={group} pathname={router.pathname} />
          )}
        </AnimatePresence>
        <motion.div
          layout
          className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
        />
        <AnimatePresence initial={false}>
          {isActiveGroup && (
            <ActivePageMarker group={group} pathname={router.pathname} />
          )}
        </AnimatePresence>
        <ul role="list" className="border-l border-transparent">
          {group.links.map((link) => (
            <motion.li key={link.href} layout="position" className="relative">
              <NavLink href={link.href} active={link.href === router.pathname}>
                {link.title}
              </NavLink>
              <AnimatePresence mode="popLayout" initial={false}>
                {link.href === router.pathname && (
                  <motion.ul
                    role="list"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { delay: 0.1 },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.15 },
                    }}
                  >
                    {router.route.startsWith("/ipa/resources") && tableOfContents.tableOfContents?.map((section) => (
                      <li key={section.id}>
                        <NavLink
                          href={`${link.href}#${section.id}`}
                          tag={section.tag}
                          isAnchorLink
                        >
                          {section.title}
                        </NavLink>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </ul>
      </div>
    </li>
  )
}



