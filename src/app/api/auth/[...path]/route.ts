import { getAuth } from "@/lib/auth/server";

export async function GET(request: Request, context: any) {
  return getAuth().handler().GET(request as any, context);
}
export async function POST(request: Request, context: any) {
  return getAuth().handler().POST(request as any, context);
}
export async function PUT(request: Request, context: any) {
  return getAuth().handler().PUT(request as any, context);
}
export async function DELETE(request: Request, context: any) {
  return getAuth().handler().DELETE(request as any, context);
}
export async function PATCH(request: Request, context: any) {
  return getAuth().handler().PATCH(request as any, context);
}
