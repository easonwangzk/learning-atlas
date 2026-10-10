import test from "node:test";
import assert from "node:assert/strict";
import {
  computeCapacity,
  recoveryTimeline,
  subnetCapacity,
  partitionSkew,
  retrievalMetrics,
  evaluateRanking,
  confusionMetrics,
  getLabResult
} from "../src/lib/labCalculators.ts";

function assertRangeError(fn) {
  assert.throws(fn, RangeError);
}

test("compute capacity separates actual CPU utilization from headroom planning", () => {
  const result = computeCapacity({ rps: 100, cpuMs: 50, cores: 2, headroom: 1.2 });
  assert.equal(result.baseCores, 5);
  assert.equal(result.requiredCores, 6);
  assert.equal(result.replicas, 3);
  assert.equal(result.actualUtilization, 83.3);
  assert.equal(result.requestedCapacityRatio, 100);
  assert.equal(result.rows[0].actualUtilization, 250);
  assert.equal(result.rows[0].requestedCapacityRatio, 300);
});

test("recovery timeline is an illustrative phase check, not incident detection", () => {
  const result = recoveryTimeline({ rpo: 60, backupAge: 30, rto: 90, copy: 10, restore: 20, validate: 15 });
  assert.equal(result.total, 45);
  assert.equal(result.rpoOk, true);
  assert.equal(result.rtoOk, true);
  assert.deepEqual(result.rows, [
    { label: "copy", value: 10 },
    { label: "restore", value: 20 },
    { label: "validate", value: 15 }
  ]);
});

test("subnet capacity uses exact Azure IPv4 prefix math", () => {
  assert.deepEqual(subnetCapacity({ prefix: 24 }).rows, [
    { label: "usable", value: 251 },
    { label: "reserved", value: 5 }
  ]);
  assert.equal(subnetCapacity({ prefix: 16 }).total, 65536);
  assert.equal(subnetCapacity({ prefix: 29 }).usable, 3);
});

test("partition simulation keeps constant and spread series with matching totals", () => {
  const skew = partitionSkew({ records: 120, buckets: 6 });
  assert.equal(skew.rows.reduce((sum, row) => sum + row.constant, 0), 120);
  assert.equal(skew.rows.reduce((sum, row) => sum + row.spread, 0), 120);
  assert.ok(skew.maxConstant > skew.maxSpread);
  assert.ok(skew.rows.some((row) => row.constant === 120));
  assert.ok(skew.rows.some((row) => row.spread > 0));
});

test("retrieval metrics expose non-perfect Recall@k and cutoff/full MRR", () => {
  const k1 = retrievalMetrics({ k: 1 });
  const k3 = retrievalMetrics({ k: 3 });
  assert.ok(k1.recallAtK < 1);
  assert.ok(k3.recallAtK > k1.recallAtK);
  assert.equal(k1.rows.length >= 4, true);
  assert.ok(k1.rows.some((row) => row.relevant.length > 1 && row.recallAtK < 1));
  assert.ok(k1.rows.every((row) => row.ranking.length === 5));
  assert.equal(k1.mrrFull, 1);
  assert.equal(k1.mrrAtK, 1);
});

test("evaluateRanking handles missing and empty relevance preconditions", () => {
  assert.deepEqual(evaluateRanking(["d1", "d2"], ["d3"], 1), {
    recallAtK: 0,
    reciprocalRankFull: null,
    reciprocalRankAtK: null
  });
  assertRangeError(() => evaluateRanking(["d1"], [], 1));
  assertRangeError(() => evaluateRanking(["d1"], ["d1"], 1.5));
});

test("confusion matrix computes zero F1 when denominator is positive", () => {
  const zeroTp = confusionMetrics({ tp: 0, fp: 3, fn: 2, tn: 5 });
  assert.equal(zeroTp.precision, 0);
  assert.equal(zeroTp.recall, 0);
  assert.equal(zeroTp.f1, 0);
  assert.equal(zeroTp.accuracy, 5 / 10);

  const empty = confusionMetrics({ tp: 0, fp: 0, fn: 0, tn: 0 });
  assert.equal(empty.precision, null);
  assert.equal(empty.recall, null);
  assert.equal(empty.f1, null);
  assert.equal(empty.accuracy, null);
});

test("calculators reject invalid inputs instead of clamping or rounding", () => {
  assertRangeError(() => computeCapacity({ rps: 0, cpuMs: 50, cores: 2, headroom: 1.2 }));
  assertRangeError(() => computeCapacity({ rps: 100.5, cpuMs: 50, cores: 2, headroom: 1.2 }));
  assertRangeError(() => computeCapacity({ rps: 100, cpuMs: Number.NaN, cores: 2, headroom: 1.2 }));
  assertRangeError(() => recoveryTimeline({ rpo: 60, backupAge: 30, rto: 90, copy: 10.5, restore: 20, validate: 15 }));
  assertRangeError(() => subnetCapacity({ prefix: 24.5 }));
  assertRangeError(() => subnetCapacity({ prefix: 30 }));
  assertRangeError(() => partitionSkew({ records: 9, buckets: 6 }));
  assertRangeError(() => partitionSkew({ records: 60, buckets: 6.2 }));
  assertRangeError(() => retrievalMetrics({ k: 0 }));
  assertRangeError(() => confusionMetrics({ tp: 1, fp: -1, fn: 0, tn: 0 }));
});

test("localized result model includes data table labels and chart units", () => {
  const result = getLabResult("network", { prefix: 24 }, "en");
  assert.equal(result.summaryRows[0].value, "10.0.0.0/24");
  assert.equal(result.chart.unit, "addresses");
  assert.ok(result.notes[0].includes("IPv6"));
});
