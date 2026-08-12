import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

import { BOTTLE_SIZES, BottleSize, TimelineDay } from './timelineTypes';

const COLORS = {
  ink: '#1e293b',
  muted: '#64748b',
  accent: '#0ea5e9',
  border: '#e2e8f0',
  headerBg: '#f1f5f9',
};

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 9,
    color: COLORS.ink,
    fontFamily: 'Helvetica',
  },

  coverEyebrow: {
    fontSize: 9,
    color: COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 6,
    fontFamily: 'Helvetica-Bold',
  },
  coverTitle: { fontSize: 24, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  coverSubtitle: { fontSize: 11, color: COLORS.muted, marginBottom: 24 },

  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  summaryCard: {
    width: '31%',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
  },
  summaryLabel: {
    fontSize: 8,
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryValue: { fontSize: 14, fontFamily: 'Helvetica-Bold' },
  summaryFootnote: { fontSize: 8, color: COLORS.muted, marginTop: 2 },

  note: { marginTop: 16, fontSize: 8, color: COLORS.muted },

  sectionTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  sectionSubtitle: { fontSize: 9, color: COLORS.muted, marginBottom: 12 },

  table: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 4 },
  tr: { flexDirection: 'row' },
  th: {
    flex: 1,
    backgroundColor: COLORS.headerBg,
    padding: 5,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.muted,
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    textAlign: 'right',
  },
  thDay: { flex: 0.6, textAlign: 'left' },
  td: {
    flex: 1,
    padding: 5,
    fontSize: 8.5,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    textAlign: 'right',
  },
  tdDay: { flex: 0.6, textAlign: 'left', fontFamily: 'Helvetica-Bold' },

  footer: {
    position: 'absolute',
    bottom: 20,
    left: 32,
    right: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: COLORS.muted,
  },
});

interface Props {
  monthLabel: string;
  days: TimelineDay[];
}

function sumMetric(
  days: TimelineDay[],
  size: BottleSize,
  key: 'cost' | 'profit'
): number {
  return days.reduce((total, day) => total + day.bottles[size][key], 0);
}

export default function TimelineReportPdf({ monthLabel, days }: Props) {
  const generatedAt = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Document>
      {/* Cover / summary page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.coverEyebrow}>Production &amp; Sales</Text>
        <Text style={styles.coverTitle}>Monthly Stock Timeline</Text>
        <Text style={styles.coverSubtitle}>
          {monthLabel} · Generated {generatedAt}
        </Text>

        <View style={styles.summaryGrid}>
          {BOTTLE_SIZES.map((size) => (
            <View key={size} style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{size}</Text>
              <Text style={styles.summaryValue}>
                Rs {sumMetric(days, size, 'profit').toLocaleString()}
              </Text>
              <Text style={styles.summaryFootnote}>
                profit · Rs {sumMetric(days, size, 'cost').toLocaleString()}{' '}
                cost
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.note}>
          Detailed day-by-day figures for each bottle size follow on the next
          pages.
        </Text>

        <View style={styles.footer} fixed>
          <Text>Stock Timeline Report</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>

      {/* One detail page per bottle size */}
      {BOTTLE_SIZES.map((size) => (
        <Page key={size} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>{size}</Text>
          <Text style={styles.sectionSubtitle}>
            {monthLabel} · daily stock, price, sales, cost and profit
          </Text>

          <View style={styles.table}>
            <View style={styles.tr} fixed>
              <Text style={[styles.th, styles.thDay]}>Day</Text>
              <Text style={styles.th}>Stock</Text>
              <Text style={styles.th}>Price</Text>
              <Text style={styles.th}>Sold</Text>
              <Text style={styles.th}>Cost</Text>
              <Text style={styles.th}>Profit</Text>
            </View>

            {days.map((day) => {
              const m = day.bottles[size];
              return (
                <View key={day.day} style={styles.tr} wrap={false}>
                  <Text style={[styles.td, styles.tdDay]}>{day.day}</Text>
                  <Text style={styles.td}>{m.stock.toLocaleString()}</Text>
                  <Text style={styles.td}>Rs {m.price.toLocaleString()}</Text>
                  <Text style={styles.td}>{m.sold.toLocaleString()}</Text>
                  <Text style={styles.td}>Rs {m.cost.toLocaleString()}</Text>
                  <Text style={styles.td}>Rs {m.profit.toLocaleString()}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.footer} fixed>
            <Text>Stock Timeline Report · {size}</Text>
            <Text
              render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} of ${totalPages}`
              }
            />
          </View>
        </Page>
      ))}
    </Document>
  );
}
