import { useQuery } from "@tanstack/react-query";
import { fetchPokemonDetailsByURL } from "./api";

const SinglePokemon = ({ url }) => {
    const {
        data: details,
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ["pokemon", url],
        queryFn: () => fetchPokemonDetailsByURL(url),
        staleTime: 30000,
        gcTime: 60000,
    });

    if (isPending)
        return (
            <div className="text-center mt-6 text-lg font-medium">
                Loading Pokémon...
            </div>
        );

    if (isError)
        return (
            <div className="text-center mt-6 text-red-500">
                Error: {error.message}
            </div>
        );

    return (
        <div className="max-w-3xl mx-auto mt-8 bg-white rounded-2xl shadow-xl p-6">

            <div className="flex flex-col md:flex-row items-center gap-6">
                <img
                    src={details.sprites.other["official-artwork"].front_default}
                    alt={details.name}
                    className="w-48 h-48 object-contain"
                />

                <div>
                    <h2 className="text-4xl font-bold capitalize">
                        {details.name}
                    </h2>

                    <div className="flex gap-2 mt-3 flex-wrap">
                        {details.types.map((t) => (
                            <span
                                key={t.type.name}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                            >
                                {t.type.name}
                            </span>
                        ))}
                    </div>

                    <div className="mt-4 space-y-2">
                        <p>
                            <strong>Height:</strong> {details.height}
                        </p>
                        <p>
                            <strong>Weight:</strong> {details.weight} kg
                        </p>
                        <p>
                            <strong>Species:</strong> {details.species.name}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-2">Abilities</h3>
                <div className="flex flex-wrap gap-2">
                    {details.abilities.map((a) => (
                        <span
                            key={a.ability.name}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded-full"
                        >
                            {a.ability.name}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-3">Stats</h3>

                <div className="space-y-3">
                    {details.stats.map((stat) => (
                        <div key={stat.stat.name}>
                            <div className="flex justify-between">
                                <span className="capitalize">{stat.stat.name}</span>
                                <span>{stat.base_stat}</span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-blue-500 h-3 rounded-full"
                                    style={{
                                        width: `${Math.min(stat.base_stat, 100)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Moves */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-2">
                    Moves ({details.moves.length})
                </h3>

                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    {details.moves.slice(0, 30).map((m) => (
                        <span
                            key={m.move.name}
                            className="bg-gray-100 px-3 py-1 rounded-lg text-sm"
                        >
                            {m.move.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SinglePokemon;