import { NextRequest, NextResponse } from 'next/server'
import { PackagesService } from './service'
import { createPackageSchema } from './types'

const packagesService = new PackagesService()

export async function GET() {
  try {
    const packages = await packagesService.getAllPackages()
    return NextResponse.json(packages)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const input = createPackageSchema.parse(body)
    const pkg = await packagesService.createPackage(input)
    return NextResponse.json(pkg, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// For individual package operations, we'd use /api/modules/packages/[id]/route.ts
// But for simplicity, keeping basic CRUD here