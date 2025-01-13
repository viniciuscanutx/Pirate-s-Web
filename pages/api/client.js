import axios from "axios";
import { API_CONFIG } from "./config";

const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchMovies = async () => {
  try {
    const response = await apiClient.get(API_CONFIG.moviesendpoints.movies);
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

export const searchMovies = async (query) => {
    try {
      const response = await apiClient.get(`${API_CONFIG.moviesendpoints.search}`, {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching movies:", error);
      throw error;
    }
};

export const fetchSeries = async () => {
    try {
      const response = await apiClient.get(API_CONFIG.seriesendpoints.series);
      return response.data;
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw error;
    }
};

export const searchSeries = async (query) => {
    try {
      const response = await apiClient.get(`${API_CONFIG.seriesendpoints.search}`, {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching movies:", error);
      throw error;
    }
};

export const fetchChannels = async () => {
    try {
      const response = await apiClient.get(API_CONFIG.channelsendpoints.channels);
      return response.data;
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw error;
    }
};