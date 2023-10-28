import { useState, useEffect } from "react";

export const KEY = "2ea71f6a";

export default function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoadind, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      //   callback?.();
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            ` http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}
          `,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("something went wrong with fetching movie");
          const data = await res.json();
          if (data.Response === "False") throw new Error("movies not found");
          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();
      //   handleCloseMovie();

      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoadind, error };
}
