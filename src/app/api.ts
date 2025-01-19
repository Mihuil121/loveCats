
export interface CatImage {
  url: string;
  breeds: Array<{ name: string }>;
  id:string
}

export const fetchCatData = async (limit: number = 5): Promise<CatImage[]> => {
  const headers = new Headers({
    "Content-Type": "application/json",
    "x-api-key": "live_tR4dIBuckyTrhTAvk0pxfanEG44RmXDSg1VGm3fBNf5m5OoyRBuvqanmqpoOkWC1",
  });

  const requestOptions: RequestInit = {
    method: 'GET',
    headers: headers,
    redirect: 'follow',
  };

  try {
    const response = await fetch(`https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=${limit}`, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching cat data:", error);
    return [];
  }
};
