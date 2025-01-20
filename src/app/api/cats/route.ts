import { NextResponse } from 'next/server';

interface RawCatData {
  _id: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface FormattedCat {
  id: string;
  url: string;
  breeds: Array<{ name: string }>;
}

const API_URL = 'https://cataas.com/api/cats';

export async function GET(request: Request): Promise<NextResponse<FormattedCat[] | { error: string }>> {
  try {
    const urlParams = new URL(request.url);
    const searchParams = urlParams.searchParams;
    const limit = searchParams.get('limit') || '6';
    const page = searchParams.get('page') || '0';
    const skipCount = Number(page) * Number(limit);

    const response = await fetch(
      `${API_URL}?limit=${limit}&skip=${skipCount}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );
    
    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`);
    }
    
    const rawData = await response.json() as RawCatData[];
    
    const formattedCats: FormattedCat[] = rawData.map((cat) => ({
      id: cat._id,
      url: `https://cataas.com/cat/${cat._id}`,
      breeds: []
    }));
    
    return NextResponse.json(formattedCats);

  } catch (error) {
    console.error("Произошла ошибка:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить котиков" },
      { status: 500 }
    );
  }
}