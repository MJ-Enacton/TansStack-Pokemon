import axios from "axios";

export const fetchPokemons = async () => {
  const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=500");
  return res.status === 200 ? res.data.results : [];
};

export const fetchPokemonDetailsByURL = async (url) => {
  const res = await axios.get(url);
  return res.status === 200 ? res.data : [];
};