import { getRandomNumber, splitmix32 } from "../utils/random";

let API_CLIENT_ID;
if (typeof process !== "undefined") {
  API_CLIENT_ID = process.env.VITE_MAL_CLIENT_ID;
} else {
  API_CLIENT_ID = import.meta.env.VITE_MAL_CLIENT_ID;
}

const API_URL = `https://api.myanimelist.net/v2/`;
const API_SEARCH_URL =
  `https://myanimelist.net/search/prefix.json?type=`;

const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
    "X-MAL-CLIENT-ID": `${API_CLIENT_ID}`,
  },
};

const fetchRandomAnime = async (isDaily: boolean) => {
  let randomNumber;

  if (isDaily) {
    const currentDate = new Date();

    // Extract day, month, and year
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Adding 1 since months are zero-indexed
    const year = currentDate.getFullYear();

    // Concatenate and parse into a single number
    const singleNumberFromDate = parseInt(
      `${year}${month < 10 ? "0" : ""}${month}${day < 10 ? "0" : ""}${day}`
    );

    randomNumber = splitmix32(singleNumberFromDate, 0, 499);
  } else {
    randomNumber = getRandomNumber(0, 499);
  }

  const animeDataResponse = await fetch(
    `${API_URL}anime/ranking?ranking_type=bypopularity&limit=1&offset=${randomNumber}`,
    options
  )
    .then((res) => res.json())
    .then((data) => data.data[0].node);

  return animeDataResponse;
};

const fetchAnimeDetails = async (id: number) => {
  const animeDetailsResponse = await fetch(
    `${API_URL}anime/${id}?fields=id,title,main_picture,alternative_titles,start_date,synopsis,genres,start_season,source,rating,pictures`,
    options
  ).then((res) => res.json());

  return animeDetailsResponse;
}

const fetchAnimeCredits = async (id: number) => {
  const animeCreditsResponse = await fetch(
    `${API_URL}anime/${id}/characters?fields=id,first_name,last_name,alternative_name,role,main_picture&limit=5`,
    options
  ).then((res) => res.json())
  .then((data) => data.data);

  return animeCreditsResponse;
}

const fetchAnimeList = async (input: string) => {
  const animeListResponse = await fetch(
    `${API_SEARCH_URL}anime&keyword=${input}&v=1`,
    options
  ).then((res) => res.json())
  .then((data) => data.categories[0].items);

  return animeListResponse;
}


export { fetchRandomAnime, fetchAnimeDetails, fetchAnimeCredits, fetchAnimeList };