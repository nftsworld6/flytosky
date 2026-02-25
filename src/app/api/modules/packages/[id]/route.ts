import { NextRequest, NextResponse } from 'next/server'
import { PackagesService } from '../service'
import { updatePackageSchema } from '../types'

const packagesService = new PackagesService()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pkg = await packagesService.getPackageById(params.id)
    return NextResponse.json(pkg)
  } catch (error) {
    if (error instanceof Error && error.message === 'Package not found') {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const input = updatePackageSchema.parse(body)
    const pkg = await packagesService.updatePackage(params.id, input)
    return NextResponse.json(pkg)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await packagesService.deletePackage(params.id)
    return NextResponse.json({ message: 'Package deleted' })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}