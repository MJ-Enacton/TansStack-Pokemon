import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllPokemons, fetchTypes, fetchPokemonByType } from "./api";
import Pokemon from "./Pokemon";
import SinglePokemon from "./SinglePokemon";
import Buttons from "./Buttons";
import Squad from "./Squad";

const typeColors = {
  fire: "bg-red-500 text-white",
  water: "bg-blue-500 text-white",
  grass: "bg-green-500 text-white",
  electric: "bg-yellow-450 text-zinc-950",
  psychic: "bg-pink-500 text-white",
  ice: "bg-cyan-300 text-zinc-950",
  dragon: "bg-indigo-600 text-white",
  dark: "bg-neutral-800 text-white",
  fairy: "bg-pink-400 text-white",
  normal: "bg-zinc-400 text-zinc-950",
  fighting: "bg-red-700 text-white",
  flying: "bg-sky-400 text-zinc-950",
  poison: "bg-purple-500 text-white",
  ground: "bg-amber-655 text-white",
  rock: "bg-stone-500 text-white",
  bug: "bg-lime-500 text-white",
  ghost: "bg-violet-700 text-white",
  steel: "bg-slate-400 text-zinc-950",
};

const getPokemonId = (url) => {
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
};

export default function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(null); // type URL
  const [sortBy, setSortBy] = useState("id-asc");
  const [index, setIndex] = useState(0);
  const pageSize = 24; // divisible by 2, 3, 4, 6, 8 for responsive grids!

  // Squad state persisted in local storage
  const [squad, setSquad] = useState(() => {
    try {
      const saved = localStorage.getItem("pokesquad");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("pokesquad", JSON.stringify(squad));
  }, [squad]);

  // Load all pokemons for full client-side search/sort/filter
  const {
    data: allPokemons,
    isPending: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
  } = useQuery({
    queryKey: ["all-pokemons"],
    queryFn: fetchAllPokemons,
    staleTime: Infinity, // never expires in this session
    gcTime: Infinity,
  });

  // Load type filters list
  const { data: typesList } = useQuery({
    queryKey: ["pokemon-types"],
    queryFn: fetchTypes,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // Load specific type list if filter is selected
  const { data: typePokemons, isPending: isLoadingType } = useQuery({
    queryKey: ["type-pokemons", selectedType],
    queryFn: () => fetchPokemonByType(selectedType),
    enabled: !!selectedType,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // Toggle squad builder helper
  const toggleSquad = (pokemon) => {
    const isMember = squad.some((s) => s.id === pokemon.id);
    if (isMember) {
      setSquad((prev) => prev.filter((s) => s.id !== pokemon.id));
    } else {
      if (squad.length >= 6) return;
      // Add pokemon details into squad state
      setSquad((prev) => [...prev, pokemon]);
    }
  };

  const removeSquadMemberByName = (name) => {
    setSquad((prev) => prev.filter((s) => s.name !== name));
  };

  // Reset pagination index when filters or sorts change
  const resetIndex = () => setIndex(0);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    resetIndex();
  };

  const handleTypeSelect = (url) => {
    setSelectedType((prev) => (prev === url ? null : url));
    resetIndex();
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    resetIndex();
  };

  // Compute filtered & sorted pokemon list
  const filteredPokemons = useMemo(() => {
    let list = [];

    if (selectedType) {
      list = typePokemons || [];
    } else {
      list = allPokemons || [];
    }

    // Filter by search query (checks name or ID matches)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const id = getPokemonId(p.url);
        return p.name.toLowerCase().includes(q) || String(id).includes(q);
      });
    }

    // Sort list
    list = [...list].sort((a, b) => {
      const idA = getPokemonId(a.url);
      const idB = getPokemonId(b.url);

      if (sortBy === "id-asc") return idA - idB;
      if (sortBy === "id-desc") return idB - idA;
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      return 0;
    });

    return list;
  }, [allPokemons, typePokemons, selectedType, searchQuery, sortBy]);

  // Paginated slice
  const paginatedPokemons = useMemo(() => {
    return filteredPokemons.slice(index, index + pageSize);
  }, [filteredPokemons, index, pageSize]);

  // Global loading states
  if (isLoadingAll) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 gap-4">
        <div className="w-12 h-12 border-4 border-t-red-500 border-zinc-800 rounded-full animate-spin" />
        <h2 className="text-lg font-bold tracking-wider uppercase">Initializing PokéDex Database...</h2>
        <p className="text-xs text-zinc-650">Fetching global species files and graphics</p>
      </div>
    );
  }

  if (isErrorAll) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 p-6">
        <div className="bg-zinc-900 border border-zinc-850 p-8 rounded-3xl text-center max-w-md shadow-2xl">
          <p className="text-red-500 text-3xl mb-4">⚠️</p>
          <h2 className="text-xl font-bold text-zinc-200">Database Connection Failed</h2>
          <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
            Could not connect to PokéAPI. Please check your internet connection and reload the portal.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2.5 bg-red-650 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition cursor-pointer"
          >
            Reload PokéDex
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-24 relative overflow-x-hidden">
      {/* Header Banner */}
      <header className="pt-10 pb-6 border-b border-zinc-900/60 bg-zinc-900/20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] bg-red-500/5 filter blur-[60px] pointer-events-none rounded-full" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-widest text-zinc-200">
          ⚡ POKÉDEX <span className="text-red-500">EXPLORER</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-2 tracking-wide font-medium">
          Assemble your custom squad, inspect battle stats, and search real-time details.
        </p>
      </header>

      {/* Control Dashboard: Search, Filter & Sort */}
      <div className="max-w-7xl mx-auto px-4 mt-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search Bar */}
          <div className="relative w-full md:flex-1">
            <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search by name or national ID..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-11 pr-10 py-3 bg-zinc-900 border border-zinc-850 rounded-2xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-red-500/70 focus:ring-1 focus:ring-red-500/35 transition-all shadow-md font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  resetIndex();
                }}
                className="absolute inset-y-0 right-4 flex items-center text-zinc-500 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Controller */}
          <div className="w-full md:w-56">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full py-3 px-4 bg-zinc-900 border border-zinc-850 rounded-2xl text-sm text-zinc-350 focus:outline-hidden focus:border-red-500/70 transition-all shadow-md font-medium cursor-pointer"
            >
              <option value="id-asc">National ID (Ascending)</option>
              <option value="id-desc">National ID (Descending)</option>
              <option value="name-asc">Name (A - Z)</option>
              <option value="name-desc">Name (Z - A)</option>
            </select>
          </div>
        </div>

        {/* Types Horizontal Filter List */}
        {typesList && (
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                Type Filter
              </span>
              {selectedType && (
                <button
                  onClick={() => {
                    setSelectedType(null);
                    resetIndex();
                  }}
                  className="text-[10px] font-bold text-red-400 hover:text-red-300 font-mono cursor-pointer"
                >
                  Clear Filter
                </button>
              )}
            </div>
            {/* Scrollable container of type pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none select-none scroll-smooth">
              {typesList
                .filter((type) => type.name !== "unknown" && type.name !== "shadow")
                .map((type) => {
                  const isActive = selectedType === type.url;
                  const pillColor = typeColors[type.name] || "bg-zinc-800 text-zinc-400";
                  return (
                    <button
                      key={type.name}
                      onClick={() => handleTypeSelect(type.url)}
                      className={`
                        px-4 py-1.5 rounded-full text-xs font-black capitalize border transition-all duration-200 cursor-pointer whitespace-nowrap
                        ${isActive
                          ? `${pillColor} border-white/20 shadow-md scale-105`
                          : "bg-zinc-900 border-zinc-850 hover:border-zinc-750 text-zinc-400 hover:text-zinc-200"
                        }
                      `}
                    >
                      {type.name}
                    </button>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Main Grid View */}
      {selectedType && isLoadingType ? (
        <div className="w-full flex items-center justify-center py-20 text-zinc-500 text-xs font-bold gap-3">
          <div className="w-6 h-6 border-2 border-t-red-500 border-zinc-800 rounded-full animate-spin" />
          <span>Synchronizing Type Manifest...</span>
        </div>
      ) : filteredPokemons.length === 0 ? (
        <div className="w-full text-center py-20 text-zinc-500 font-medium">
          <p className="text-lg">No Pokémon found matching current query</p>
          <p className="text-xs text-zinc-650 mt-1">Try clearing your filters or adjustments</p>
        </div>
      ) : (
        <>
          <Pokemon
            data={paginatedPokemons}
            setSelectedPokemon={setSelectedPokemon}
            squad={squad}
            toggleSquad={toggleSquad}
          />

          {/* Improved Responsive Pagination */}
          <Buttons
            index={index}
            setIndex={setIndex}
            pageSize={pageSize}
            totalCount={filteredPokemons.length}
          />
        </>
      )}

      {/* Slide-out Sidebar PokéSquad Drawer & Analyzer */}
      <Squad
        squad={squad}
        onRemove={removeSquadMemberByName}
        onSelect={setSelectedPokemon}
      />

      {/* Detailed Modal view */}
      {selectedPokemon && (
        <SinglePokemon
          url={selectedPokemon}
          setSelectedPokemon={setSelectedPokemon}
          squad={squad}
          toggleSquad={toggleSquad}
        />
      )}
    </div>
  );
}
