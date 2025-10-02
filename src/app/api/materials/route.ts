import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../utils/mongodb";
import Appointment from "../../models/appointments";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    console.log("Starting materials API request");
    
    // Debug mode - temporarily enabled to test basic API functionality
    return NextResponse.json({ 
      message: "API is working", 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasMongoUri: !!process.env.MONGODB_URI
    });
    
    // Check environment variables
    if (!process.env.NEXTAUTH_SECRET) {
      console.error("NEXTAUTH_SECRET is not set");
      return NextResponse.json({ 
        error: "Configuración de autenticación faltante",
        debug: "NEXTAUTH_SECRET environment variable is missing"
      }, { status: 500 });
    }
    
    if (!process.env.MONGODB_URI) { 
      console.error("MONGODB_URI is not set");
      return NextResponse.json({ 
        error: "Configuración de base de datos faltante",
        debug: "MONGODB_URI environment variable is missing"
      }, { status: 500 });
    }
    
    // Get session with error handling
    let session;
    try {
      console.log("Getting server session...");
      session = await getServerSession(authOptions);
      console.log("Session obtained:", session ? "Success" : "No session");
    } catch (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json({ 
        error: "Error de autenticación",
        debug: authError instanceof Error ? authError.message : "Unknown auth error"
      }, { status: 500 });
    }

    // Si la sesión es null, ¡problema de secreto!
    if (!session) {
      console.log("Fallo de sesión: La sesión es null");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    console.log("Sesión recibida en API - User ID:", session?.user?.email);

    const userRole = (session.user as any)?.role;
    console.log("User role found:", userRole);
    
    if (userRole !== "admin") {
      console.log(`Fallo de Rol: Se leyó "${userRole}". No es "admin"`);
      return NextResponse.json({ error: "Acceso denegado." }, { status: 403 });
    }

    // Connect to database with error handling
    try {
      console.log("Connecting to database...");
      await connectDB();
      console.log("Database connected successfully");
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json({ 
        error: "Error de conexión a la base de datos",
        debug: dbError instanceof Error ? dbError.message : "Unknown database error"
      }, { status: 500 });
    }

    // Buscar todas las citas que tengan materiales
    let appointmentsWithMaterials;
    try {
      console.log("Searching for appointments with materials...");
      appointmentsWithMaterials = await Appointment.find({
        materials: { $exists: true, $ne: [] },
      })
        .populate("patientId", "nombre email telefono")
        .select(
          "description date time materials patientId confirmed doctorReport"
        )
        .sort({ date: -1 });
      
      console.log(`Found ${appointmentsWithMaterials.length} appointments with materials`);
    } catch (queryError) {
      console.error("Database query error:", queryError);
      return NextResponse.json({ 
        error: "Error al consultar la base de datos",
        debug: queryError instanceof Error ? queryError.message : "Unknown query error"
      }, { status: 500 });
    }

    // Procesar y agrupar materiales
    console.log("Processing materials data...");
    const materialsData: any[] = [];
    const materialsSummary = new Map<string, any>();

    try {
      appointmentsWithMaterials.forEach((appointment, appointmentIndex) => {
        if (appointment.materials && appointment.materials.length > 0) {
          appointment.materials.forEach((material, materialIndex) => {
            try {
              // Validar que el material tiene las propiedades necesarias
              if (!material.name || !material.type || material.quantity === undefined) {
                console.warn(`Invalid material found at appointment ${appointmentIndex}, material ${materialIndex}:`, material);
                return; // Skip this material
              }

              // Agregar cada material individual con información de la cita
              materialsData.push({
                materialId: material._id || `temp-${appointmentIndex}-${materialIndex}`,
                materialName: material.name,
                materialType: material.type,
                quantity: material.quantity,
                createdAt: material.createdAt || appointment.date,
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
                existing.totalQuantity += material.quantity || 0;
                existing.usageCount += 1;
                const materialDate = material.createdAt || appointment.date;
                existing.lastUsed = materialDate > existing.lastUsed ? materialDate : existing.lastUsed;
              } else {
                materialsSummary.set(key, {
                  name: material.name,
                  type: material.type,
                  totalQuantity: material.quantity || 0,
                  usageCount: 1,
                  lastUsed: material.createdAt || appointment.date,
                });
              }
            } catch (materialError) {
              console.error(`Error processing material ${materialIndex} in appointment ${appointmentIndex}:`, materialError);
              // Continue processing other materials
            }
          });
        }
      });
      
      console.log(`Processed ${materialsData.length} materials successfully`);
    } catch (processingError) {
      console.error("Error processing materials:", processingError);
      return NextResponse.json({ 
        error: "Error procesando materiales",
        debug: processingError instanceof Error ? processingError.message : "Unknown processing error"
      }, { status: 500 });
    }

    // Convertir el Map a array para el resumen
    console.log("Building summary array...");
    let summaryArray;
    try {
      summaryArray = Array.from(materialsSummary.values()).sort(
        (a, b) => (b.totalQuantity || 0) - (a.totalQuantity || 0)
      );
      console.log(`Created summary with ${summaryArray.length} unique materials`);
    } catch (summaryError) {
      console.error("Error building summary:", summaryError);
      summaryArray = [];
    }

    const responseData = {
      materials: materialsData,
      summary: summaryArray,
      totalMaterials: materialsData.length,
      totalAppointments: appointmentsWithMaterials.length,
      totalUniqueTypes: summaryArray.length,
      timestamp: new Date().toISOString()
    };

    console.log("Materials API response prepared successfully");
    return NextResponse.json(responseData, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching materials:", error);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : "No stack trace";
    
    console.error("Full error details:", { errorMessage, errorStack });
    
    const errorResponse = {
      error: "Error al obtener materiales",
      timestamp: new Date().toISOString(),
      debug: {
        message: errorMessage,
        environment: process.env.NODE_ENV,
        // Only include stack trace in development
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
      }
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
