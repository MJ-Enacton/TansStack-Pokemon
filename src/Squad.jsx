import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const typeColors = {
  fire: { bg: "bg-red-500", text: "text-white", border: "border-red-600", gradient: "from-red-500 to-orange-600" },
  water: { bg: "bg-blue-500", text: "text-white", border: "border-blue-600", gradient: "from-blue-500 to-cyan-600" },
  grass: { bg: "bg-green-500", text: "text-white", border: "border-green-600", gradient: "from-green-500 to-emerald-600" },
  electric: { bg: "bg-yellow-400", text: "text-zinc-900", border: "border-yellow-500", gradient: "from-yellow-400 to-amber-500" },
  psychic: { bg: "bg-pink-500", text: "text-white", border: "border-pink-600", gradient: "from-pink-500 to-purple-600" },
  ice: { bg: "bg-cyan-300", text: "text-zinc-900", border: "border-cyan-400", gradient: "from-cyan-300 to-blue-400" },
  dragon: { bg: "bg-indigo-600", text: "text-white", border: "border-indigo-700", gradient: "from-indigo-600 to-purple-700" },
  dark: { bg: "bg-neutral-800", text: "text-white", border: "border-neutral-900", gradient: "from-neutral-700 to-neutral-900" },
  fairy: { bg: "bg-pink-400", text: "text-white", border: "border-rose-400", gradient: "from-pink-400 to-rose-400" },
  normal: { bg: "bg-zinc-400", text: "text-zinc-900", border: "border-zinc-500", gradient: "from-zinc-400 to-zinc-500" },
  fighting: { bg: "bg-red-700", text: "text-white", border: "border-red-800", gradient: "from-red-600 to-orange-700" },
  flying: { bg: "bg-sky-400", text: "text-zinc-900", border: "border-sky-500", gradient: "from-sky-400 to-indigo-400" },
  poison: { bg: "bg-purple-500", text: "text-white", border: "border-purple-600", gradient: "from-purple-500 to-fuchsia-700" },
  ground: { bg: "bg-amber-600", text: "text-white", border: "border-amber-700", gradient: "from-amber-600 to-yellow-700" },
  rock: { bg: "bg-stone-500", text: "text-white", border: "border-stone-600", gradient: "from-stone-500 to-stone-700" },
  bug: { bg: "bg-lime-500", text: "text-white", border: "border-lime-600", gradient: "from-lime-500 to-green-600" },
  ghost: { bg: "bg-violet-700", text: "text-white", border: "border-violet-800", gradient: "from-violet-700 to-purple-900" },
  steel: { bg: "bg-slate-400", text: "text-zinc-900", border: "border-slate-500", gradient: "from-slate-400 to-slate-600" },
};

const statLabels = {
  hp: { label: "HP", color: "bg-rose-500" },
  attack: { label: "ATK", color: "bg-orange-500" },
  defense: { label: "DEF", color: "bg-blue-500" },
  "special-attack": { label: "SATK", color: "bg-purple-500" },
  "special-defense": { label: "SDEF", color: "bg-indigo-500" },
  speed: { label: "SPD", color: "bg-emerald-500" },
};

