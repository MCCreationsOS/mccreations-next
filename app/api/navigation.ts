import {createSharedPathnamesNavigation} from 'next-intl/navigation';
import { Locales } from './types';
 
export const {Link, redirect, usePathname, useRouter} =
  createSharedPathnamesNavigation({locales: Locales});