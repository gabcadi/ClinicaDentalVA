import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../utils/mongodb";
import Appointment from "../../models/appointments";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions); // Usar authOptions aquí a veces ayuda

    // Si la sesión es null, ¡problema de secreto!
    if (!session) {
      console.log("Fallo de sesión: La sesión es null");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    console.log("Sesión recibida en API:", JSON.stringify(session, null, 2));

    const userRole = (session.user as any)?.role;
    if (userRole !== "admin") {
      console.log(`Fallo de Rol: Se leyó "${userRole}". No es "admin"`);
      return NextResponse.json({ error: "Acceso denegado." }, { status: 403 });
    }

    await connectDB();

    // Buscar todas las citas que tengan materiales
    const appointmentsWithMaterials = await Appointment.find({
      materials: { $exists: true, $ne: [] },
    })
      .populate("patientId", "nombre email telefono")
      .select(
        "description date time materials patientId confirmed doctorReport"
      )
      .sort({ date: -1 });

    // Procesar y agrupar materiales
    const materialsData: any[] = [];
    const materialsSummary = new Map<string, any>();

    appointmentsWithMaterials.forEach((appointment) => {
      if (appointment.materials && appointment.materials.length > 0) {
        appointment.materials.forEach((material) => {
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

    return NextResponse.json(
      {
        materials: materialsData,
        summary: summaryArray,
        totalMaterials: materialsData.length,
        totalAppointments: appointmentsWithMaterials.length,
        totalUniqueTypes: summaryArray.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching materials:", error);
    return NextResponse.json(
      { error: "Error al obtener materiales" },
      { status: 500 }
    );
  }
}