export default function Squad({ squad, onRemove, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("squad"); // 'squad' | 'analysis'

  const totalSlots = 6;
  const emptySlotsCount = totalSlots - squad.length;

  // Calculate stats
  const totalStats = squad.reduce(
    (acc, pokemon) => {
      pokemon.stats.forEach((s) => {
        const statName = s.stat.name;
        if (acc[statName] !== undefined) {
          acc[statName] += s.base_stat;
        }
      });
      return acc;
    },
    { hp: 0, attack: 0, defense: 0, "special-attack": 0, "special-defense": 0, speed: 0 }
  );

  const avgStats = {};
  const statsKeys = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];
  statsKeys.forEach((key) => {
    avgStats[key] = squad.length > 0 ? Math.round(totalStats[key] / squad.length) : 0;
  });

  // Calculate team strengths
  let maxAttackPokemon = null;
  let maxSpeedPokemon = null;
  let maxHpPokemon = null;

  squad.forEach((pokemon) => {
    const atk = pokemon.stats.find((s) => s.stat.name === "attack")?.base_stat || 0;
    const spd = pokemon.stats.find((s) => s.stat.name === "speed")?.base_stat || 0;
    const hp = pokemon.stats.find((s) => s.stat.name === "hp")?.base_stat || 0;

    if (!maxAttackPokemon || atk > maxAttackPokemon.value) {
      maxAttackPokemon = { name: pokemon.name, value: atk, image: pokemon.sprites.front_default };
    }
    if (!maxSpeedPokemon || spd > maxSpeedPokemon.value) {
      maxSpeedPokemon = { name: pokemon.name, value: spd, image: pokemon.sprites.front_default };
    }
    if (!maxHpPokemon || hp > maxHpPokemon.value) {
      maxHpPokemon = { name: pokemon.name, value: hp, image: pokemon.sprites.front_default };
    }
  });

  // Determine Team Archetype
  let archetype = "No squad members";
  let archetypeDesc = "Add Pokémon to your team to see your battle archetype analysis.";
  if (squad.length > 0) {
    const offense = avgStats["attack"] + avgStats["special-attack"];
    const defense = avgStats["defense"] + avgStats["special-defense"];
    if (offense > defense * 1.15) {
      archetype = "Hyper Offensive Squad ⚔️";
      archetypeDesc = "Your team has high offensive output. Perfect for sweeping teams with powerful moves before they can react.";
    } else if (defense > offense * 1.15) {
      archetype = "Stall / Defensive Squad 🛡️";
      archetypeDesc = "Your team excels at defense and tankiness. Great for outlasting your opponent and playing defensively.";
    } else if (avgStats["speed"] > 95) {
      archetype = "Fast Sweeper Squad ⚡";
      archetypeDesc = "Your team values blazing speed. You'll likely strike first in battles and dictate the pace of combat.";
    } else {
      archetype = "Balanced Squad ⚖️";
      archetypeDesc = "Your team maintains a perfect balance between attack and defensive capabilities, adaptable to any matchup.";
    }
  }

  // Type composition
  const typeComposition = {};
  squad.forEach((pokemon) => {
    pokemon.types.forEach((t) => {
      typeComposition[t.type.name] = (typeComposition[t.type.name] || 0) + 1;
    });
  });

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-45 flex items-center gap-2 px-5 py-3.5 bg-linear-to-r from-red-600 to-rose-600 text-white rounded-full shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_25px_rgba(225,29,72,0.6)] hover:scale-105 transition-all duration-300 border border-red-500 font-semibold cursor-pointer group"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-100"></span>
        </span>
        <div className="w-6 h-6 flex items-center justify-center bg-white/20 rounded-full group-hover:rotate-180 transition-transform duration-500">
          ⚪
        </div>
        <span>My PokéSquad</span>
        <span className="bg-white text-red-600 text-xs px-2 py-0.5 rounded-full font-black">
          {squad.length}/6
        </span>
      </button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Sidebar Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col h-full text-zinc-100 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                <div>
                  <h3 className="text-xl font-bold tracking-wide flex items-center gap-2">
                    <span className="text-red-500">🔴</span> PokéSquad Builder
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Assemble a balanced team of 6 Pokémon for combat
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-800 hover:bg-zinc-700 transition cursor-pointer text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Tab Selector */}
              <div className="flex border-b border-zinc-800">
                <button
                  onClick={() => setActiveTab("squad")}
                  className={`flex-1 py-3.5 text-center font-medium border-b-2 transition ${activeTab === "squad"
                      ? "border-red-500 text-red-400 bg-red-500/5"
                      : "border-transparent text-zinc-400 hover:text-zinc-200"
                    }`}
                >
                  Active Squad ({squad.length})
                </button>
                <button
                  onClick={() => setActiveTab("analysis")}
                  disabled={squad.length === 0}
                  className={`flex-1 py-3.5 text-center font-medium border-b-2 transition disabled:opacity-40 disabled:cursor-not-allowed ${activeTab === "analysis"
                      ? "border-red-500 text-red-400 bg-red-500/5"
                      : "border-transparent text-zinc-400 hover:text-zinc-200"
                    }`}
                >
                  Team Analysis
                </button>
              </div>

              {/* Content Panel */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeTab === "squad" ? (
                  <div className="space-y-4">
                    {/* List squad members */}
                    {squad.map((pokemon) => {
                      const primaryType = pokemon.types[0]?.type.name || "normal";
                      const colors = typeColors[primaryType] || typeColors.normal;

                      return (
                        <div
                          key={pokemon.id}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition relative overflow-hidden group shadow-lg"
                        >
                          {/* Mini gradient bar */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-linear-to-b ${colors.gradient}`} />

                          <div
                            onClick={() => onSelect(pokemon.url || `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`)}
                            className="w-14 h-14 bg-zinc-800 rounded-xl p-1.5 flex items-center justify-center cursor-pointer hover:bg-zinc-700 transition"
                          >
                            <img
                              src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
                              alt={pokemon.name}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-mono text-zinc-500">#{String(pokemon.id).padStart(4, "0")}</span>
                            <h4
                              onClick={() => onSelect(pokemon.url || `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`)}
                              className="font-bold capitalize text-zinc-100 hover:text-red-400 cursor-pointer transition truncate"
                            >
                              {pokemon.name}
                            </h4>
                            <div className="flex gap-1.5 mt-1.5 flex-wrap">
                              {pokemon.types.map((t) => (
                                <span
                                  key={t.type.name}
                                  className={`px-2 py-0.5 text-[10px] rounded-full uppercase font-black tracking-wider ${typeColors[t.type.name]?.bg || "bg-zinc-700"
                                    } ${typeColors[t.type.name]?.text || "text-white"}`}
                                >
                                  {t.type.name}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Stats Preview */}
                          <div className="text-right hidden sm:block">
                            <span className="text-xs text-zinc-500">BST</span>
                            <p className="font-bold text-sm text-zinc-300">
                              {pokemon.stats.reduce((s, acc) => s + acc.base_stat, 0)}
                            </p>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => onRemove(pokemon.name)}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-800 hover:bg-red-500/25 hover:text-red-500 text-zinc-500 transition cursor-pointer"
                          >
                            🗑️
                          </button>
                        </div>
                      );
                    })}

                    {/* Empty slots placeholders */}
                    {Array.from({ length: emptySlotsCount }).map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center py-6 rounded-2xl border-2 border-dashed border-zinc-800 text-zinc-600 font-medium text-sm gap-2"
                      >
                        <span>🔴 Empty Squad Slot</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Analytics panel
                  <div className="space-y-6">
                    {/* Squad Archetype Summary */}
                    <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-md">
                      <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
                        Squad Classification
                      </span>
                      <h4 className="text-lg font-black text-zinc-100 mt-1">{archetype}</h4>
                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{archetypeDesc}</p>
                    </div>

                    {/* Team Average Base Stats */}
                    <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-md">
                      <h4 className="text-sm font-bold text-zinc-200 tracking-wide mb-4">
                        Average Squad Stats
                      </h4>
                      <div className="space-y-4">
                        {statsKeys.map((key) => {
                          const val = avgStats[key];
                          const meta = statLabels[key];
                          // Max standard stat is 150 for average comparison
                          const pct = Math.min(100, Math.round((val / 150) * 100));

                          return (
                            <div key={key} className="space-y-1">
                              <div className="flex justify-between items-center text-xs font-medium">
                                <span className="capitalize text-zinc-400 font-mono">{meta.label}</span>
                                <span className="text-zinc-200 font-semibold">{val} <span className="text-[10px] text-zinc-500">/ 150</span></span>
                              </div>
                              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.8 }}
                                  className={`h-full rounded-full ${meta.color}`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Team Strengths / MVP Highlights */}
                    <div className="grid grid-cols-3 gap-3">
                      {maxHpPokemon && (
                        <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 flex flex-col items-center text-center">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase font-mono">Max HP</span>
                          <img src={maxHpPokemon.image} alt={maxHpPokemon.name} className="w-10 h-10 object-contain my-1" />
                          <p className="text-xs capitalize font-bold text-zinc-300 truncate w-full">{maxHpPokemon.name}</p>
                          <span className="text-xs font-black text-rose-500 mt-0.5">{maxHpPokemon.value}</span>
                        </div>
                      )}
                      {maxAttackPokemon && (
                        <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 flex flex-col items-center text-center">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase font-mono">Max ATK</span>
                          <img src={maxAttackPokemon.image} alt={maxAttackPokemon.name} className="w-10 h-10 object-contain my-1" />
                          <p className="text-xs capitalize font-bold text-zinc-300 truncate w-full">{maxAttackPokemon.name}</p>
                          <span className="text-xs font-black text-orange-500 mt-0.5">{maxAttackPokemon.value}</span>
                        </div>
                      )}
                      {maxSpeedPokemon && (
                        <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 flex flex-col items-center text-center">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase font-mono">Max SPD</span>
                          <img src={maxSpeedPokemon.image} alt={maxSpeedPokemon.name} className="w-10 h-10 object-contain my-1" />
                          <p className="text-xs capitalize font-bold text-zinc-300 truncate w-full">{maxSpeedPokemon.name}</p>
                          <span className="text-xs font-black text-emerald-500 mt-0.5">{maxSpeedPokemon.value}</span>
                        </div>
                      )}
                    </div>

                    {/* Type Distribution */}
                    <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-md">
                      <h4 className="text-sm font-bold text-zinc-200 tracking-wide mb-3">
                        Type Composition
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(typeComposition).map(([typeName, count]) => {
                          const colors = typeColors[typeName] || typeColors.normal;
                          return (
                            <div
                              key={typeName}
                              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold capitalize border ${colors.bg} ${colors.text} ${colors.border}`}
                            >
                              <span>{typeName}</span>
                              <span className="bg-black/20 text-current text-[10px] px-1.5 py-0.5 rounded-full font-black">
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Banner */}
              {squad.length > 0 && activeTab === "squad" && (
                <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                  <div className="text-xs text-zinc-400">
                    Average Team BST:{" "}
                    <span className="font-bold text-zinc-200">
                      {Math.round(
                        squad.reduce(
                          (acc, pokemon) =>
                            acc + pokemon.stats.reduce((s, st) => s + st.base_stat, 0),
                          0
                        ) / squad.length
                      )}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab("analysis")}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-md transition cursor-pointer"
                  >
                    View Analyzer
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
