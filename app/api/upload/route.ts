import { NextRequest, NextResponse } from "next/server"

interface ParsedCSV {
  headers: string[]
  rows: Record<string, string>[]
  rowCount: number
}

function parseCSV(text: string): ParsedCSV {
  const lines = text.trim().split("\n")
  if (lines.length === 0) {
    return { headers: [], rows: [], rowCount: 0 }
  }

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""))
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""))
    const row: Record<string, string> = {}
    headers.forEach((header, i) => {
      row[header] = values[i] || ""
    })
    return row
  })

  return { headers, rows, rowCount: rows.length }
}

// In-memory store for uploaded data (in production, use a database)
const uploadedData: Record<string, ParsedCSV & { uploadedAt: string; fileName: string }> = {}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const category = formData.get("category") as string
    const file = formData.get("file") as File

    if (!category || !file) {
      return NextResponse.json({ error: "Missing category or file" }, { status: 400 })
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json({ error: "Only CSV files are accepted" }, { status: 400 })
    }

    const text = await file.text()
    const parsed = parseCSV(text)

    if (parsed.headers.length === 0) {
      return NextResponse.json({ error: "CSV file is empty or invalid" }, { status: 400 })
    }

    uploadedData[category] = {
      ...parsed,
      uploadedAt: new Date().toISOString(),
      fileName: file.name,
    }

    return NextResponse.json({
      success: true,
      category,
      fileName: file.name,
      headers: parsed.headers,
      rowCount: parsed.rowCount,
      preview: parsed.rows.slice(0, 3),
    })
  } catch {
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 })
  }
}

export async function GET() {
  const summary = Object.entries(uploadedData).map(([category, data]) => ({
    category,
    fileName: data.fileName,
    headers: data.headers,
    rowCount: data.rowCount,
    uploadedAt: data.uploadedAt,
  }))

  return NextResponse.json({ uploads: summary, totalCategories: summary.length })
}
