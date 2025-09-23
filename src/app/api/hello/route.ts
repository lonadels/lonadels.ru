import { NextResponse } from "next/server";
import HelloEntity from '@/entities/hello.entity';

export async function GET() {
    const result: HelloEntity = {
        message: 'Hello, world!'
    };

    return NextResponse.json(result, { status: 200 });
}
