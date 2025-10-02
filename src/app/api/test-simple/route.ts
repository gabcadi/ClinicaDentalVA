import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("Simple test API - Starting request");
    
    return NextResponse.json({
      success: true,
      message: "Simple test API is working",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasMongoUri: !!process.env.MONGODB_URI
    });

  } catch (error) {
    console.error("Simple test error:", error);
    return NextResponse.json({
      error: "Simple test failed",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}