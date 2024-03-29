import React, { useState, useEffect, createRef } from "react";
import { SuggestedMediaData } from "../../types/SuggestedMediaData";
import { fetchSuggestedData } from "../../services/dataFetching";
import { useAppSelector } from "../redux/hooks";
import categoryMapping from "../../utils/mappings/categoryMapping";

type SearchBarProps = {
  checkAnswer: (answer: string) => boolean | undefined;
};

const SearchBar = ({ checkAnswer }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [shake, setShake] = useState(false);
  const [suggestedMediaList, setSuggestedMediaList] = useState<
    SuggestedMediaData[]
  >([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
    useState<number>(-1);

  const category = useAppSelector((state) => state.category.category);

  // Handles keyboard navigation for suggestions
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedSuggestionIndex((prevIndex) =>
          prevIndex <= 0 ? suggestedMediaList.length - 1 : prevIndex - 1
        );
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedSuggestionIndex((prevIndex) =>
          prevIndex === suggestedMediaList.length - 1 ? 0 : prevIndex + 1
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [suggestedMediaList]);

  // Handles outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".relative")) return;
      setSuggestedMediaList([]);
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Handles scrolling to the selected suggestion
  const ref = createRef<HTMLDivElement>();
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [ref]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSuggestionIndex !== -1) {
      setSearchTerm(suggestedMediaList[selectedSuggestionIndex].title);
      setSuggestedMediaList([]);
      setSelectedSuggestionIndex(-1);
      return;
    }
    if (searchTerm === "") return;

    // Check Correct Answer
    const answer = checkAnswer(searchTerm);
    setSearchTerm("");
    setSuggestedMediaList([]);
    setSelectedSuggestionIndex(-1);

    // Shake if incorrect
    if (!answer) {
      setShake(true);
      setTimeout(() => {
        setShake(false);
      }, 500);
    }
  };

  const handleSkip = () => {
    checkAnswer("");
    setSearchTerm("");
    setSuggestedMediaList([]);
    setSelectedSuggestionIndex(-1);
  };

  const fetchAndSetSuggestedMediaList = async (input: string) => {
    let uniqueMedia: SuggestedMediaData[] = [];
    if (category === categoryMapping.MANGA) {
      uniqueMedia = await fetchSuggestedData(category, input);
    } else {
      uniqueMedia = await fetch(`api/fetch-list?category=${category}&searchTerm=${input}`).then((res) => res.json());
    }
    setSuggestedMediaList(uniqueMedia);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length <= 2) {
      setSuggestedMediaList([]);
      setSelectedSuggestionIndex(-1);
    } else {
      fetchAndSetSuggestedMediaList(e.target.value);
    }
  };

  const handleSuggestionClick = (movie: string) => {
    setSearchTerm(movie);
    setSuggestedMediaList([]);
  };

  return (
    <div className="relative">
      {suggestedMediaList.length > 0 && (
        <div className="absolute bottom-36 w-full max-w-screen-md max-h-36 overflow-auto bg-zinc-800 rounded-3xl shadow-md border border-zinc-700">
          {suggestedMediaList.map(
            (media: SuggestedMediaData, index: number) => (
              <div
                key={media.title}
                className={`flex items-center justify-between px-4 py-2 cursor-pointer text-white transition duration-300 ${
                  index === selectedSuggestionIndex
                    ? "bg-zinc-700"
                    : "hover:bg-zinc-700"
                }`}
                onClick={() => handleSuggestionClick(media.title)}
                ref={index === selectedSuggestionIndex ? ref : null}
              >
                <span>{media.title}</span>
                {media.img_path && (
                  <img
                    src={media.img_path}
                    alt={media.title}
                    className="h-10 w-auto rounded-lg"
                  />
                )}
              </div>
            )
          )}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-800 rounded-3xl shadow-md p-2 flex flex-wrap"
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => onInputChange(e)}
          className={`w-full p-4 bg-zinc-900 text-white placeholder:text-zinc-500 rounded-3xl focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 ${
            shake ? "animate-shake" : ""
          }`}
        />
        <button
          type="submit"
          className="p-4 flex-grow mt-2 text-white bg-emerald-700 hover:bg-emerald-800 font-medium rounded-3xl text-sm transition duration-300"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={handleSkip}
          className="inline-flex items-center justify-center p-4 mt-2 ml-2 w-1/6 text-white bg-zinc-800 hover:bg-zinc-900 font-medium rounded-3xl text-sm transition duration-300 border border-zinc-700"
        >
          Skip
          <svg
            className="w-3 h-3 ml-2 hidden sm:block"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
