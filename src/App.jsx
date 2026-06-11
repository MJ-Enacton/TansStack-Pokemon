import { useQuery } from "@tanstack/react-query";
import { fetchPokemons } from "./api";
import Pokemon from "./Pokemon";
import { useState } from "react";
import SinglePokemon from "./SinglePokemon";

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["pokemons"],
    queryFn: fetchPokemons,
  });


  if (isPending) return <p>Loading....</p>;
  if (isError) return <p>Error : {error.message}</p>;


  return (
    <>

      {selectedPokemon && (
        <SinglePokemon url={selectedPokemon} />
      )}
      <Pokemon
        data={data}
        setSelectedPokemon={setSelectedPokemon}
      />

    </>
  );
}

export default App;
