import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPokemonDetailsByURL } from "./api";
import { AnimatePresence, motion } from "framer-motion";

const typeColors = {
    fire: { bg: "bg-red-500", text: "text-white", border: "border-red-600", textLight: "text-red-400", shadow: "shadow-red-500/20", gradient: "from-red-600 to-orange-650", glowBg: "bg-red-550/10" },
    water: { bg: "bg-blue-500", text: "text-white", border: "border-blue-600", textLight: "text-blue-400", shadow: "shadow-blue-500/20", gradient: "from-blue-600 to-cyan-600", glowBg: "bg-blue-550/10" },
    grass: { bg: "bg-green-500", text: "text-white", border: "border-green-600", textLight: "text-green-400", shadow: "shadow-green-500/20", gradient: "from-green-600 to-emerald-600", glowBg: "bg-green-550/10" },
    electric: { bg: "bg-yellow-400", text: "text-zinc-950", border: "border-yellow-500", textLight: "text-yellow-400", shadow: "shadow-yellow-400/20", gradient: "from-yellow-400 to-amber-500", glowBg: "bg-yellow-400/10" },
    psychic: { bg: "bg-pink-500", text: "text-white", border: "border-pink-600", textLight: "text-pink-400", shadow: "shadow-pink-500/20", gradient: "from-pink-600 to-purple-600", glowBg: "bg-pink-550/10" },
    ice: { bg: "bg-cyan-300", text: "text-zinc-950", border: "border-cyan-400", textLight: "text-cyan-400", shadow: "shadow-cyan-300/20", gradient: "from-cyan-300 to-blue-400", glowBg: "bg-cyan-300/10" },
    dragon: { bg: "bg-indigo-600", text: "text-white", border: "border-indigo-700", textLight: "text-indigo-400", shadow: "shadow-indigo-600/20", gradient: "from-indigo-600 to-purple-700", glowBg: "bg-indigo-550/10" },
    dark: { bg: "bg-neutral-800", text: "text-white", border: "border-neutral-900", textLight: "text-neutral-455", shadow: "shadow-neutral-800/20", gradient: "from-neutral-700 to-neutral-900", glowBg: "bg-neutral-800/15" },
    fairy: { bg: "bg-pink-400", text: "text-white", border: "border-rose-400", textLight: "text-pink-400", shadow: "shadow-pink-400/20", gradient: "from-pink-400 to-rose-450", glowBg: "bg-pink-450/10" },
    normal: { bg: "bg-zinc-400", text: "text-zinc-950", border: "border-zinc-500", textLight: "text-zinc-400", shadow: "shadow-zinc-400/20", gradient: "from-zinc-400 to-zinc-500", glowBg: "bg-zinc-400/10" },
    fighting: { bg: "bg-red-700", text: "text-white", border: "border-red-800", textLight: "text-red-400", shadow: "shadow-red-700/20", gradient: "from-red-600 to-orange-700", glowBg: "bg-red-750/10" },
    flying: { bg: "bg-sky-400", text: "text-zinc-950", border: "border-sky-500", textLight: "text-sky-400", shadow: "shadow-sky-400/20", gradient: "from-sky-400 to-indigo-400", glowBg: "bg-sky-400/10" },
    poison: { bg: "bg-purple-500", text: "text-white", border: "border-purple-600", textLight: "text-purple-400", shadow: "shadow-purple-500/20", gradient: "from-purple-650 to-fuchsia-700", glowBg: "bg-purple-550/10" },
    ground: { bg: "bg-amber-600", text: "text-white", border: "border-amber-700", textLight: "text-amber-550", shadow: "shadow-amber-600/20", gradient: "from-amber-600 to-yellow-700", glowBg: "bg-amber-650/10" },
    rock: { bg: "bg-stone-500", text: "text-white", border: "border-stone-600", textLight: "text-stone-400", shadow: "shadow-stone-500/20", gradient: "from-stone-500 to-stone-700", glowBg: "bg-stone-550/10" },
    bug: { bg: "bg-lime-500", text: "text-white", border: "border-lime-600", textLight: "text-lime-400", shadow: "shadow-lime-500/20", gradient: "from-lime-500 to-green-600", glowBg: "bg-lime-550/10" },
    ghost: { bg: "bg-violet-700", text: "text-white", border: "border-violet-800", textLight: "text-violet-400", shadow: "shadow-violet-700/20", gradient: "from-violet-700 to-purple-900", glowBg: "bg-violet-750/10" },
    steel: { bg: "bg-slate-400", text: "text-zinc-950", border: "border-slate-500", textLight: "text-slate-400", shadow: "shadow-slate-400/20", gradient: "from-slate-400 to-slate-600", glowBg: "bg-slate-450/10" },
};

