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
  checkoutUrl: "https://buy.stripe.com/5kQ00jfSb01P1JH0nR5Vu05",
  firstButtonText: "CREAR MI FIGURITA",
  purchaseButtonText: "⚽ DESBLOQUEAR MI FIGURITA",
};
