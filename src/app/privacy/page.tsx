import React from 'react';
import fs from 'fs';
import path from 'path';
import { PolicyLayout } from '@/components/layout/PolicyLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - routemate.top',
  description: 'routemate.top Privacy Policy regarding Google login and local storage user data.',
};

export default function PrivacyPage() {
  const filePath = path.join(process.cwd(), 'PRIVACY.md');
  const markdownContent = fs.readFileSync(filePath, 'utf8');

  return <PolicyLayout title="Privacy Policy" markdownContent={markdownContent} />;
}
