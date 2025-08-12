import { NextResponse } from "next/server";
import connectDB from "../../../utils/mongodb";
import Appointment from "../../../models/appointments";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "ID de cita requerido" },
        { status: 400 }
      );
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return NextResponse.json(
        { message: "Cita no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment, { status: 200 });
  } catch (error) {
    console.error("Error al obtener la cita:", error);
    return NextResponse.json(
      { message: "Error al obtener la cita" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "ID de la cita es requerido" },
        { status: 400 }
      );
    }

    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return NextResponse.json(
        { message: "Cita no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Cita eliminada exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar la cita:", error);
    return NextResponse.json(
      { message: "Error al eliminar la cita" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ message: "ID requerido" }, { status: 400 });
    }

    // Actualización completa (todos los campos obligatorios)
    const requiredFields = [
      "description",
      "date",
      "time",
      "confirmed",
      "materials",
      "doctorReport",
      "totalPrice",
    ];
    const isFullUpdate = requiredFields.every((field) => field in body);

    // Campos permitidos en actualizaciones parciales
    const allowedPartialFields = [
      "doctorReport",
      "totalPrice",
      "materials",
      "confirmed",
    ];
    const hasAllowedField = allowedPartialFields.some((field) => field in body);

    // Si no es actualización completa ni contiene al menos un campo permitido
    if (!isFullUpdate && !hasAllowedField) {
      return NextResponse.json(
        { message: "No se han enviado campos válidos para actualizar la cita" },
        { status: 400 }
      );
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!updatedAppointment) {
      return NextResponse.json(
        { message: "Cita no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedAppointment, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
    return NextResponse.json(
      { message: "Error al actualizar la cita" },
      { status: 500 }
    );
  }
}
