/**
 * Typed navigation utilities from next-intl.
 *
 * `createNavigation(routing)` returns locale-aware drop-in replacements
 * for next/link, useRouter, redirect, getPathname, etc. Critical for
 * localised pathnames: passing `{ pathname: '/create-website' }` to
 * `<Link>` automatically resolves to `/pt-BR/criar-site` or
 * `/en/build-a-website` depending on the active locale.
 *
 * Existing components that use bare `next/link` with hardcoded
 * `/${locale}/path` strings continue to work — this is opt-in.
 */

import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
