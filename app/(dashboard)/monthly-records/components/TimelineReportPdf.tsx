import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

import { BOTTLE_TYPES, BottleType, TimelineDay } from '../../types/timeline';

// Print palette; @react-pdf cannot read the app's CSS tokens.
const COLORS = {
  navy: '#0f172a', // header/footer band
  ink: '#1e293b',
  muted: '#64748b',
  subtle: '#94a3b8',
  border: '#e2e8f0',
  panel: '#f8fafc',
  white: '#ffffff',

  // profit / loss
  profitBg: '#dcfce7',
  profitText: '#15803d',
  lossBg: '#fee2e2',
  lossText: '#b91c1c',
};

// One accent color per bottle size — reused on the cover summary cards and
// on each detail page's header band so the report reads consistently.
const ACCENTS: Record<BottleType, string> = {
  '500ml': '#0ea5e9', // sky
  '1.5L': '#8b5cf6', // violet
  '5L': '#f59e0b', // amber
  '19L': '#ec4899', // pink
  '19L Refill': '#14b8a6', // teal
};

const styles = StyleSheet.create({
  page: { fontSize: 9, color: COLORS.ink, fontFamily: 'Helvetica' },
  body: { padding: '24 32 20 32' },

  // ---- header band (every page) ----
  headerBand: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 32,
    paddingTop: 22,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 10, height: 10, borderRadius: 5 },
  brandText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  headerTitle: { fontSize: 10, color: '#cbd5e1' },

  // ---- cover page ----
  coverEyebrow: {
    fontSize: 9,
    color: '#38bdf8',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 6,
    fontFamily: 'Helvetica-Bold',
  },
  coverTitle: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    color: COLORS.ink,
  },
  coverSubtitle: { fontSize: 11, color: COLORS.muted, marginBottom: 26 },

  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  summaryCard: {
    width: '31%',
    backgroundColor: COLORS.panel,
    borderRadius: 8,
    borderLeftWidth: 4,
    padding: 12,
  },
  summaryLabel: {
    fontSize: 8,
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    fontFamily: 'Helvetica-Bold',
  },
  summaryValue: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 3,
    color: COLORS.ink,
  },
  summaryFootnote: { fontSize: 8, color: COLORS.muted },

  statusPill: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  note: { marginTop: 20, fontSize: 8, color: COLORS.subtle },
  sampleStamp: {
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
    backgroundColor: COLORS.lossBg,
    color: COLORS.lossText,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  legendRow: { flexDirection: 'row', gap: 16, marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendSwatch: { width: 8, height: 8, borderRadius: 2 },
  legendLabel: { fontSize: 8, color: COLORS.muted },

  // ---- detail pages ----
  sectionBand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.ink,
  },
  sectionSubtitle: { fontSize: 8.5, color: COLORS.muted, marginTop: 1 },
  sectionTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  table: {
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tr: { flexDirection: 'row' },
  th: {
    flex: 1,
    backgroundColor: COLORS.navy,
    padding: 6,
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#cbd5e1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'right',
  },
  thDay: { flex: 0.6, textAlign: 'left', color: COLORS.white },
  td: {
    flex: 1,
    padding: 6,
    fontSize: 8.5,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    textAlign: 'right',
  },
  tdDay: {
    flex: 0.6,
    textAlign: 'left',
    fontFamily: 'Helvetica-Bold',
    color: COLORS.ink,
  },
  tdProfit: { fontFamily: 'Helvetica-Bold' },
  rowEven: { backgroundColor: COLORS.white },
  rowOdd: { backgroundColor: COLORS.panel },

  // ---- footer band (every page) ----
  footerBand: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 32,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7.5,
    color: COLORS.subtle,
  },
});

interface Props {
  monthLabel: string;
  days: TimelineDay[];
  /**
   * Stamps the cover when the figures are locally generated. A PDF leaves the
   * app and looks authoritative, so it must carry the warning with it.
   */
  isPlaceholder?: boolean;
}

function sumMetric(
  days: TimelineDay[],
  size: BottleType,
  key: 'cost' | 'profit'
): number {
  return days.reduce((total, day) => total + day.bottles[size][key], 0);
}

function HeaderBand({ label }: { label: string }) {
  return (
    <View style={styles.headerBand} fixed>
      <View style={styles.brandRow}>
        <View style={[styles.brandMark, { backgroundColor: '#38bdf8' }]} />
        <Text style={styles.brandText}>Zamra</Text>
      </View>
      <Text style={styles.headerTitle}>{label}</Text>
    </View>
  );
}

