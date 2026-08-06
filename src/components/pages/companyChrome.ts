import {
  Boxes,
  ChefHat,
  ClipboardCheck,
  Container,
  Forklift,
  Home,
  Layers,
  Package,
  Settings,
  Ship,
  Truck,
  Users,
  Warehouse,
  Wrench,
  Zap,
} from 'lucide-react';
import type { MediaTag } from '../../data/media';
import type { LucideIcon } from 'lucide-react';
import { COMPANY_BY_ID, type CompanyId } from '../../data/companies';
import type { MediaQuery } from '../../data/media';
import type { HeroOverlay } from '../ui/PageHero';

/**
 * Everything visual that differs between the three companies, in one place.
 *
 * The section markup is identical across all three — only these four axes (hero
 * treatment, texture, surface temperature and iconography) vary, which is what makes
 * the group read as one brand rather than three sites.
 */
export interface CompanyChrome {
  overlay: HeroOverlay;
  texture: 'grain' | 'hatch' | 'none';
  /** Alternating section surface. Warm, neutral and cool respectively. */
  surface: string;
  hero: string;
  serviceIcons: Record<string, LucideIcon>;
  /**
   * Where each service tile actually goes, relative to the company root.
   *
   * Every tile used to point at `/services`, so a tile with its own icon, title and
   * "Know more" delivered the generic list instead — eight identical links on one page.
   * Anything not listed here falls back to `/services`, which is the honest destination
   * when no deeper page exists yet.
   */
  serviceLinks: Record<string, string>;
  featureKeys: string[];
  statKeys: string[];
  photos: MediaQuery;
}

export const companyChrome: Record<CompanyId, CompanyChrome> = {
  transport: {
    overlay: 'sweep',
    texture: 'grain',
    surface: 'bg-sand',
    hero: COMPANY_BY_ID.transport.heroImage,
    serviceIcons: { crossBorder: Truck, bulk: Ship, projectCargo: Layers, general: Package },
    serviceLinks: {
      crossBorder: '/routes',
      bulk: '/cargo',
      projectCargo: '/fleet',
      general: '/fleet',
    },
    featureKeys: ['reach', 'fleet', 'cargo', 'control'],
    statKeys: ['years', 'trucks', 'clients', 'loads'],
    photos: { company: 'transport' },
  },
  'project-services': {
    overlay: 'lift',
    texture: 'none',
    surface: 'bg-ink-50',
    hero: COMPANY_BY_ID['project-services'].heroImage,
    serviceIcons: {
      manpower: Users,
      camps: Home,
      infrastructure: Zap,
      catering: ChefHat,
      caravans: Warehouse,
      equipment: Wrench,
      siteTransport: Truck,
      operations: Settings,
    },
    serviceLinks: {
      camps: '/camps',
      infrastructure: '/camps',
      accommodation: '/camps',
      caravans: '/camps',
      catering: '/catering',
      projects: '/projects',
    },
    featureKeys: ['endToEnd', 'mobilise', 'manufacture', 'scale'],
    statKeys: ['workforce', 'camps', 'meals', 'years'],
    photos: { company: 'project-services' },
  },
  logistics: {
    overlay: 'diagonal',
    texture: 'hatch',
    surface: 'bg-steel',
    hero: COMPANY_BY_ID.logistics.heroImage,
    serviceIcons: {
      crossBorder: Container,
      lifting: Forklift,
      clearance: ClipboardCheck,
      coordination: Boxes,
    },
    serviceLinks: {
      crossBorder: '/crossings',
      lifting: '/equipment',
      clearance: '/customs',
    },
    featureKeys: ['coverage', 'equipment', 'crews', 'paperwork'],
    statKeys: ['crossings', 'forklifts', 'capacity', 'hours'],
    photos: { company: 'logistics' },
  },
};

/**
 * The deep-dive pages behind each company's "Know more" links.
 *
 * `items` is the order the copy renders in; `tags` narrows the page's photo strip to
 * what it is actually about, falling back to the company's own photos while the library
 * is still being tagged.
 */
export interface CompanySection {
  company: CompanyId;
  /** Key under <company>.sections.* in the locale files, and the last URL segment. */
  key: string;
  items: string[];
  tags: MediaTag[];
}

export const COMPANY_SECTIONS: CompanySection[] = [
  {
    company: 'transport',
    key: 'fleet',
    items: ['flatbed', 'curtainSider', 'tippers', 'lowbeds', 'tankers', 'maintenance'],
    tags: ['fleet'],
  },
  {
    company: 'transport',
    key: 'routes',
    items: ['central', 'western', 'eastern', 'domestic'],
    tags: ['convoy'],
  },
  {
    company: 'transport',
    key: 'cargo',
    items: ['minerals', 'chemicals', 'building', 'fmcg', 'project'],
    tags: ['loading'],
  },
  {
    company: 'project-services',
    key: 'camps',
    items: ['sitePrep', 'accommodation', 'utilities', 'facilities', 'offices', 'handover'],
    tags: ['accommodation', 'caravan', 'ablutions'],
  },
  {
    company: 'project-services',
    key: 'catering',
    items: ['kitchens', 'menus', 'supply', 'housekeeping', 'hygiene', 'shifts'],
    tags: ['kitchen', 'dining', 'laundry', 'hygiene'],
  },
  {
    company: 'logistics',
    key: 'equipment',
    items: ['forklifts', 'cranes', 'winches', 'attachments', 'crews', 'maintenance'],
    tags: ['forklift'],
  },
  {
    company: 'logistics',
    key: 'customs',
    items: ['intake', 'documents', 'submission', 'coordination', 'release', 'updates'],
    tags: ['border'],
  },
];

export const getSection = (company: CompanyId, key: string) =>
  COMPANY_SECTIONS.find((s) => s.company === company && s.key === key);

export const serviceKeys: Record<CompanyId, string[]> = {
  transport: Object.keys(companyChrome.transport.serviceIcons),
  'project-services': Object.keys(companyChrome['project-services'].serviceIcons),
  logistics: Object.keys(companyChrome.logistics.serviceIcons),
};
