import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Zap, Star, Shield, RefreshCw } from 'lucide-react';
import { getApiUrl } from '../api/config.js';

export default function LeaderboardView() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(getApiUrl('/api/leaderboard'));
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setLeaderboard(json.data);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.log('Leaderboard API fallback to local canonical rankings');
    }

    // Fallback rankings
    setLeaderboard([
      { rank_num: 1, name: 'Prasoon Pathak', email: 'prasoon.pathak@vritra-tf.gov.in', xp: 9500, rank: 'Task Force Chief', cases_solved: 18, stars: 54 },
      { rank_num: 2, name: 'ACP Rudransh Pathak', email: 'rudransh.pathak@vritra-tf.gov.in', xp: 8700, rank: 'Senior Inspector', cases_solved: 16, stars: 48 },
      { rank_num: 3, name: 'Dr. Ananya Sen', email: 'ananya.sen@vritra-tf.gov.in', xp: 7800, rank: 'Forensic Director', cases_solved: 14, stars: 42 },
      { rank_num: 4, name: 'Vikramaditya Nagabhavan', email: 'vikramaditya@vritra-tf.gov.in', xp: 6200, rank: 'Lead Investigator', cases_solved: 12, stars: 36 },
      { rank_num: 5, name: 'Guest Detective', email: 'guest@vritra-tf.gov.in', xp: 2500, rank: 'Investigation Intern', cases_solved: 5, stars: 15 },
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262633] pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30 px-3 py-1 rounded">
            NATIONAL TASK FORCE CLEARANCE RANKINGS
          </span>
          <h1 className="text-3xl font-extrabold text-[#e0e0e0] mt-2 font-serif">Investigator Leaderboard</h1>
          <p className="text-xs text-[#8a8a9e]">Live clearance ranks based on XP earned, cases solved, and forensic stars</p>
        </div>

        <button
          onClick={fetchLeaderboard}
          disabled={loading}
          className="flex items-center gap-1.5 bg-[#141419] hover:bg-[#262633] text-[#d4af37] border border-[#262633] px-3.5 py-2 rounded text-xs font-bold uppercase transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Standings
        </button>
      </div>

      {/* Leaderboard Table Card */}
      <div className="bg-[#141419] border border-[#262633] rounded-lg shadow-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-[#8a8a9e] space-y-2 font-mono">
            <RefreshCw className="w-8 h-8 text-[#d4af37] animate-spin mx-auto" />
            <p>Querying Supabase Live Clearance Rankings...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#0a0a0c] border-b border-[#262633] text-[#d4af37]">
                  <th className="p-3">Rank</th>
                  <th className="p-3">Investigator</th>
                  <th className="p-3">Clearance Rank</th>
                  <th className="p-3">Cases Solved</th>
                  <th className="p-3">Stars</th>
                  <th className="p-3 text-right">Total XP</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-[#262633]/60 transition-colors ${
                      idx === 0
                        ? 'bg-[#d4af37]/10 font-bold'
                        : idx < 3
                        ? 'bg-[#141419] hover:bg-[#262633]/30'
                        : 'hover:bg-[#262633]/30'
                    }`}
                  >
                    <td className="p-3 flex items-center gap-1.5 font-extrabold text-[#d4af37]">
                      {idx === 0 && <Trophy className="w-4 h-4 text-[#d4af37]" />}
                      {idx === 1 && <Medal className="w-4 h-4 text-gray-300" />}
                      {idx === 2 && <Medal className="w-4 h-4 text-amber-600" />}
                      <span>#{item.rank_num || idx + 1}</span>
                    </td>
                    <td className="p-3 font-sans font-bold text-[#e0e0e0]">
                      {item.name}
                      <span className="block text-[10px] font-mono text-[#8a8a9e] font-normal">{item.email}</span>
                    </td>
                    <td className="p-3 text-[#d4af37]">{item.rank || 'Investigator'}</td>
                    <td className="p-3 text-[#e0e0e0]">{item.cases_solved || item.completedCases?.length || 0} / 18</td>
                    <td className="p-3 text-[#d4af37]">{item.stars || item.totalStars || 0} ⭐</td>
                    <td className="p-3 text-right font-extrabold text-[#d4af37]">
                      {(item.xp || 0).toLocaleString()} XP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