function FooterBand({ label }: { label: string }) {
  return (
    <View style={styles.footerBand} fixed>
      <Text>{label}</Text>
      <Text
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`
        }
      />
    </View>
  );
}

export default function TimelineReportPdf({
  monthLabel,
  days,
  isPlaceholder = false,
}: Props) {
  const generatedAt = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const totalProfit = BOTTLE_TYPES.reduce(
    (t, size) => t + sumMetric(days, size, 'profit'),
    0
  );

  return (
    <Document>
      {/* Cover / summary page */}
      <Page size="A4" style={styles.page}>
        <HeaderBand label="Monthly Stock Timeline" />

        <View style={styles.body}>
          <Text style={styles.coverEyebrow}>Production &amp; Sales</Text>
          <Text style={styles.coverTitle}>Monthly Stock Timeline</Text>

          {isPlaceholder ? (
            <Text style={styles.sampleStamp}>
              SAMPLE DATA — these figures are generated for layout purposes and
              are not real production records.
            </Text>
          ) : null}
          <Text style={styles.coverSubtitle}>
            {monthLabel} · Generated {generatedAt}
          </Text>

          <View style={styles.summaryGrid}>
            {BOTTLE_TYPES.map((size) => {
              const profit = sumMetric(days, size, 'profit');
              const cost = sumMetric(days, size, 'cost');
              const isProfit = profit >= 0;

              return (
                <View
                  key={size}
                  style={[
                    styles.summaryCard,
                    { borderLeftColor: ACCENTS[size] },
                  ]}
                >
                  <Text style={styles.summaryLabel}>{size}</Text>
                  <Text
                    style={[
                      styles.summaryValue,
                      { color: isProfit ? COLORS.profitText : COLORS.lossText },
                    ]}
                  >
                    Rs {Math.abs(profit).toLocaleString()}
                  </Text>
                  <Text style={styles.summaryFootnote}>
                    Rs {cost.toLocaleString()} cost
                  </Text>
                  <Text
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: isProfit
                          ? COLORS.profitBg
                          : COLORS.lossBg,
                        color: isProfit ? COLORS.profitText : COLORS.lossText,
                      },
                    ]}
                  >
                    {isProfit ? 'Profit' : 'Loss'}
                  </Text>
                </View>
              );
            })}
          </View>

          <View
            style={[
              styles.summaryCard,
              {
                width: '100%',
                marginTop: 14,
                borderLeftColor:
                  totalProfit >= 0 ? COLORS.profitText : COLORS.lossText,
              },
            ]}
          >
            <Text style={styles.summaryLabel}>Overall for {monthLabel}</Text>
            <Text
              style={[
                styles.summaryValue,
                {
                  fontSize: 18,
                  color: totalProfit >= 0 ? COLORS.profitText : COLORS.lossText,
                },
              ]}
            >
              Rs {Math.abs(totalProfit).toLocaleString()}{' '}
              {totalProfit >= 0 ? 'profit' : 'loss'}
            </Text>
          </View>

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendSwatch,
                  { backgroundColor: COLORS.profitBg },
                ]}
              />
              <Text style={styles.legendLabel}>Profitable day</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendSwatch,
                  { backgroundColor: COLORS.lossBg },
                ]}
              />
              <Text style={styles.legendLabel}>Loss-making day</Text>
            </View>
          </View>

          <Text style={styles.note}>
            Detailed day-by-day figures for each bottle size follow on the next
            pages. The Profit column is shaded green on profitable days and red
            on days that ran at a loss.
          </Text>
        </View>

        <FooterBand label="Stock Timeline Report" />
      </Page>

      {/* One detail page per bottle size */}
      {BOTTLE_TYPES.map((size) => (
        <Page key={size} size="A4" style={styles.page}>
          <HeaderBand label="Monthly Stock Timeline" />

          <View style={styles.body}>
            <View style={styles.sectionBand}>
              <View>
                <Text style={styles.sectionTitle}>{size}</Text>
                <Text style={styles.sectionSubtitle}>
                  {monthLabel} · daily stock, price, sales, cost and profit
                </Text>
              </View>
              <Text
                style={[styles.sectionTag, { backgroundColor: ACCENTS[size] }]}
              >
                {size}
              </Text>
            </View>

            <View style={styles.table}>
              <View style={styles.tr} fixed>
                <Text style={[styles.th, styles.thDay]}>Day</Text>
                <Text style={styles.th}>Stock</Text>
                <Text style={styles.th}>Price</Text>
                <Text style={styles.th}>Sold</Text>
                <Text style={styles.th}>Cost</Text>
                <Text style={styles.th}>Profit</Text>
              </View>

              {days.map((day, idx) => {
                const m = day.bottles[size];
                const isProfit = m.profit >= 0;
                const rowStyle = idx % 2 === 1 ? styles.rowOdd : styles.rowEven;

                return (
                  <View key={day.day} style={[styles.tr, rowStyle]} wrap>
                    <Text style={[styles.td, styles.tdDay]}>{day.day}</Text>
                    <Text style={styles.td}>{m.stock.toLocaleString()}</Text>
                    <Text style={styles.td}>Rs {m.price.toLocaleString()}</Text>
                    <Text style={styles.td}>{m.sold.toLocaleString()}</Text>
                    <Text style={styles.td}>Rs {m.cost.toLocaleString()}</Text>
                    <Text
                      style={[
                        styles.td,
                        styles.tdProfit,
                        {
                          backgroundColor: isProfit
                            ? COLORS.profitBg
                            : COLORS.lossBg,
                          color: isProfit ? COLORS.profitText : COLORS.lossText,
                        },
                      ]}
                    >
                      {isProfit ? '' : '-'}Rs{' '}
                      {Math.abs(m.profit).toLocaleString()}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <FooterBand label={`Stock Timeline Report · ${size}`} />
        </Page>
      ))}
    </Document>
  );
}
