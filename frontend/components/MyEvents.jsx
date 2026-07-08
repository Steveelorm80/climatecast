"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getAllEvents,
  deleteEvent,
  updateEvent,
  getRiskForDate,
} from "@/services/api";
import { getRiskColor } from "@/utils/riskUtils";

const VISIBLE_LIMIT = 5;
const FORECAST_DAYS = 5;

function daysFromToday(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + "T00:00:00");
  return Math.round((d - today) / 86400000);
}

export default function MyEvents({ city, refreshSignal }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityOnly, setCityOnly] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [riskById, setRiskById] = useState({});
  const [riskLoadingId, setRiskLoadingId] = useState(null);

  const loadRisk = async (event) => {
    const days = daysFromToday(event.date);
    if (days === null || days < 0 || days > FORECAST_DAYS) return;
    setRiskLoadingId(event.id);
    try {
      const res = await getRiskForDate(event.city, event.date);
      setRiskById((prev) => ({ ...prev, [event.id]: res.data }));
    } catch (err) {
      console.error("Failed to load risk:", err);
    } finally {
      setRiskLoadingId(null);
    }
  };

  const toggleExpand = (event) => {
    const next = expandedId === event.id ? null : event.id;
    setExpandedId(next);
    if (next && !riskById[event.id]) loadRisk(event);
  };

  const load = async () => {
    try {
      const data = await getAllEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [refreshSignal]);

  const filtered = useMemo(() => {
    let list = [...events];
    if (cityOnly && city) {
      list = list.filter(
        (e) => e.city && e.city.toLowerCase() === city.toLowerCase()
      );
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((e) => e.name && e.name.toLowerCase().includes(q));
    }
    // Soonest first
    list.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    return list;
  }, [events, cityOnly, city, search]);

  const visible = showAll ? filtered : filtered.slice(0, VISIBLE_LIMIT);

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      console.error("Failed to delete event:", err);
    }
  };

  const startEdit = (event) => {
    setEditingId(event.id);
    setEditForm({
      name: event.name || "",
      city: event.city || "",
      date: event.date || "",
      description: event.description || "",
    });
  };

  const saveEdit = async (id) => {
    setSaving(true);
    try {
      const result = await updateEvent(id, editForm);
      if (result?.success) {
        setEvents((prev) => prev.map((e) => (e.id === id ? result.event : e)));
        setEditingId(null);
        // Date or city may have changed — refresh the risk
        setRiskById((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        loadRisk(result.event);
      } else {
        alert(result?.message || "Update failed");
      }
    } catch (err) {
      console.error("Failed to update event:", err);
      alert("Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <h2 className="font-bold">
          📅 My Events{" "}
          <span className="text-gray-400 font-normal text-sm">
            ({filtered.length})
          </span>
        </h2>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search events..."
            className="border px-2 py-1 rounded-lg text-sm w-36"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => setCityOnly(!cityOnly)}
            className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ${
              cityOnly
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "bg-gray-100 border-gray-300 text-gray-600"
            }`}
            title="Toggle between current city and all cities"
          >
            {cityOnly ? `📍 ${city}` : "🌍 All cities"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading events...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">
          {cityOnly
            ? `No events in ${city}. Switch to "All cities" or assess an event above.`
            : "No saved events yet. Assess an event above to save it."}
        </p>
      ) : (
        <ul className={`divide-y ${showAll ? "max-h-72 overflow-y-auto pr-1" : ""}`}>
          {visible.map((event) => (
            <li key={event.id} className="py-2">
              {/* Row */}
              <div
                className="flex justify-between items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-1"
                onClick={() => toggleExpand(event)}
              >
                <div>
                  <span className="font-medium">{event.name}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    {event.city} · {event.date}
                  </span>
                </div>
                <span className="text-gray-400 text-xs">
                  {expandedId === event.id ? "▲" : "▼"}
                </span>
              </div>

              {/* Expanded detail / edit */}
              {expandedId === event.id && (
                <div className="mt-2 ml-1 p-3 bg-gray-50 rounded-lg text-sm">
                  {editingId === event.id ? (
                    <div className="space-y-2">
                      <input
                        className="border px-2 py-1 rounded w-full"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        placeholder="Event name"
                      />
                      <div className="flex gap-2">
                        <input
                          className="border px-2 py-1 rounded flex-1"
                          value={editForm.city}
                          onChange={(e) =>
                            setEditForm({ ...editForm, city: e.target.value })
                          }
                          placeholder="City"
                        />
                        <input
                          type="date"
                          className="border px-2 py-1 rounded"
                          value={editForm.date}
                          onChange={(e) =>
                            setEditForm({ ...editForm, date: e.target.value })
                          }
                        />
                      </div>
                      <textarea
                        className="border px-2 py-1 rounded w-full"
                        rows={2}
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Description"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(event.id)}
                          disabled={saving}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:bg-gray-400"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="border px-3 py-1 rounded hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-600 mb-2">
                        {event.description || "No description."}
                      </p>

                      {/* Risk assessment for this event */}
                      {(() => {
                        const days = daysFromToday(event.date);
                        const risk = riskById[event.id];
                        if (days !== null && days < 0) {
                          return (
                            <p className="text-gray-400 mb-2 text-xs">
                              This event date has passed.
                            </p>
                          );
                        }
                        if (days !== null && days > FORECAST_DAYS) {
                          return (
                            <p className="text-gray-400 mb-2 text-xs">
                              ⏳ Forecast opens ~{FORECAST_DAYS} days before the
                              event ({days} days away).
                            </p>
                          );
                        }
                        if (riskLoadingId === event.id) {
                          return (
                            <p className="text-gray-500 mb-2 text-xs">
                              Checking current forecast...
                            </p>
                          );
                        }
                        if (risk) {
                          return (
                            <div
                              className={`p-2 rounded-lg mb-2 ${getRiskColor(
                                risk.eventRisk
                              )}`}
                            >
                              <p className="font-bold">
                                Risk: {risk.eventRisk}
                                <span className="font-normal ml-2 text-xs">
                                  comfort {Math.round(risk.comfortScore)}/100
                                </span>
                              </p>
                              <p className="text-xs">{risk.recommendation}</p>
                              <p className="text-xs opacity-80 mt-1">
                                🌡 {risk.avgTemp?.toFixed(1)}°C · 💨{" "}
                                {risk.maxWind?.toFixed(1)} m/s · 🌧{" "}
                                {risk.rainAmount?.toFixed(1)} mm
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(event)}
                          className="border px-3 py-1 rounded hover:bg-gray-100"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="border border-red-200 text-red-600 px-3 py-1 rounded hover:bg-red-50"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {filtered.length > VISIBLE_LIMIT && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 text-blue-600 text-sm hover:underline"
        >
          {showAll ? "Show less" : `Show all ${filtered.length} events`}
        </button>
      )}
    </div>
  );
}
