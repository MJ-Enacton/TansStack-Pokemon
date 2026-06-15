import axios from "axios";

export const fetchPokemons = async () => {
  const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=50");
  return res.status === 200 ? res.data.results : [];
};

export const fetchPokemonDetailsByURL = async (url) => {
  const res = await axios.get(url);
  return res.status === 200 ? res.data : null;
};

export const paginationAPI = async (offset = 0) => {
  const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=50&offset=${offset}`);
  return res.status === 200 ? res.data.results : [];
};

export const fetchAllPokemons = async () => {
  const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1500");

  return res.status === 200 ? res.data.results : [];
};

export const fetchTypes = async () => {
  const res = await axios.get("https://pokeapi.co/api/v2/type");
  return res.status === 200 ? res.data.results : [];
};

export const fetchPokemonByType = async (url) => {
  const res = await axios.get(url);
  return res.status === 200 ? res.data.pokemon.map((p) => p.pokemon) : [];
};