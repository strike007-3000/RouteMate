import React from 'react';
import fs from 'fs';
import path from 'path';
import { PolicyLayout } from '@/components/layout/PolicyLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - routemate.top',
  description: 'routemate.top Terms of Service and user agreement.',
};

export default function TermsPage() {
  const filePath = path.join(process.cwd(), 'TERMS.md');
  const markdownContent = fs.readFileSync(filePath, 'utf8');

  return <PolicyLayout title="Terms of Service" markdownContent={markdownContent} />;
}
