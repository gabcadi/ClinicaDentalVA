import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../utils/mongodb";
import Appointment from "../../../models/appointments";

export async function GET(request: NextRequest) {
  try {
    console.log("No-auth materials API - Starting request");
    
    // Step 1: Test basic response
    const step = request.nextUrl.searchParams.get('step') || 'all';
    
    if (step === 'basic') {
      return NextResponse.json({
        message: "Basic API test successful",
        timestamp: new Date().toISOString()
      });
    }
    
    // Step 2: Test database connection
    try {
      await connectDB();
      console.log("Database connected successfully");
      
      if (step === 'connection') {
        return NextResponse.json({
          message: "Database connection successful", 
          timestamp: new Date().toISOString()
        });
      }
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json({ 
        error: "Error de conexión a la base de datos",
        details: dbError instanceof Error ? dbError.message : "Unknown error"
      }, { status: 500 });
    }

    // Step 3: Test simple query
    let appointmentsWithMaterials: any[];
    try {
      console.log("Testing simple query...");
      
      // First, test if we can query appointments at all
      const appointmentCount = await Appointment.countDocuments();
      console.log(`Total appointments in DB: ${appointmentCount}`);
      
      if (step === 'count') {
        return NextResponse.json({
          message: "Database count successful",
          totalAppointments: appointmentCount,
          timestamp: new Date().toISOString()
        });
      }
      
      // Get first few appointments to inspect structure
      const sampleAppointments = await Appointment.find({}).limit(3).lean();
      console.log("Sample appointments:", JSON.stringify(sampleAppointments, null, 2));
      
      if (step === 'sample') {
        return NextResponse.json({
          message: "Sample query successful",
          sampleAppointments: sampleAppointments,
          timestamp: new Date().toISOString()
        });
      }
      
      // Now try to find appointments with materials using a simpler query
      appointmentsWithMaterials = await Appointment.find({
        materials: { $exists: true, $ne: [] }
      })
      .populate("patientId", "nombre email telefono")
      .lean();
      
      console.log(`Found ${appointmentsWithMaterials.length} appointments with materials`);
      
      if (appointmentsWithMaterials.length > 0) {
        console.log("First appointment with materials:", JSON.stringify(appointmentsWithMaterials[0], null, 2));
      }
      
    } catch (queryError) {
      console.error("Database query error:", queryError);
      return NextResponse.json({ 
        error: "Error al consultar la base de datos",
        details: queryError instanceof Error ? queryError.message : "Unknown query error",
        stack: queryError instanceof Error ? queryError.stack : "No stack"
      }, { status: 500 });
    }

    // Procesar y agrupar materiales
    const materialsData: any[] = [];
    const materialsSummary = new Map<string, any>();

    appointmentsWithMaterials.forEach((appointment: any) => {
      if (appointment.materials && appointment.materials.length > 0) {
        appointment.materials.forEach((material: any) => {
          // Agregar cada material individual con información de la cita
          materialsData.push({
            materialId: material._id,
            materialName: material.name,
            materialType: material.type,
            quantity: material.quantity,
            createdAt: material.createdAt,
            appointmentId: appointment._id,
            appointmentDescription: appointment.description,
            appointmentDate: appointment.date,
            appointmentTime: appointment.time,
            patient: appointment.patientId,
            confirmed: appointment.confirmed,
          });

          // Crear resumen agregado por tipo de material
          const key = `${material.name}-${material.type}`;
          if (materialsSummary.has(key)) {
            const existing = materialsSummary.get(key);
            existing.totalQuantity += material.quantity;
            existing.usageCount += 1;
            existing.lastUsed =
              material.createdAt > existing.lastUsed
                ? material.createdAt
                : existing.lastUsed;
          } else {
            materialsSummary.set(key, {
              name: material.name,
              type: material.type,
              totalQuantity: material.quantity,
              usageCount: 1,
              lastUsed: material.createdAt,
            });
          }
        });
      }
    });

    // Convertir el Map a array para el resumen
    const summaryArray = Array.from(materialsSummary.values()).sort(
      (a, b) => b.totalQuantity - a.totalQuantity
    );

    console.log(`Processed ${materialsData.length} individual materials`);
    console.log(`Created ${summaryArray.length} unique material types`);

    return NextResponse.json(
      {
        success: true,
        materials: materialsData,
        summary: summaryArray,
        totalMaterials: materialsData.length,
        totalAppointments: appointmentsWithMaterials.length,
        totalUniqueTypes: summaryArray.length,
        debug: {
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching materials:", error);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : "No stack trace";
    
    console.error("Full error details:", { errorMessage, errorStack });
    
    return NextResponse.json(
      { 
        error: "Error al obtener materiales",
        debug: {
          message: errorMessage,
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}