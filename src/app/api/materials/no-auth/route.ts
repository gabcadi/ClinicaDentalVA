import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../utils/mongodb";
import Appointment, { IMaterial, IAppointment } from "../../../models/appointments";

export async function GET(request: NextRequest) {
  try {
    console.log("No-auth materials API - Starting request");
    
    // Connect to database with error handling
    try {
      await connectDB();
      console.log("Database connected successfully");
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json({ error: "Error de conexión a la base de datos" }, { status: 500 });
    }

    // Buscar todas las citas que tengan materiales
    let appointmentsWithMaterials: IAppointment[];
    try {
      console.log("Querying appointments with materials...");
      
      // First, let's get all appointments to debug
      const allAppointments = await Appointment.find({}).select("_id description materials");
      console.log(`Total appointments in DB: ${allAppointments.length}`);
      
      // Log a few examples
      allAppointments.slice(0, 3).forEach((apt, index) => {
        console.log(`Appointment ${index + 1}:`, {
          id: apt._id,
          description: apt.description,
          hasMaterials: apt.materials && apt.materials.length > 0,
          materialsCount: apt.materials ? apt.materials.length : 0
        });
      });
      
      // Filter appointments that have materials
      appointmentsWithMaterials = await Appointment.find({
        $and: [
          { materials: { $exists: true } },
          { materials: { $ne: [] } },
          { "materials.0": { $exists: true } }
        ]
      })
        .populate("patientId", "nombre email telefono")
        .select(
          "description date time materials patientId confirmed doctorReport totalPrice"
        )
        .sort({ date: -1 })
        .lean(); // Use lean() for better performance
      
      console.log(`Found ${appointmentsWithMaterials.length} appointments with materials`);
      
      // Log the first appointment for debugging
      if (appointmentsWithMaterials.length > 0) {
        console.log("First appointment with materials:", JSON.stringify(appointmentsWithMaterials[0], null, 2));
      }
      
    } catch (queryError) {
      console.error("Database query error:", queryError);
      return NextResponse.json({ error: "Error al consultar la base de datos" }, { status: 500 });
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