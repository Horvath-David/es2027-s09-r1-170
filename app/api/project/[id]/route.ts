import { JSON_SERVER_URL } from "@/app/constants"
import { NextResponse } from "next/server"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const res = await fetch(`${JSON_SERVER_URL}/projects/${id}`, {
      method: "PUT",
      body: await request.text(),
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error()
    }

    return NextResponse.json("Saved successfully", {
      status: 202,
    })
  } catch (error) {
    console.error("Error saving state:", error)
    return NextResponse.json({ error: "Failed to save state" }, { status: 500 })
  }
}
