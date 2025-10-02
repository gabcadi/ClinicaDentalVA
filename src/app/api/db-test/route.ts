import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../utils/mongodb";
import Appointment from "../../models/appointments";

export async function GET(request: NextRequest) {
  try {
    console.log("Simple DB test - Starting");
    
    // Test database connection
    await connectDB();
    console.log("Database connected");
    
    // Test basic query
    const count = await Appointment.countDocuments();
    console.log("Total appointments:", count);
    
    // Test getting one appointment
    const firstAppointment = await Appointment.findOne({});
    console.log("First appointment:", firstAppointment);
    
    return NextResponse.json({
      success: true,
      totalAppointments: count,
      hasAppointments: count > 0,
      firstAppointmentId: firstAppointment?._id,
      firstAppointmentHasMaterials: firstAppointment?.materials?.length ? firstAppointment.materials.length > 0 : false,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Simple DB test error:", error);
    return NextResponse.json({
      error: "Database test failed",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}