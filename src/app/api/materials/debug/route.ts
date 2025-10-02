import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../utils/mongodb";
import Appointment from "../../../models/appointments";

export async function GET(request: NextRequest) {
  try {
    console.log("Debug materials API - Starting request");
    
    // Test basic API response
    console.log("Debug: Basic API test");
    
    // Check environment variables
    const hasMongoUri = !!process.env.MONGODB_URI;
    const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET;
    
    console.log("Environment check:", { hasMongoUri, hasNextAuthSecret });
    
    if (!hasMongoUri) {
      return NextResponse.json({ 
        error: "MONGODB_URI not configured",
        debug: true,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Test database connection
    try {
      console.log("Debug: Attempting database connection");
      await connectDB();
      console.log("Debug: Database connected successfully");
    } catch (dbError) {
      console.error("Debug: Database connection error:", dbError);
      return NextResponse.json({ 
        error: "Database connection failed",
        debug: true,
        dbError: dbError instanceof Error ? dbError.message : "Unknown error",
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Test simple query
    try {
      console.log("Debug: Attempting to count appointments");
      const appointmentCount = await Appointment.countDocuments();
      console.log(`Debug: Found ${appointmentCount} appointments total`);
      
      const materialsCount = await Appointment.countDocuments({
        materials: { $exists: true, $ne: [] }
      });
      console.log(`Debug: Found ${materialsCount} appointments with materials`);
      
      return NextResponse.json({
        success: true,
        debug: true,
        data: {
          totalAppointments: appointmentCount,
          appointmentsWithMaterials: materialsCount,
          environment: {
            hasMongoUri,
            hasNextAuthSecret,
            nodeEnv: process.env.NODE_ENV
          }
        },
        timestamp: new Date().toISOString()
      });
      
    } catch (queryError) {
      console.error("Debug: Database query error:", queryError);
      return NextResponse.json({ 
        error: "Database query failed",
        debug: true,
        queryError: queryError instanceof Error ? queryError.message : "Unknown query error",
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Debug: General error in materials API:", error);
    return NextResponse.json({
      error: "General API error",
      debug: true,
      generalError: error instanceof Error ? error.message : "Unknown general error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}