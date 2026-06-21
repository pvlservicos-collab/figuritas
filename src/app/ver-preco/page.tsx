"use client";
import ResultScreen from "@/components/ResultScreen";

export default function VerPreco() {
  return (
    <ResultScreen
      stickerUrl="/mateo.webp"
      stickerId="preview"
      onRetry={() => {}}
      checkoutUrl="https://folem.mycartpanda.com/checkout/211132863:1"
      price="$3.500"
    />
  );
}
