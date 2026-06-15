import React from "react";
import { useQueries } from "@tanstack/react-query";
import { fetchPokemonDetailsByURL } from "./api";
import { motion } from "framer-motion";

const typeColors = {
  fire: { bg: "bg-red-500", text: "text-white", border: "border-red-500/30", shadow: "shadow-red-500/10 hover:shadow-red-500/30", gradient: "from-zinc-900 via-zinc-900 to-red-950/30 hover:border-red-500/60" },
  water: { bg: "bg-blue-500", text: "text-white", border: "border-blue-500/30", shadow: "shadow-blue-500/10 hover:shadow-blue-500/30", gradient: "from-zinc-900 via-zinc-900 to-blue-950/30 hover:border-blue-500/60" },
  grass: { bg: "bg-green-500", text: "text-white", border: "border-green-500/30", shadow: "shadow-green-500/10 hover:shadow-green-500/30", gradient: "from-zinc-900 via-zinc-900 to-green-950/30 hover:border-green-500/60" },
  electric: { bg: "bg-yellow-400", text: "text-zinc-950", border: "border-yellow-500/30", shadow: "shadow-yellow-450/10 hover:shadow-yellow-400/30", gradient: "from-zinc-900 via-zinc-900 to-yellow-950/20 hover:border-yellow-500/60" },
  psychic: { bg: "bg-pink-500", text: "text-white", border: "border-pink-500/30", shadow: "shadow-pink-500/10 hover:shadow-pink-500/30", gradient: "from-zinc-900 via-zinc-900 to-pink-950/30 hover:border-pink-500/60" },
  ice: { bg: "bg-cyan-300", text: "text-zinc-950", border: "border-cyan-400/30", shadow: "shadow-cyan-300/10 hover:shadow-cyan-300/30", gradient: "from-zinc-900 via-zinc-900 to-cyan-950/30 hover:border-cyan-400/60" },
  dragon: { bg: "bg-indigo-600", text: "text-white", border: "border-indigo-550/30", shadow: "shadow-indigo-600/10 hover:shadow-indigo-600/30", gradient: "from-zinc-900 via-zinc-900 to-indigo-950/30 hover:border-indigo-600/60" },
  dark: { bg: "bg-neutral-800", text: "text-white", border: "border-neutral-700/30", shadow: "shadow-neutral-800/10 hover:shadow-neutral-800/30", gradient: "from-zinc-900 via-zinc-900 to-neutral-900 hover:border-neutral-700/60" },
  fairy: { bg: "bg-pink-400", text: "text-white", border: "border-pink-400/30", shadow: "shadow-pink-400/10 hover:shadow-pink-400/30", gradient: "from-zinc-900 via-zinc-900 to-rose-950/30 hover:border-pink-400/60" },
  normal: { bg: "bg-zinc-400", text: "text-zinc-950", border: "border-zinc-500/30", shadow: "shadow-zinc-400/10 hover:shadow-zinc-400/30", gradient: "from-zinc-900 via-zinc-900 to-zinc-800/30 hover:border-zinc-500/60" },
  fighting: { bg: "bg-red-700", text: "text-white", border: "border-red-700/30", shadow: "shadow-red-700/10 hover:shadow-red-700/30", gradient: "from-zinc-900 via-zinc-900 to-orange-950/30 hover:border-red-700/60" },
  flying: { bg: "bg-sky-400", text: "text-zinc-950", border: "border-sky-500/30", shadow: "shadow-sky-450/10 hover:shadow-sky-400/30", gradient: "from-zinc-900 via-zinc-900 to-sky-950/30 hover:border-sky-500/60" },
  poison: { bg: "bg-purple-500", text: "text-white", border: "border-purple-600/30", shadow: "shadow-purple-500/10 hover:shadow-purple-500/30", gradient: "from-zinc-900 via-zinc-900 to-purple-950/30 hover:border-purple-600/60" },
  ground: { bg: "bg-amber-600", text: "text-white", border: "border-amber-700/30", shadow: "shadow-amber-600/10 hover:shadow-amber-600/30", gradient: "from-zinc-900 via-zinc-900 to-amber-950/30 hover:border-amber-700/60" },
  rock: { bg: "bg-stone-500", text: "text-white", border: "border-stone-600/30", shadow: "shadow-stone-500/10 hover:shadow-stone-500/30", gradient: "from-zinc-900 via-zinc-900 to-stone-900 hover:border-stone-600/60" },
  bug: { bg: "bg-lime-500", text: "text-white", border: "border-lime-600/30", shadow: "shadow-lime-500/10 hover:shadow-lime-500/30", gradient: "from-zinc-900 via-zinc-900 to-lime-950/30 hover:border-lime-600/60" },
  ghost: { bg: "bg-violet-700", text: "text-white", border: "border-violet-700/30", shadow: "shadow-violet-700/10 hover:shadow-violet-700/30", gradient: "from-zinc-900 via-zinc-900 to-violet-950/30 hover:border-violet-700/60" },
  steel: { bg: "bg-slate-400", text: "text-zinc-950", border: "border-slate-500/30", shadow: "shadow-slate-400/10 hover:shadow-slate-400/30", gradient: "from-zinc-900 via-zinc-900 to-slate-900 hover:border-slate-500/60" },
};

