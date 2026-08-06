import { Container, HardHat, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CompanyId } from '../../data/companies';

/**
 * The icon that stands for each company, in one place.
 *
 * This map had been copy-pasted verbatim into six components, which contradicted the
 * stated purpose of companyChrome ("everything visual that differs between the three
 * companies, in one place"). It lives here rather than in companies.ts so that data
 * module stays free of lucide and remains importable from .astro frontmatter.
 */
export const companyIcons: Record<CompanyId, LucideIcon> = {
  transport: Truck,
  'project-services': HardHat,
  logistics: Container,
};
