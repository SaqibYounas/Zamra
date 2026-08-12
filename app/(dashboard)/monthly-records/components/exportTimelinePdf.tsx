'use client';

import { pdf } from '@react-pdf/renderer';

import { TimelineDay } from '../../timelineTypes';
import TimelineReportPdf from './TimelineReportPdf';

/**
 * Renders the timeline PDF entirely in the browser (no server round-trip
 * needed) and triggers a download. Called from TimelineTable's
 * "Export PDF" button.
 */
export async function downloadTimelinePdf(
  monthLabel: string,
  days: TimelineDay[]
): Promise<void> {
  const blob = await pdf(
    <TimelineReportPdf monthLabel={monthLabel} days={days} />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const filename = `stock-timeline-${monthLabel.replace(/\s+/g, '-').toLowerCase()}.pdf`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}
