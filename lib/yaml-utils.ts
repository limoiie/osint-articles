import fs from "fs";
import path from "path";
import { parse } from "yaml";
import type { YamlData, DataFileInfo } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Get all YAML files from the data directory
 */
export function getDataFiles(): DataFileInfo[] {
  try {
    const files = fs.readdirSync(DATA_DIR);
    const yamlFiles = files.filter((file) => file.endsWith(".yaml"));

    return yamlFiles.map((filename) => {
      const data = parseYamlFile(filename);
      return {
        filename,
        data,
      };
    });
  } catch (error) {
    console.error("Error reading data directory:", error);
    return [];
  }
}

/**
 * Parse a specific YAML file and return typed data
 */
export function parseYamlFile(filename: string): YamlData {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const parsed = parse(fileContent) as YamlData;
    return parsed;
  } catch (error) {
    console.error(`Error parsing YAML file ${filename}:`, error);
    throw error;
  }
}

/**
 * Get a single data file by filename
 */
export function getDataFile(filename: string): DataFileInfo | null {
  try {
    const data = parseYamlFile(filename);
    return {
      filename,
      data,
    };
  } catch (error) {
    console.error(`Error getting data file ${filename}:`, error);
    return null;
  }
}

