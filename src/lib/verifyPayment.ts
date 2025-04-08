export async function verifyPayment(paymentId: string): Promise<boolean> {
  try {
    // 🔹 هنا المفروض تبعت طلب إلى سيرفر بوابة الدفع للتحقق من الدفع
    const response = await fetch(`/api/verify-payment?paymentId=${paymentId}`);
    const data = await response.json();

    // 🔹 لو الدفع ناجح، رجّع true
    return data.success;
  } catch (error) {
    console.error("Error verifying payment:", error);
    return false; // ❌ رجّع false لو في مشكلة
  }
}
