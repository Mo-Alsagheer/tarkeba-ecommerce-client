"use client";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
} from "@/features/cart/cartSlice";
import { selectCurrentUser } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import {
  TITLES,
  BUTTONS,
  LABELS,
  CURRENCY,
  MESSAGES,
  PLACEHOLDERS,
} from "@/constants";
import {
  useGetPaymentMethodsQuery,
  useCreatePaymentMutation,
} from "@/features/api/paymentsApi";
import { useCheckoutMutation } from "@/features/api/ordersApi";
import { Loader2, Wallet, Banknote } from "lucide-react";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const user = useAppSelector(selectCurrentUser);
  const customerEmail = user?.email ?? "";

  const getErrorMessage = (err: unknown): string | undefined => {
    if (err && typeof err === "object") {
      const maybeMessage = (err as { message?: unknown }).message;
      if (typeof maybeMessage === "string") return maybeMessage;

      const maybeData = (err as { data?: unknown }).data;
      if (maybeData && typeof maybeData === "object") {
        const dataMessage = (maybeData as { message?: unknown }).message;
        if (typeof dataMessage === "string") return dataMessage;
      }
    }

    if (err instanceof Error) return err.message;
    return undefined;
  };

  const extractRedirectUrl = (res: unknown): string | undefined => {
    if (!res || typeof res !== "object") return undefined;
    const obj = res as Record<string, unknown>;

    const direct = obj.redirectUrl ?? obj.paymentUrl ?? obj.url;
    if (typeof direct === "string") return direct;

    const data = obj.data;
    if (data && typeof data === "object") {
      const dataObj = data as Record<string, unknown>;
      const nested = dataObj.redirectUrl ?? dataObj.paymentUrl ?? dataObj.url;
      if (typeof nested === "string") return nested;
    }

    return undefined;
  };
  const [shippingInfo, setShippingInfo] = useState({
    customerName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    phone: "",
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [walletPhone, setWalletPhone] = useState<string>("");

  const { data: paymentMethods, isLoading: isMethodsLoading } =
    useGetPaymentMethodsQuery();
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();
  const [createPayment, { isLoading: isCreatingPayment }] =
    useCreatePaymentMutation();

  console.log("Selected payment method:", selectedPaymentMethod);
  console.log("Payment methods:", paymentMethods);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">
          {TITLES.COMPONENTS.CART_EMPTY}
        </h1>
        <Button onClick={() => router.push("/products")}>
          {BUTTONS.BROWSE_PRODUCTS}
        </Button>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!customerEmail) {
      toast.error("يرجى تسجيل الدخول أولاً");
      router.push("/login");
      return;
    }
    if (
      !shippingInfo.customerName ||
      !shippingInfo.addressLine1 ||
      !shippingInfo.city ||
      !shippingInfo.state ||
      !shippingInfo.phone
    ) {
      toast.error(MESSAGES.CHECKOUT.ERROR_SHIPPING_ADDRESS);
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error(MESSAGES.CHECKOUT.ERROR_PAYMENT_METHOD);
      return;
    }
    if (selectedPaymentMethod === "wallet" && !walletPhone) {
      toast.error(MESSAGES.CHECKOUT.ERROR_WALLET_PHONE);
      return;
    }

    try {
      // Prepare cart items in the format expected by backend
      const cartItems = items.map((item) => {
        // Extract product ID and size from composite ID (format: "id-size" or just "id")
        const productIdParts = item.productId.split("-");
        const productID = productIdParts[0]; // First part is always the product ID
        const size =
          productIdParts.length > 1
            ? productIdParts.slice(1).join("-")
            : "50ml"; // Rest is size, default to 50ml

        return {
          productID,
          size,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        };
      });

      console.log("Checkout data with email:", customerEmail); // Debug log

      const checkoutData = {
        cartItems,
        shippingAddress: {
          customerName: shippingInfo.customerName,
          addressLine1: shippingInfo.addressLine1,
          addressLine2: shippingInfo.addressLine2 || undefined,
          city: shippingInfo.city,
          state: shippingInfo.state,
          phone: shippingInfo.phone,
        },
        email: customerEmail,
        paymentMethod: selectedPaymentMethod,
        ...(selectedPaymentMethod === "wallet" && {
          walletMsisdn: walletPhone,
        }),
      };

      const response = await checkout(checkoutData).unwrap();

      if (response.success) {
        toast.success(response.message || MESSAGES.CHECKOUT.ORDER_CREATED);

        // Clear the cart after successful order creation
        dispatch(clearCart());

        if (response.paymentRequired) {
          const paymentPayload = {
            orderID: response.order._id,
            amount: Number(response.order.totalAmount ?? total),
            currency: "EGP",
            paymentMethod: selectedPaymentMethod,
            ...(selectedPaymentMethod === "wallet"
              ? { walletMsisdn: walletPhone }
              : {}),
            metadata: {
              orderNumber: response.order.orderNumber,
              customerEmail,
            },
          };

          try {
            const paymentRes = await createPayment(paymentPayload).unwrap();
            const redirectUrl = extractRedirectUrl(paymentRes);

            if (typeof redirectUrl === "string" && redirectUrl.length > 0) {
              if (/^https?:\/\//i.test(redirectUrl)) {
                window.location.href = redirectUrl;
                return;
              }
              router.push(redirectUrl);
              return;
            }

            router.push(`/payment/success?orderId=${response.order._id}`);
          } catch (paymentError: unknown) {
            console.error("Create payment error:", paymentError);
            toast.error(
              getErrorMessage(paymentError) || MESSAGES.CHECKOUT.ORDER_ERROR,
            );
            router.push(`/payment/failure?orderId=${response.order._id}`);
          }
        } else {
          router.push(`/payment/success?orderId=${response.order._id}`);
        }
      }
    } catch (error: unknown) {
      console.error("Checkout error:", error);
      toast.error(getErrorMessage(error) || MESSAGES.CHECKOUT.ORDER_ERROR);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <input type="hidden" name="email" value={customerEmail} readOnly />
        <h1 className="text-3xl font-bold mb-8">
          {TITLES.COMPONENTS.CHECKOUT}
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{TITLES.COMPONENTS.SHIPPING_INFO}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">
                    {LABELS.CHECKOUT.CUSTOMER_NAME}
                  </Label>
                  <Input
                    id="customerName"
                    value={shippingInfo.customerName}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        customerName: e.target.value,
                      })
                    }
                    placeholder={PLACEHOLDERS.CHECKOUT.FULL_NAME}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressLine1">
                    {LABELS.CHECKOUT.ADDRESS_LINE1}
                  </Label>
                  <Input
                    id="addressLine1"
                    value={shippingInfo.addressLine1}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        addressLine1: e.target.value,
                      })
                    }
                    placeholder={PLACEHOLDERS.CHECKOUT.ADDRESS}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">{LABELS.COMMON.CITY}</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          city: e.target.value,
                        })
                      }
                      placeholder={PLACEHOLDERS.CHECKOUT.CITY}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">{LABELS.CHECKOUT.STATE}</Label>
                    <Input
                      id="state"
                      value={shippingInfo.state}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          state: e.target.value,
                        })
                      }
                      placeholder={PLACEHOLDERS.CHECKOUT.STATE}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{LABELS.COMMON.PHONE}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        phone: e.target.value,
                      })
                    }
                    placeholder="01xxxxxxxxx"
                    dir="ltr"
                    className="text-left"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{LABELS.CHECKOUT.PAYMENT_METHOD}</CardTitle>
              </CardHeader>
              <CardContent>
                {isMethodsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {paymentMethods?.map((method) => (
                      <div
                        key={method.value}
                        className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${
                          selectedPaymentMethod === method.value
                            ? "border-primary ring-2 ring-primary"
                            : "border-slate-300"
                        }`}
                        onClick={() => setSelectedPaymentMethod(method.value)}
                      >
                        <div className="flex flex-1">
                          <div className="flex flex-col justify-center">
                            <span className="block text-sm font-medium text-foreground">
                              {method.label}
                            </span>
                            <span className="mt-1 flex items-center text-sm text-muted-foreground">
                              {method.value === "wallet" ? (
                                <Wallet className="ml-2 h-4 w-4" />
                              ) : (
                                <Banknote className="ml-2 h-4 w-4" />
                              )}
                              {method.value === "wallet"
                                ? PLACEHOLDERS.PAYMENT.WALLET
                                : PLACEHOLDERS.PAYMENT.CASH_ON_DELIVERY}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`absolute inset-y-0 left-4 flex items-center ${
                            selectedPaymentMethod === method.value
                              ? "text-primary"
                              : "hidden"
                          }`}
                        >
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedPaymentMethod === "wallet" && (
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="walletPhone">
                      {LABELS.CHECKOUT.WALLET_PHONE}
                    </Label>
                    <Input
                      id="walletPhone"
                      type="tel"
                      placeholder="01xxxxxxxxx"
                      value={walletPhone}
                      onChange={(e) => setWalletPhone(e.target.value)}
                      dir="ltr"
                      className="text-left"
                    />
                    <p className="text-xs text-muted-foreground">
                      {LABELS.CHECKOUT.WALLET_PHONE_HINT}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>{TITLES.COMPONENTS.ORDER_SUMMARY}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {TITLES.COMPONENTS.QUANTITY}: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold">
                        {item.price * item.quantity} {CURRENCY.DEFAULT}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>{TITLES.COMPONENTS.TOTAL}</span>
                    <span className="text-primary">
                      {total.toFixed(2)} {CURRENCY.DEFAULT}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isCheckingOut || isCreatingPayment}
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      {MESSAGES.CHECKOUT.PROCESSING_ORDER}
                    </>
                  ) : isCreatingPayment ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      {MESSAGES.CHECKOUT.PROCESSING_ORDER}
                    </>
                  ) : (
                    BUTTONS.COMPLETE_ORDER
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
