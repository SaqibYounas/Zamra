'use client';

import { pdf } from '@react-pdf/renderer';

import { TimelineDay } from '../../types/timeline';
import TimelineReportPdf from './TimelineReportPdf';

/**
 * Renders the timeline PDF in the browser and triggers a download; called from
 * TimelineTable's "Export PDF" button.
 */
export async function downloadTimelinePdf(
  monthLabel: string,
  days: TimelineDay[],
  isPlaceholder = false
): Promise<void> {
  const blob = await pdf(
    <TimelineReportPdf
      monthLabel={monthLabel}
      days={days}
      isPlaceholder={isPlaceholder}
    />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const filename = `${
    isPlaceholder ? 'SAMPLE-' : ''
  }stock-timeline-${monthLabel.replace(/\s+/g, '-').toLowerCase()}.pdf`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}
