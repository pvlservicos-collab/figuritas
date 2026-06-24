"use client";
import ResultScreen from "@/components/ResultScreen";

export default function VerPreco() {
  return (
    <ResultScreen
      stickerUrl="/mateo.webp"
      stickerId="preview"
      onRetry={() => {}}
      checkoutUrl="https://buy.stripe.com/5kQ00jfSb01P1JH0nR5Vu05"
      price="$3.500"
    />
  );
}
