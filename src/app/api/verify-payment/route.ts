import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get("paymentId");

  if (!paymentId) {
    return NextResponse.json({ success: false, error: "Missing payment ID" });
  }

  try {
    // 🔹 هتضيف هنا كود التحقق الفعلي من بوابة الدفع
    const isPaymentValid = await fakePaymentCheck(paymentId); // استبدلها بكود حقيقي

    return NextResponse.json({ success: isPaymentValid });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ success: false, error: "Server error" });
  }
}

// 🔹 دالة تجريبية للتحقق من الدفع (بدلها بالدالة الحقيقية)
async function fakePaymentCheck(paymentId: string): Promise<boolean> {
  // 🔹 افترضنا إنه أي Payment ID يبدأ بـ "valid-" فهو دفع ناجح
  return paymentId.startsWith("valid-");
}
