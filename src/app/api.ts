export interface CatImage {
  url: string;
  breeds: Array<{ name: string }>;
  id: string
}

export const fetchCatData = async (limit: number = 5, page: number = 0): Promise<CatImage[]> => {
  try {
    const response = await fetch(`/api/cats?limit=${limit}&page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json() as { error: string };
      console.error('Ошибка API:', errorData);
      throw new Error(errorData.error || `Ошибка HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error('Неверный формат ответа:', data);
      return [];
    }

    return data as CatImage[];
  } catch (error) {
    console.error("Ошибка при загрузке котиков:", error);
    return [];
  }
};
