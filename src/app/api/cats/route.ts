import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '5';

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": "live_tR4dIBuckyTrhTAvk0pxfanEG44RmXDSg1VGm3fBNf5m5OoyRBuvqanmqpoOkWC1",
    "Accept": "application/json",
    "Cache-Control": "no-cache",
  };

  try {
    const response = await fetch(
      `https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=${limit}`,
      { 
        headers,
        cache: 'no-store'
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching cat data:", error);
    return NextResponse.json({ error: "Failed to fetch cats" }, { status: 500 });
  }
} 