import { API_CONFIG } from './config';

const fetchNMovies = async () => {
  try {
    const response = await fetch(API_CONFIG.moviesendpoints.movies, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

const searchMovies = async (query) => {
  try {
    const response = await fetch(`${API_CONFIG.moviesendpoints.search}?q=${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

const fetchNSeries = async () => {
  try {
    const response = await fetch(API_CONFIG.seriesendpoints.series, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching series:', error);
    throw error;
  }
};

const searchSeries = async (query) => {
  try {
    const response = await fetch(`${API_CONFIG.seriesendpoints.search}?q=${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching series:', error);
    throw error;
  }
};

const fetchChannels = async () => {
  try {
    const response = await fetch(API_CONFIG.channelsendpoints.channels, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching channels:', error);
    throw error;
  }
};

export { fetchNMovies, searchMovies, fetchNSeries, searchSeries, fetchChannels };