const statLabels = {
    hp: { label: "HP", color: "bg-rose-500" },
    attack: { label: "Attack", color: "bg-orange-500" },
    defense: { label: "Defense", color: "bg-blue-500" },
    "special-attack": { label: "Sp. Attack", color: "bg-purple-500" },
    "special-defense": { label: "Sp. Defense", color: "bg-indigo-500" },
    speed: { label: "Speed", color: "bg-emerald-500" },
};

export default function SinglePokemon({ url, setSelectedPokemon, squad, toggleSquad }) {
    const [activeTab, setActiveTab] = useState("stats"); // 'stats' | 'dimensions' | 'moves'

    const {
        data: details,
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ["pokemon", url],
        queryFn: () => fetchPokemonDetailsByURL(url),
        staleTime: 24 * 60 * 60 * 1000, // cache details for 24 hours
        gcTime: 48 * 60 * 60 * 1000,
    });

    if (isPending) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                <div className="flex flex-col items-center gap-4 text-zinc-350">
                    <div className="w-12 h-12 border-4 border-t-red-500 border-zinc-800 rounded-full animate-spin" />
                    <span className="font-medium text-sm tracking-wide">Retrieving Pokédex Data...</span>
                </div>
            </div>
        );
    }

    if (isError || !details) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl text-center max-w-sm">
                    <p className="text-red-500 font-bold mb-3">⚠️ Connection Error</p>
                    <p className="text-zinc-400 text-xs mb-4">{error?.message || "Could not retrieve details."}</p>
                    <button
                        onClick={() => setSelectedPokemon(null)}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        );
    }

    const primaryType = details.types[0]?.type.name || "normal";
    const typeStyle = typeColors[primaryType] || typeColors.normal;
    const isSquadMember = squad.some((s) => s.id === details.id);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 30 }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden text-zinc-100"
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setSelectedPokemon(null)}
                        className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition cursor-pointer text-zinc-400 hover:text-white"
                    >
                        ✕
                    </button>

                    {/* Header Panel (Artwork, Name, Types, Team Toggle) */}
                    <div className="p-6 md:p-8 border-b border-zinc-900 bg-zinc-900/40 flex flex-col md:flex-row items-center gap-6 relative">
                        {/* Ambient Background Glow matching primary type */}
                        <div className={`absolute -top-12 -left-12 w-64 h-64 rounded-full filter blur-[80px] ${typeStyle.glowBg} pointer-events-none`} />

                        {/* Artwork Container */}
                        <div className="relative bg-zinc-900 rounded-2xl p-4 w-44 h-44 flex items-center justify-center border border-zinc-800">
                            <img
                                src={details.sprites.other["official-artwork"].front_default || details.sprites.front_default}
                                alt={details.name}
                                className="w-36 h-36 object-contain transform hover:scale-105 transition duration-300"
                            />
                        </div>

                        {/* Bio Metadata */}
                        <div className="flex-1 text-center md:text-left min-w-0">
                            <span className="text-sm font-mono text-zinc-500 font-bold">
                                #{String(details.id).padStart(4, "0")}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black capitalize text-zinc-150 tracking-wide mt-1 truncate">
                                {details.name}
                            </h2>

                            <div className="flex gap-2 mt-3 flex-wrap justify-center md:justify-start">
                                {details.types.map((t) => {
                                    const tagColors = typeColors[t.type.name] || typeColors.normal;
                                    return (
                                        <span
                                            key={t.type.name}
                                            className={`px-3 py-1 text-xs rounded-full uppercase font-black tracking-wider border ${tagColors.bg} ${tagColors.text} ${tagColors.border}`}
                                        >
                                            {t.type.name}
                                        </span>
                                    );
                                })}
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-5 flex flex-wrap gap-2 justify-center md:justify-start">
                                <button
                                    onClick={() => toggleSquad(details)}
                                    className={`
                    px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]
                    ${isSquadMember
                                            ? "bg-rose-600/20 text-rose-455 border border-rose-500/30 hover:bg-rose-600/30"
                                            : squad.length >= 6
                                                ? "bg-zinc-800 text-zinc-500 border border-zinc-750 cursor-not-allowed"
                                                : "bg-linear-to-r from-red-650 to-rose-650 text-white border border-red-500 hover:shadow-[0_0_15px_rgba(220,38,38,0.25)]"
                                        }
                  `}
                                    disabled={!isSquadMember && squad.length >= 6}
                                >
                                    <span className="text-sm">⚪</span>
                                    {isSquadMember
                                        ? "Remove from Squad"
                                        : squad.length >= 6
                                            ? "Squad Full (6/6)"
                                            : "Add to PokéSquad"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sub Navigation Bar for Info Tabs */}
                    <div className="flex border-b border-zinc-900 bg-zinc-900/20">
                        {["stats", "dimensions", "moves"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                  flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider transition border-b-2
                  ${activeTab === tab
                                        ? "border-red-500 text-red-400 bg-red-500/5"
                                        : "border-transparent text-zinc-500 hover:text-zinc-300"
                                    }
                `}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Dynamic Scrollable Panel Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                        {activeTab === "stats" && (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-zinc-400 tracking-wider uppercase">Base Statistics</h3>
                                    <div className="space-y-3">
                                        {details.stats.map((stat) => {
                                            const meta = statLabels[stat.stat.name] || { label: stat.stat.name, color: "bg-zinc-500" };
                                            // Standard stat max is 255 for HP/Attacks
                                            const pct = Math.min(100, Math.round((stat.base_stat / 200) * 100));

                                            return (
                                                <div key={stat.stat.name} className="flex items-center gap-3">
                                                    <span className="w-24 text-xs font-semibold text-zinc-450 truncate">{meta.label}</span>
                                                    <span className="w-8 text-right text-xs font-mono font-bold text-zinc-200">
                                                        {stat.base_stat}
                                                    </span>
                                                    <div className="flex-1 h-3.5 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-850 p-0.5">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${pct}%` }}
                                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                                            className={`h-full rounded-md ${meta.color}`}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Abilities Box */}
                                <div className="space-y-3 pt-2">
                                    <h3 className="text-sm font-bold text-zinc-400 tracking-wider uppercase">Abilities</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {details.abilities.map((a) => (
                                            <span
                                                key={a.ability.name}
                                                className={`bg-zinc-900 border border-zinc-800 text-zinc-200 px-4 py-2 rounded-xl text-xs font-bold capitalize flex items-center gap-2 ${a.is_hidden ? "border-dashed border-red-500/30 text-zinc-450" : ""
                                                    }`}
                                            >
                                                {a.ability.name}
                                                {a.is_hidden && (
                                                    <span className="text-[9px] bg-red-950/40 text-red-400 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                                                        Hidden
                                                    </span>
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "dimensions" && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-zinc-900/50 border border-zinc-850 p-4 rounded-2xl">
                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Height</p>
                                    <p className="text-xl font-black text-zinc-200 mt-1">
                                        {details.height / 10} <span className="text-xs text-zinc-500 font-normal">m</span>
                                    </p>
                                </div>

                                <div className="bg-zinc-900/50 border border-zinc-850 p-4 rounded-2xl">
                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Weight</p>
                                    <p className="text-xl font-black text-zinc-200 mt-1">
                                        {details.weight / 10} <span className="text-xs text-zinc-500 font-normal">kg</span>
                                    </p>
                                </div>

                                <div className="bg-zinc-900/50 border border-zinc-850 p-4 rounded-2xl">
                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Base Experience</p>
                                    <p className="text-xl font-black text-zinc-200 mt-1">
                                        {details.base_experience || "N/A"} <span className="text-xs text-zinc-500 font-normal">xp</span>
                                    </p>
                                </div>

                                <div className="bg-zinc-900/50 border border-zinc-850 p-4 rounded-2xl col-span-2">
                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Species Link</p>
                                    <p className="text-sm font-bold text-zinc-300 mt-1.5 capitalize truncate">
                                        {details.species.name}
                                    </p>
                                    <span className="text-[10px] text-zinc-650 font-mono select-all truncate block mt-0.5">
                                        {details.species.url}
                                    </span>
                                </div>
                            </div>
                        )}

                        {activeTab === "moves" && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-zinc-400 tracking-wider uppercase">
                                        Available Moves ({details.moves.length})
                                    </h3>
                                    <span className="text-[10px] text-zinc-600 font-mono">Showing first 32 moves</span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[35vh] overflow-y-auto pr-1">
                                    {details.moves.slice(0, 32).map((m) => (
                                        <span
                                            key={m.move.name}
                                            className="bg-zinc-900 border border-zinc-850 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 capitalize text-center hover:bg-zinc-850 hover:text-white transition"
                                        >
                                            {m.move.name.replace("-", " ")}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}