const getPokemonId = (url) => {
  const parts = url.split("/");
  return parts[parts.length - 2];
};

export default function Pokemon({ data, setSelectedPokemon, squad, toggleSquad }) {
  // Parallel query setup using TanStack useQueries
  const results = useQueries({
    queries: data.map((p) => ({
      queryKey: ["pokemon", p.url],
      queryFn: () => fetchPokemonDetailsByURL(p.url),
      staleTime: 60 * 60 * 1000, // cache for 1 hour
      gcTime: 120 * 60 * 1000,
    })),
  });

  const isLoading = results.some((res) => res.isPending);


  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-6">
      {isLoading ? (
        // Grid Skeleton loader (perfect dimensions for responsive mobile columns)
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4 md:gap-5">
          {Array.from({ length: data.length || 24 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-3 flex flex-col items-center animate-pulse"
            >
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-zinc-800 rounded-xl mb-3" />
              <div className="h-3.5 bg-zinc-800 rounded w-16 mb-2" />
              <div className="h-2.5 bg-zinc-800 rounded w-10" />
            </div>
          ))}
        </div>
      ) : (
        // The responsive grid for desktop and compact columns for mobile.
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4 md:gap-5">
          {results.map((res, index) => {
            const pokemon = res.data;
            if (!pokemon) return null;

            const originalUrl = data[index]?.url;
            const primaryType = pokemon.types[0]?.type.name || "normal";
            const typeStyle = typeColors[primaryType] || typeColors.normal;
            const isSquadMember = squad.some((s) => s.id === pokemon.id);

            return (
              <motion.div
                key={pokemon.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.015 }}
                onClick={() => setSelectedPokemon(originalUrl)}
                className={`
                  group relative flex flex-col items-center p-3 rounded-2xl
                  bg-linear-to-br ${typeStyle.gradient}
                  border border-zinc-850 shadow-md ${typeStyle.shadow}
                  hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300
                  cursor-pointer select-none overflow-hidden
                `}
              >
                {/* Squad Quick-Toggle Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSquad(pokemon);
                  }}
                  className={`
                    absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-lg
                    border border-zinc-800 text-xs transition cursor-pointer hover:scale-105 active:scale-95
                    ${isSquadMember
                      ? "bg-red-500/25 border-red-500/40 text-red-400 font-bold"
                      : "bg-zinc-900/80 hover:bg-zinc-850 text-zinc-400 hover:text-white"
                    }
                  `}
                  title={isSquadMember ? "Remove from Squad" : "Add to Squad"}
                >
                  {isSquadMember ? "✓" : "＋"}
                </button>

                {/* ID Tag */}
                <span className="absolute top-2 left-2 text-[10px] font-mono text-zinc-500">
                  #{String(pokemon.id).padStart(4, "0")}
                </span>

                {/* Pokemon Image */}
                <div className="relative w-14 h-14 sm:w-20 sm:h-20 my-3 flex items-center justify-center">
                  {/* Subtle inner background glow */}
                  <div className="absolute inset-0 bg-white/5 rounded-full filter blur-md opacity-0 group-hover:opacity-100 transition duration-300" />
                  <img
                    src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="w-full h-full object-contain transform group-hover:scale-110 group-hover:rotate-3 transition duration-300 relative z-10"
                    loading="lazy"
                  />
                </div>

                {/* Title */}
                <h3 className="text-xs sm:text-sm font-black capitalize text-zinc-200 text-center tracking-wide group-hover:text-white truncate w-full">
                  {pokemon.name}
                </h3>

                {/* Badges */}
                <div className="flex gap-1 mt-2 flex-wrap justify-center">
                  {pokemon.types.slice(0, 2).map((t) => (
                    <span
                      key={t.type.name}
                      className={`
                        px-1.5 py-0.5 text-[8px] sm:text-[9px] rounded-md font-black tracking-wider uppercase
                        ${typeColors[t.type.name]?.bg || "bg-zinc-700"}
                        ${typeColors[t.type.name]?.text || "text-white"}
                      `}
                    >
                      {t.type.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
