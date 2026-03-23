/**
 * Apple Health XML export parser.
 * Runs client-side — parses the ZIP export from iPhone Health app.
 *
 * Value codes for HKCategoryTypeIdentifierSleepAnalysis:
 *   0 = InBed
 *   1 = AsleepUnspecified
 *   2 = Awake
 *   3 = Core (Light)
 *   4 = Deep
 *   5 = REM
 */

import type { NormalizedSleepSession, HypnogramEntry } from './normalize';
import { estimateCycles } from './normalize';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SleepRecord {
  sourceName: string;
  startDate: string;
  endDate: string;
  value: string; // "HKCategoryValueSleepAnalysis..." or numeric code
  creationDate: string;
}

interface ParseProgress {
  phase: 'extracting' | 'parsing' | 'normalizing';
  percent: number;
}

// ---------------------------------------------------------------------------
// Value mapping
// ---------------------------------------------------------------------------

type SleepStage = 'inbed' | 'asleep' | 'awake' | 'light' | 'deep' | 'rem';

function mapSleepValue(value: string): SleepStage {
  // Apple Health uses both string identifiers and numeric codes
  const normalized = value.toLowerCase();

  if (normalized.includes('inbed') || value === '0') return 'inbed';
  if (normalized.includes('asleepunspecified') || value === '1') return 'asleep';
  if (normalized.includes('awake') || value === '2') return 'awake';
  if (normalized.includes('asleepcore') || value === '3') return 'light';
  if (normalized.includes('asleepdeep') || value === '4') return 'deep';
  if (normalized.includes('asleeprem') || value === '5') return 'rem';

  return 'asleep'; // Default fallback
}

// ---------------------------------------------------------------------------
// XML parsing (client-side, streaming)
// ---------------------------------------------------------------------------

function parseSleepRecordsFromXml(xmlText: string): SleepRecord[] {
  const records: SleepRecord[] = [];

  // Use regex-based extraction for performance on large XML files
  // Matches <Record type="HKCategoryTypeIdentifierSleepAnalysis" .../>
  const recordRegex = /<Record[^>]*type="HKCategoryTypeIdentifierSleepAnalysis"[^>]*\/>/g;
  let match: RegExpExecArray | null;

  while ((match = recordRegex.exec(xmlText)) !== null) {
    const tag = match[0];

    const sourceName = extractAttr(tag, 'sourceName') ?? 'Unknown';
    const startDate = extractAttr(tag, 'startDate') ?? '';
    const endDate = extractAttr(tag, 'endDate') ?? '';
    const value = extractAttr(tag, 'value') ?? '';

    if (startDate && endDate && value) {
      records.push({
        sourceName,
        startDate,
        endDate,
        value,
        creationDate: extractAttr(tag, 'creationDate') ?? startDate,
      });
    }
  }

  return records;
}

function extractAttr(tag: string, attr: string): string | null {
  const regex = new RegExp(`${attr}="([^"]*)"`, 'i');
  const match = regex.exec(tag);
  return match ? match[1] : null;
}

// ---------------------------------------------------------------------------
// Session grouping
// ---------------------------------------------------------------------------

const SESSION_GAP_MS = 30 * 60 * 1000; // 30 minutes gap = new session

interface SleepSegment {
  stage: SleepStage;
  startDate: Date;
  endDate: Date;
  durationMin: number;
}

function groupRecordsIntoSessions(records: SleepRecord[]): SleepSegment[][] {
  if (records.length === 0) return [];

  // Sort by start date
  const sorted = [...records].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  const sessions: SleepSegment[][] = [];
  let currentSession: SleepSegment[] = [];

  for (const record of sorted) {
    const start = new Date(record.startDate);
    const end = new Date(record.endDate);
    const durationMin = (end.getTime() - start.getTime()) / 60000;

    const segment: SleepSegment = {
      stage: mapSleepValue(record.value),
      startDate: start,
      endDate: end,
      durationMin,
    };

    if (currentSession.length === 0) {
      currentSession.push(segment);
    } else {
      const lastEnd = currentSession[currentSession.length - 1].endDate;
      const gap = start.getTime() - lastEnd.getTime();

      if (gap > SESSION_GAP_MS) {
        // New session
        sessions.push(currentSession);
        currentSession = [segment];
      } else {
        currentSession.push(segment);
      }
    }
  }

  if (currentSession.length > 0) {
    sessions.push(currentSession);
  }

  return sessions;
}

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

