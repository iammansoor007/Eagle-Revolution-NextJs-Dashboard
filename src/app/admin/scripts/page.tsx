"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  Loader2, CheckCircle2, AlertCircle, X, Save, ChevronDown
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────
interface Script {
  id: string;
  name: string;
  location: "head" | "body_start" | "body_end";
  code: string;
  active: boolean;
  createdAt: string;
}

const LOCATION_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  head:       { label: "<head>",      color: "text-blue-600",   bg: "bg-blue-50 border-blue-200" },
  body_start: { label: "<body> top",  color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
  body_end:   { label: "<body> end",  color: "text-emerald-600",bg: "bg-emerald-50 border-emerald-200" },
};

const EMPTY_FORM = { name: "", location: "head" as Script["location"], code: "", active: true };

// ── Modal ────────────────────────────────────────────────────────────
function ScriptModal({
  initial,
  onSave,
  onClose,
  saving,
}: {
  initial: Partial<Script>;
  onSave: (data: Partial<Script>) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial });
  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 12 }}
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border border-primary/20 bg-primary/10 flex items-center justify-center">
              <Code2 className="w-3 h-3 text-primary" />
            </div>
            <h2 className="text-xs font-bold text-slate-900 tracking-tight">
              {initial.id ? "Edit Script" : "Add New Script"}
            </h2>
          </div>
          <button onClick={onClose} className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Script Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Google Analytics, Facebook Pixel…"
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-900 outline-none focus:border-primary/40 transition-all"
            />
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inject Location</label>
            <div className="grid grid-cols-3 gap-2">
              {(["head", "body_start", "body_end"] as const).map((loc) => {
                const meta = LOCATION_LABELS[loc];
                return (
                  <button
                    key={loc}
                    onClick={() => set("location", loc)}
                    className={`px-2 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                      form.location === loc
                        ? `${meta.bg} ${meta.color} border-current`
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Script Code</label>
            <textarea
              value={form.code}
              onChange={(e) => set("code", e.target.value)}
              placeholder={`Paste your full <script> tag or raw JS code here…`}
              rows={6}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-mono text-slate-700 outline-none focus:border-primary/40 transition-all resize-y leading-tight"
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between py-1.5 px-3 bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-slate-900">Status</p>
            </div>
            <button
              onClick={() => set("active", !form.active)}
              className="flex items-center gap-1.5 transition-all"
            >
              {form.active ? (
                <><ToggleRight className="w-5 h-5 text-emerald-500" /><span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Active</span></>
              ) : (
                <><ToggleLeft className="w-5 h-5 text-slate-300" /><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Off</span></>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50">
          <button onClick={onClose} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors px-3 py-1.5">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.name.trim() || !form.code.trim()}
            className="flex items-center gap-1.5 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all shadow-sm"
          >
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            {initial.id ? "Save" : "Add Script"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────
export default function AdminScriptsPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [modal, setModal] = useState<{ open: boolean; data: Partial<Script> }>({ open: false, data: {} });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    try {
      const res = await fetch("/api/admin/scripts");
      setScripts(await res.json());
    } catch {
      showToast("err", "Failed to load scripts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => setModal({ open: true, data: { ...EMPTY_FORM } });
  const openEdit = (s: Script) => setModal({ open: true, data: { ...s } });
  const closeModal = () => setModal({ open: false, data: {} });

  const handleSave = async (form: Partial<Script>) => {
    setSaving(true);
    try {
      const method = form.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/scripts", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      await load();
      closeModal();
      showToast("ok", form.id ? "Script updated!" : "Script added!");
    } catch {
      showToast("err", "Save failed. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (s: Script) => {
    try {
      await fetch("/api/admin/scripts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...s, active: !s.active }),
      });
      setScripts((prev) => prev.map((x) => x.id === s.id ? { ...x, active: !x.active } : x));
    } catch {
      showToast("err", "Toggle failed.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this script? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/scripts?id=${id}`, { method: "DELETE" });
      setScripts((prev) => prev.filter((s) => s.id !== id));
      showToast("ok", "Script deleted.");
    } catch {
      showToast("err", "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 space-y-6">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className={`fixed top-6 right-6 z-[300] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-xs font-bold ${
              toast.type === "ok"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {toast.type === "ok" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" /> Scripts &amp; Tracking
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Inject analytics, pixels, and custom scripts — changes take effect on next page load.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-3.5 h-3.5" /> Add Script
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-7 h-7 animate-spin text-primary/30" />
        </div>
      ) : scripts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <Code2 className="w-8 h-8 text-slate-200" />
          <div className="text-center">
            <p className="text-sm font-bold text-slate-400">No scripts yet</p>
            <p className="text-xs text-slate-300 font-medium mt-0.5">Click "Add Script" to get started</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-1.5 text-xs font-black text-primary uppercase tracking-widest hover:underline">
            <Plus className="w-3.5 h-3.5" /> Add your first script
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Column Headers */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2">
            <div className="col-span-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Script Name</div>
            <div className="col-span-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Location</div>
            <div className="col-span-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</div>
            <div className="col-span-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</div>
          </div>

          {scripts.map((s, i) => {
            const loc = LOCATION_LABELS[s.location] || LOCATION_LABELS.head;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-12 gap-4 items-center bg-white border border-slate-100 rounded-xl px-4 py-3.5 hover:border-slate-200 hover:shadow-sm transition-all"
              >
                {/* Name */}
                <div className="col-span-5 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{s.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5 max-w-xs">
                    {s.code.slice(0, 60)}{s.code.length > 60 ? "…" : ""}
                  </p>
                </div>

                {/* Location badge */}
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] font-black ${loc.bg} ${loc.color}`}>
                    {loc.label}
                  </span>
                </div>

                {/* Status toggle */}
                <div className="col-span-2">
                  <button
                    onClick={() => handleToggle(s)}
                    className="flex items-center gap-1.5 group"
                  >
                    {s.active ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-slate-300 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Off</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Actions */}
                <div className="col-span-3 flex items-center justify-end gap-1">
                  <button
                    onClick={() => openEdit(s)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all uppercase tracking-widest"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={deletingId === s.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-red-400 hover:bg-red-50 hover:text-red-600 transition-all uppercase tracking-widest disabled:opacity-50"
                  >
                    {deletingId === s.id
                      ? <Loader2 className="w-3 h-3 animate-spin" />
                      : <Trash2 className="w-3 h-3" />
                    }
                    Delete
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Info note */}
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3.5">
        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
          Scripts are injected server-side on every page request. Only paste code from trusted sources. Inactive scripts are stored but not loaded.
        </p>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal.open && (
          <ScriptModal
            initial={modal.data}
            onSave={handleSave}
            onClose={closeModal}
            saving={saving}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
