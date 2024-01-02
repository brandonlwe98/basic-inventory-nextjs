import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';

export async function POST(req: NextRequest, res: Response) {
    const filePath = req.nextUrl.searchParams?.get('file');

    if (filePath) {
        console.log("FILE PATH EXISTS");
        const fileBuffer = await fs.promises.readFile(filePath).catch((err) => {
            if (err) {
                return NextResponse.json({ message: "Failed to retrieve excel file" }, { status: 400 });
            }
        });

        console.log("RETURN FILE BUFFER");
        return new Response(fileBuffer?.toString(), { 
            headers: { 
                "Content-Type" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition" : filePath
            
        }});
    }

    console.log("FILE PATH DOES NOT EXIST!");
    return NextResponse.json({ message: "Failed to retrieve excel file, no file specified"}, { status: 500});
  }