"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Building2, Smartphone, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PaymentMethod {
  id: string
  name: string
  type: string
  icon: React.ReactNode
  description: string
}

export default function CheckoutPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [bookingData, setBookingData] = useState<any>(null)
  const [selectedVenue, setSelectedVenue] = useState<any>(null)
  const [selectedPayment, setSelectedPayment] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const paymentMethods: PaymentMethod[] = [
    {
      id: "bca",
      name: "Bank BCA",
      type: "bank",
      icon: <Building2 className="w-5 h-5" />,
      description: "Transfer melalui Bank BCA",
    },
    {
      id: "bri",
      name: "Bank BRI",
      type: "bank",
      icon: <Building2 className="w-5 h-5" />,
      description: "Transfer melalui Bank BRI",
    },
    {
      id: "mandiri",
      name: "Bank Mandiri",
      type: "bank",
      icon: <Building2 className="w-5 h-5" />,
      description: "Transfer melalui Bank Mandiri",
    },
    {
      id: "ewallet",
      name: "E-Wallet",
      type: "ewallet",
      icon: <Smartphone className="w-5 h-5" />,
      description: "Bayar dengan GoPay, OVO, DANA",
    },
  ]

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    const booking = localStorage.getItem("currentBooking")

    if (!user) {
      router.push("/login")
      return
    }

    if (!booking) {
      router.push("/booking")
      return
    }

    setCurrentUser(JSON.parse(user))
    setBookingData(JSON.parse(booking))
    setSelectedVenue(JSON.parse(booking).venue || null)
  }, [router])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount)
  }

  const handlePayment = async () => {
    if (!selectedPayment) {
      toast({
        title: "Pilih metode pembayaran",
        description: "Silakan pilih metode pembayaran terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      const transaction = {
        id: `TRX-${Date.now()}`,
        userId: currentUser.id,
        date: bookingData.date,
        time: bookingData.time,
        field: bookingData.field,
        price: bookingData.price,
        paymentMethod: paymentMethods.find((p) => p.id === selectedPayment)?.name,
        status: "pending",
        createdAt: new Date().toISOString(),
        venue: bookingData.venue,
        paymentInstructions: getPaymentInstructions(selectedPayment),
      }

      // Save transaction
      const transactions = JSON.parse(localStorage.getItem("transactions") || "[]")
      transactions.push(transaction)
      localStorage.setItem("transactions", JSON.stringify(transactions))

      // Clear current booking
      localStorage.removeItem("currentBooking")

      toast({
        title: "Booking berhasil dibuat!",
        description: "Silakan lakukan pembayaran dan upload bukti di halaman Status Booking.",
      })

      setIsProcessing(false)
      router.push("/status")
    }, 2000)
  }

  const getPaymentInstructions = (paymentId: string) => {
    const instructions = {
      bca: {
        accountNumber: "1234567890",
        accountName: "PT FutsalBook Indonesia",
        steps: [
          "Transfer ke rekening BCA: 1234567890",
          "Atas nama: PT FutsalBook Indonesia",
          "Gunakan kode unik sebagai berita transfer",
          "Simpan bukti transfer untuk diupload nanti",
        ],
      },
      bri: {
        accountNumber: "0987654321",
        accountName: "PT FutsalBook Indonesia",
        steps: [
          "Transfer ke rekening BRI: 0987654321",
          "Atas nama: PT FutsalBook Indonesia",
          "Gunakan kode unik sebagai berita transfer",
          "Simpan bukti transfer untuk diupload nanti",
        ],
      },
      mandiri: {
        accountNumber: "1122334455",
        accountName: "PT FutsalBook Indonesia",
        steps: [
          "Transfer ke rekening Mandiri: 1122334455",
          "Atas nama: PT FutsalBook Indonesia",
          "Gunakan kode unik sebagai berita transfer",
          "Simpan bukti transfer untuk diupload nanti",
        ],
      },
      ewallet: {
        qrCode:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        steps: [
          "Scan QR code dengan aplikasi e-wallet Anda",
          "Konfirmasi pembayaran di aplikasi",
          "Simpan screenshot bukti pembayaran",
          "Upload bukti di halaman Status Booking",
        ],
      },
    }
    return instructions[paymentId as keyof typeof instructions] || null
  }

  if (!currentUser || !bookingData) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold text-green-800">FutsalBook</span>
            </div>
          </div>
          <span className="text-sm text-gray-600">Halo, {currentUser.name}</span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          {/* Booking Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Venue:</span>
                  <span className="font-medium">{bookingData?.venue?.name || "Lapangan Futsal Premium"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lokasi:</span>
                  <span className="font-medium">{bookingData?.venue?.location || "Jakarta"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tanggal:</span>
                  <span className="font-medium">{new Date(bookingData.date).toLocaleDateString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Waktu:</span>
                  <span className="font-medium">
                    {bookingData.time} -{" "}
                    {(Number.parseInt(bookingData.time.split(":")[0]) + 1).toString().padStart(2, "0")}:00
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Lapangan:</span>
                  <span className="font-medium">{bookingData.field}</span>
                </div>
                <div className="flex justify-between">
                  <span>Durasi:</span>
                  <span className="font-medium">1 Jam</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Pembayaran:</span>
                  <span className="text-green-600">{formatCurrency(bookingData.price)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Metode Pembayaran</CardTitle>
              <CardDescription>Pilih metode pembayaran yang Anda inginkan</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="text-gray-600">{method.icon}</div>
                        <div>
                          <Label htmlFor={method.id} className="font-medium cursor-pointer">
                            {method.name}
                          </Label>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          {selectedPayment && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Instruksi Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  {selectedPayment === "ewallet" ? (
                    <>
                      <p>1. Pilih aplikasi e-wallet yang Anda gunakan</p>
                      <p>2. Scan QR code yang akan muncul setelah konfirmasi</p>
                      <p>3. Konfirmasi pembayaran di aplikasi</p>
                      <p>4. Upload bukti pembayaran di halaman Status Booking</p>
                    </>
                  ) : (
                    <>
                      <p>1. Transfer ke nomor rekening yang akan diberikan</p>
                      <p>2. Gunakan kode unik sebagai berita transfer</p>
                      <p>3. Simpan bukti transfer</p>
                      <p>4. Upload bukti pembayaran di halaman Status Booking</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Important Note */}
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-medium text-blue-900 mb-2">📝 Penting!</h3>
              <p className="text-sm text-blue-800 mb-4">
                Setelah melakukan pembayaran, Anda dapat mengupload bukti pembayaran di halaman{" "}
                <strong>Status Booking</strong>. Transaksi akan dikonfirmasi oleh admin dalam 1-24 jam setelah bukti
                pembayaran diupload.
              </p>
            </CardContent>
          </Card>

          {/* Confirm Button */}
          <div className="text-center">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 px-12 min-w-[200px]"
              onClick={handlePayment}
              disabled={!selectedPayment || isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Memproses...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Konfirmasi Booking
                </>
              )}
            </Button>

            {!selectedPayment && (
              <p className="text-sm text-gray-500 mt-3">Pilih metode pembayaran untuk melanjutkan</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
