import { NextResponse } from 'next/server';

interface RawCatData {
  id: string;
  url: string;
  breeds: Array<{ name: string }>;
}

interface FormattedCat {
  id: string;
  url: string;
  breeds: Array<{ name: string }>;
}

const API_URL = 'https://api.thecatapi.com/v1/images/search';

export async function GET(request: Request): Promise<NextResponse<FormattedCat[] | { error: string }>> {
  try {
    const urlParams = new URL(request.url);
    const searchParams = urlParams.searchParams;
    const limit = searchParams.get('limit') || '6';
    const page = searchParams.get('page') || '0';

    const headers = new Headers({
      "Content-Type": "application/json",
      "x-api-key": "DEMO-API-KEY"
    });

    const response = await fetch(
      `${API_URL}?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: headers,
        cache: 'no-store'
      }
    );
    
    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`);
    }
    
    const rawData = await response.json() as RawCatData[];
    
    const formattedCats: FormattedCat[] = rawData.map((cat) => ({
      id: cat.id,
      url: cat.url,
      breeds: cat.breeds || []
    }));
    
    return NextResponse.json(formattedCats);

  } catch (error) {
    return NextResponse.json(
      { error: "Не удалось загрузить котиков" },
      { status: 500 }
    );
  }
}