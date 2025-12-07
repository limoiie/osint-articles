import { NextRequest, NextResponse } from "next/server";
import { parseYamlFile } from "@/lib/yaml-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Validate filename to prevent directory traversal
    if (!filename || filename.includes("..") || filename.includes("/")) {
      return NextResponse.json(
        { error: "Invalid filename" },
        { status: 400 }
      );
    }

    // Ensure the filename ends with .yaml
    if (!filename.endsWith(".yaml")) {
      return NextResponse.json(
        { error: "File must be a YAML file" },
        { status: 400 }
      );
    }

    // Parse the YAML file
    const data = parseYamlFile(filename);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error loading YAML file:", error);
    return NextResponse.json(
      { error: "Failed to load data file" },
      { status: 404 }
    );
  }
}
