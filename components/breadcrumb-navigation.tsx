'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface RouteSegment {
  name: string;
  path: string;
}

const routeMap: Record<string, string> = {
  'doctor': 'Doctor Portal',
  'patient': 'Patient Portal',
  'network': 'Healthcare Network',
  'access-portal': 'Access Portal',
  'nft-panel': 'NFT Panel',
  'onboarding': 'Onboarding',
  'health-passport': 'Health Passport',
  'medical-records': 'Medical Records',
  'emergency-access': 'Emergency Access',
};

export function BreadcrumbNavigation() {
  const pathname = usePathname();
  
  // Skip rendering breadcrumbs on the home page or if pathname is not available yet
  if (!pathname || pathname === '/') {
    return null;
  }
  
  // Split the pathname into segments and create breadcrumb items
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbItems: RouteSegment[] = [];
  
  // Safely build breadcrumb items
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (!segment) continue;
    
    const path = `/${segments.slice(0, i + 1).join('/')}`;
    const name = routeMap[segment] || 
                segment.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    
    breadcrumbItems.push({ name, path });
  }
  
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path}>
            {index === breadcrumbItems.length - 1 ? (
              <BreadcrumbItem key={`${item.path}-page`}>
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem key={`${item.path}-page`}>
                <BreadcrumbLink asChild>
                  <Link href={item.path}>{item.name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}