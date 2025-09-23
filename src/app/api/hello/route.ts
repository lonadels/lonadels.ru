import { NextResponse } from "next/server";
import HelloEntity from '@/entities/hello.entity';
import db from '@/lib/db';

export async function GET() {
    const token = await db.proxyToken.findFirst();

    const result: HelloEntity = {
        message: token?.content ?? null
    };

    return NextResponse.json(result, { status: 200 });
}