function normalizeSession(segments: SleepSegment[], index: number): NormalizedSleepSession {
  const bedtimeStart = segments[0].startDate;
  const bedtimeEnd = segments[segments.length - 1].endDate;

  let deepMin = 0;
  let lightMin = 0;
  let remMin = 0;
  let awakeMin = 0;
  let asleepUnspecifiedMin = 0;

  const hypnogram: HypnogramEntry[] = [];

  for (const seg of segments) {
    switch (seg.stage) {
      case 'deep':
        deepMin += seg.durationMin;
        hypnogram.push({
          timestamp: seg.startDate.toISOString(),
          stage: 'deep',
          durationSec: seg.durationMin * 60,
        });
        break;
      case 'light':
      case 'asleep':
        lightMin += seg.durationMin;
        if (seg.stage === 'asleep') asleepUnspecifiedMin += seg.durationMin;
        hypnogram.push({
          timestamp: seg.startDate.toISOString(),
          stage: 'light',
          durationSec: seg.durationMin * 60,
        });
        break;
      case 'rem':
        remMin += seg.durationMin;
        hypnogram.push({
          timestamp: seg.startDate.toISOString(),
          stage: 'rem',
          durationSec: seg.durationMin * 60,
        });
        break;
      case 'awake':
        awakeMin += seg.durationMin;
        hypnogram.push({
          timestamp: seg.startDate.toISOString(),
          stage: 'awake',
          durationSec: seg.durationMin * 60,
        });
        break;
      case 'inbed':
        // InBed without sleep stage — treat as latency/awake
        awakeMin += seg.durationMin;
        break;
    }
  }

  const totalSleepMin = Math.round(deepMin + lightMin + remMin);
  const totalInBedMin = Math.round((bedtimeEnd.getTime() - bedtimeStart.getTime()) / 60000);
  const efficiency = totalInBedMin > 0 ? Math.round((totalSleepMin / totalInBedMin) * 100) : null;

  // If all sleep was "unspecified" (no stage detail), null out the stage breakdown
  const hasStageDetail = asleepUnspecifiedMin < lightMin;

  return {
    source: 'apple_health',
    sourceSessionId: `ah_${bedtimeStart.toISOString()}_${index}`,
    bedtimeStart: bedtimeStart.toISOString(),
    bedtimeEnd: bedtimeEnd.toISOString(),
    sleepOnset: null,
    wakeTime: bedtimeEnd.toISOString(),
    totalDurationMin: totalSleepMin,
    sleepLatencyMin: null,
    deepMin: hasStageDetail ? Math.round(deepMin) : null,
    lightMin: hasStageDetail ? Math.round(lightMin) : Math.round(lightMin),
    remMin: hasStageDetail ? Math.round(remMin) : null,
    awakeMin: Math.round(awakeMin),
    efficiency,
    sleepScore: null, // Apple Health doesn't provide a score
    cyclesCompleted: hasStageDetail ? estimateCycles(Math.round(deepMin), Math.round(lightMin), Math.round(remMin)) : null,
    avgHeartRate: null,
    minHeartRate: null,
    restingHeartRate: null,
    hrvRmssd: null,
    respiratoryRate: null,
    spo2: null,
    skinTempDelta: null,
    disturbanceCount: null,
    isNap: totalSleepMin < 120, // Nap if less than 2 hours
    hypnogram: hypnogram.length > 0 ? hypnogram : null,
    rawData: null,
  };
}

// ---------------------------------------------------------------------------
// Main export function
// ---------------------------------------------------------------------------

/**
 * Parse an Apple Health export ZIP file.
 * Call from client-side only (uses JSZip for extraction).
 */
export async function parseAppleHealthExport(
  file: File,
  onProgress?: (progress: ParseProgress) => void,
): Promise<NormalizedSleepSession[]> {
  onProgress?.({ phase: 'extracting', percent: 0 });

  // Dynamically import JSZip (client-side only)
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(file);

  onProgress?.({ phase: 'extracting', percent: 30 });

  // Find the export.xml file
  const xmlFile = zip.file('apple_health_export/export.xml') ?? zip.file('export.xml');
  if (!xmlFile) {
    throw new Error('Could not find export.xml in the Apple Health export ZIP');
  }

  onProgress?.({ phase: 'parsing', percent: 40 });

  const xmlText = await xmlFile.async('text');

  onProgress?.({ phase: 'parsing', percent: 60 });

  const records = parseSleepRecordsFromXml(xmlText);

  onProgress?.({ phase: 'normalizing', percent: 80 });

  const sessions = groupRecordsIntoSessions(records);
  const normalized = sessions.map((segments, i) => normalizeSession(segments, i));

  onProgress?.({ phase: 'normalizing', percent: 100 });

  // Filter out very short sessions (less than 20 minutes)
  return normalized.filter((s) => (s.totalDurationMin ?? 0) >= 20);
}
