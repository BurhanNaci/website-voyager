import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[API Route] Cart abandonment trigger:', body);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock successful response
    const response = {
      success: true,
      message: 'Cart abandonment notification triggered successfully',
      notification_id: `notif_${Date.now()}`,
      user_id: body.user_id,
      triggered_at: new Date().toISOString(),
    };
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('[API Route] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
