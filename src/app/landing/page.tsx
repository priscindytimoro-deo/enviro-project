import type { Metadata } from 'next'
import { LandingPageContent } from './landing-page-content'

// Metadata for the landing page
export const metadata: Metadata = {
  title:
    'Monitor Patuh-LH | Monitoring Kepatuhan Laporan Berkala Pelaku Usaha – DLH TTS',

  description:
    'Monitor Patuh-LH merupakan platform digital Dinas Lingkungan Hidup Kabupaten Timor Tengah Selatan untuk memantau kepatuhan pelaku usaha dalam penyampaian laporan berkala lingkungan hidup secara transparan, terintegrasi, dan akuntabel.',

  keywords: [
    'monitor patuh lh',
    'dashboard monitoring kepatuhan',
    'kepatuhan pelaku usaha',
    'laporan berkala lingkungan hidup',
    'pelaporan lingkungan digital',
    'dlh kabupaten timor tengah selatan',
    'pengawasan lingkungan hidup',
    'monitoring laporan lingkungan',
    'SPPL',
    'UKL-UPL',
    'AMDAL',
    'DLH TTS',
  ],

  authors: [
    {
      name: 'Dinas Lingkungan Hidup Kabupaten Timor Tengah Selatan',
    },
  ],

  creator: 'DLH Kabupaten Timor Tengah Selatan',

  publisher: 'Dinas Lingkungan Hidup Kabupaten Timor Tengah Selatan',

  openGraph: {
    title:
      'Monitor Patuh-LH – Dashboard Monitoring Kepatuhan Pelaku Usaha DLH Kabupaten Timor Tengah Selatan',

    description:
      'Platform digital untuk mendukung pengawasan dan pemantauan kepatuhan pelaku usaha dalam penyampaian laporan berkala lingkungan hidup secara efektif dan transparan.',

    type: 'website',

    locale: 'id_ID',

    siteName: 'Monitor Patuh-LH',
  },

  twitter: {
    card: 'summary_large_image',

    title:
      'Monitor Patuh-LH – Dashboard Monitoring Kepatuhan Pelaku Usaha DLH Kabupaten Timor Tengah Selatan',

    description:
      'Platform digital untuk mendukung pengawasan dan pemantauan kepatuhan pelaku usaha dalam penyampaian laporan berkala lingkungan hidup secara efektif dan transparan.',
  },
}

export default function LandingPage() {
  return <LandingPageContent />
}