const Pokemon = ({ data, setSelectedPokemon }) => {

  const handleSelect = (url) => {
    setSelectedPokemon(url);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      <p className="text-2xl font-black mb-4 px-2 text-center mt-10">POKEMON LIST</p>
      <div className="flex flex-row flex-wrap gap-4 justify-center mt-6">
        {data.map((p) => (
          <div
            key={p.name}
            onClick={() => { handleSelect(p.url) }}
            className="w-40 p-4 bg-white border rounded-xl shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
          >
            <p className="text-lg font-semibold capitalize">
              {p.name}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Pokemon;
