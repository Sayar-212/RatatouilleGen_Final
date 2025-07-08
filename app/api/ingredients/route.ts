import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = 'e8f80145a67c42f7b45ea964cd8fc4e0';
const CLIENT_SECRET = '12dd3fb9ec184675aac36dbd40fd51d2';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  if (!search) {
    return NextResponse.json({ ingredients: [] });
  }

  try {
    // Simple fetch to FatSecret API (simplified for now)
    const response = await fetch(`https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression=${encodeURIComponent(search)}&format=json&oauth_consumer_key=${CLIENT_ID}`);
    
    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    
    // Extract ingredient names - no limits
    const ingredients = data.foods?.food?.map((food: any) => 
      food.food_name.toLowerCase()
    ) || [];

    return NextResponse.json({ ingredients });
  } catch (error) {
    console.error('FatSecret API error:', error);
    return NextResponse.json({ ingredients: [] });
  }
}