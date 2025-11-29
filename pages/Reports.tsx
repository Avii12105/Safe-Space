import React, { useMemo } from "react";
import { MOCK_REPORTS } from "../constants";
import { HistoricalDataPoint, RiskLevel } from "../types";

const Reports: React.FC = () => {
  // Generate mock historical data for the last 7 days
  const historicalData = useMemo<HistoricalDataPoint[]>(() => {
    const data: HistoricalDataPoint[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const aqi = Math.floor(Math.random() * 150) + 50;
      const noiseDb = Math.floor(Math.random() * 40) + 50;

      let riskLevel = RiskLevel.LOW;
      if (aqi > 150 || noiseDb > 85) riskLevel = RiskLevel.HIGH;
      else if (aqi > 100 || noiseDb > 70) riskLevel = RiskLevel.MODERATE;

      data.push({
        date: date.toISOString().split("T")[0],
        aqi,
        noiseDb,
        riskLevel,
      });
    }
    return data;
  }, []);

  const maxAqi = Math.max(...historicalData.map((d) => d.aqi), 200);
  const maxNoise = Math.max(...historicalData.map((d) => d.noiseDb), 100);
  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Health Reports</h2>
          <p className="text-slate-500">
            Monthly breakdown of your environment exposure.
          </p>
        </div>
        <button className="text-teal-600 font-bold text-sm bg-teal-50 px-4 py-2 rounded-xl hover:bg-teal-100">
          Download PDF
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase">
            Safe Days
          </p>
          <p className="text-4xl font-bold text-slate-800 mt-2">24</p>
          <p className="text-teal-500 text-xs font-bold mt-1">
            ↑ 12% vs last month
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase">
            Exposure Events
          </p>
          <p className="text-4xl font-bold text-rose-500 mt-2">6</p>
          <p className="text-rose-400 text-xs font-bold mt-1">
            High noise detected
          </p>
        </div>
      </div>

      {/* 7-Day Trend Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-700 mb-6">7-Day Trends</h3>

        {/* AQI Chart */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-slate-600">
              Air Quality Index
            </span>
            <span className="text-xs text-slate-400">Lower is better</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-32 border-b border-slate-200 pb-2">
            {historicalData.map((point, idx) => {
              const heightPercent = (point.aqi / maxAqi) * 100;
              const dayLabel = new Date(point.date).toLocaleDateString(
                "en-US",
                { weekday: "short" }
              );
              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2 h-full"
                >
                  <div
                    className="w-full flex items-end justify-center h-full"
                  >
                    <div
                      className={`w-full rounded-t-lg transition-all hover:opacity-80 ${
                        point.aqi > 150
                          ? "bg-rose-400"
                          : point.aqi > 100
                          ? "bg-orange-400"
                          : "bg-teal-400"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                      title={`${point.aqi} AQI`}
                    />
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Noise Chart */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-slate-600">
              Noise Levels (dB)
            </span>
            <span className="text-xs text-slate-400">Safe: &lt;70 dB</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-32 border-b border-slate-200 pb-2">
            {historicalData.map((point, idx) => {
              const heightPercent = (point.noiseDb / maxNoise) * 100;
              const dayLabel = new Date(point.date).toLocaleDateString(
                "en-US",
                { weekday: "short" }
              );
              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2 h-full"
                >
                  <div
                    className="w-full flex items-end justify-center h-full"
                  >
                    <div
                      className={`w-full rounded-t-lg transition-all hover:opacity-80 ${
                        point.noiseDb > 85
                          ? "bg-indigo-600"
                          : point.noiseDb > 70
                          ? "bg-indigo-400"
                          : "bg-indigo-300"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                      title={`${point.noiseDb} dB`}
                    />
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-700">Recent Logs</h3>
        {MOCK_REPORTS.map((report, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-teal-200 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-xl font-bold text-slate-800">
                {report.month}
              </h4>
              {report.highRiskDays > 5 ? (
                <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-xs font-bold">
                  Needs Attention
                </span>
              ) : (
                <span className="bg-teal-100 text-teal-600 px-3 py-1 rounded-full text-xs font-bold">
                  Stable
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Avg AQI</span>
                <div className="flex-1 mx-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${Math.min(100, (report.avgAqi / 300) * 100)}%`,
                    }}
                    className={`h-full ${
                      report.avgAqi > 100 ? "bg-orange-400" : "bg-teal-400"
                    }`}
                  ></div>
                </div>
                <span className="font-bold text-slate-700">
                  {report.avgAqi}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Avg Noise</span>
                <div className="flex-1 mx-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${Math.min(100, (report.avgNoise / 120) * 100)}%`,
                    }}
                    className={`h-full ${
                      report.avgNoise > 70 ? "bg-indigo-500" : "bg-indigo-300"
                    }`}
                  ></div>
                </div>
                <span className="font-bold text-slate-700">
                  {report.avgNoise} dB
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400 italic border-t border-slate-50 pt-3">
              Notes: {report.checkInSummary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
