export interface SiteConfig {
  locale: string;
  currency: string;
  price: string;
  checkoutUrl: string;
  firstButtonText: string;
  purchaseButtonText: string;
}

export const DEFAULT_CONFIG: SiteConfig = {
  locale: "es-AR",
  currency: "ARS",
  price: "$3.500",
  checkoutUrl: "https://folem.mycartpanda.com/checkout/211132863:1",
  firstButtonText: "CREAR MI FIGURITA",
  purchaseButtonText: "⚽ DESBLOQUEAR MI FIGURITA",
};
