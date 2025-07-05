"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Building2, Smartphone, ArrowLeft, Upload, X, FileImage, CheckCircle } from "lucide-react"
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
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [paymentProofPreview, setPaymentProofPreview] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File terlalu besar",
          description: "Ukuran file maksimal 5MB",
          variant: "destructive",
        })
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Format file tidak valid",
          description: "Hanya file gambar yang diperbolehkan (JPG, PNG, GIF)",
          variant: "destructive",
        })
        return
      }

      setPaymentProof(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setPaymentProofPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)

      toast({
        title: "File berhasil dipilih",
        description: `${file.name} siap untuk diupload`,
      })
    }
  }

  const removePaymentProof = () => {
    setPaymentProof(null)
    setPaymentProofPreview("")
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

    if (!paymentProof) {
      toast({
        title: "Upload bukti pembayaran",
        description: "Silakan upload bukti pembayaran terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setIsUploading(true)

    // Simulate file upload and payment processing
    setTimeout(() => {
      // Convert file to base64 for storage (in real app, upload to server)
      const reader = new FileReader()
      reader.onload = () => {
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
          paymentProof: {
            fileName: paymentProof.name,
            fileSize: paymentProof.size,
            fileType: paymentProof.type,
            uploadedAt: new Date().toISOString(),
            fileData: reader.result as string, // In real app, this would be a URL
          },
        }

        // Save transaction
        const transactions = JSON.parse(localStorage.getItem("transactions") || "[]")
        transactions.push(transaction)
        localStorage.setItem("transactions", JSON.stringify(transactions))

        // Clear current booking
        localStorage.removeItem("currentBooking")

        toast({
          title: "Pembayaran berhasil dikirim!",
          description: "Bukti pembayaran telah diupload. Menunggu konfirmasi admin.",
        })

        setIsProcessing(false)
        setIsUploading(false)
        router.push("/status")
      }

      if (paymentProof) {
        reader.readAsDataURL(paymentProof)
      }
    }, 3000) // Longer delay to simulate upload
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
                      <p>2. Scan QR code yang akan muncul</p>
                      <p>3. Konfirmasi pembayaran di aplikasi</p>
                      <p>4. Tunggu konfirmasi pembayaran</p>
                    </>
                  ) : (
                    <>
                      <p>1. Transfer ke nomor rekening yang akan diberikan</p>
                      <p>2. Gunakan kode unik sebagai berita transfer</p>
                      <p>3. Simpan bukti transfer</p>
                      <p>4. Pembayaran akan dikonfirmasi otomatis</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Payment Proof */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-emerald-600" />
                <span>Upload Bukti Pembayaran</span>
              </CardTitle>
              <CardDescription>Upload screenshot atau foto bukti transfer/pembayaran Anda</CardDescription>
            </CardHeader>
            <CardContent>
              {!paymentProofPreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="payment-proof-upload"
                  />
                  <label htmlFor="payment-proof-upload" className="cursor-pointer flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900 mb-2">Klik untuk upload bukti pembayaran</p>
                      <p className="text-sm text-gray-500">Format: JPG, PNG, GIF (Maksimal 5MB)</p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <img
                          src={paymentProofPreview || "/placeholder.svg"}
                          alt="Bukti Pembayaran"
                          className="w-24 h-24 object-cover rounded-lg border-2 border-emerald-200"
                        />
                        <div className="absolute -top-2 -right-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-6 h-6 rounded-full p-0"
                            onClick={removePaymentProof}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileImage className="w-4 h-4 text-emerald-600" />
                          <span className="font-medium text-gray-900">{paymentProof?.name}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          Ukuran: {paymentProof ? (paymentProof.size / 1024 / 1024).toFixed(2) : 0} MB
                        </p>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">File siap diupload</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Tips Upload Bukti Pembayaran:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Pastikan foto/screenshot jelas dan tidak blur</li>
                      <li>• Sertakan informasi nominal, tanggal, dan waktu transfer</li>
                      <li>• Pastikan nama pengirim sesuai dengan nama akun Anda</li>
                      <li>• File akan diverifikasi oleh admin dalam 1-24 jam</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Button */}
          <div className="text-center">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 px-12 min-w-[200px]"
              onClick={handlePayment}
              disabled={!selectedPayment || !paymentProof || isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isUploading ? "Mengupload Bukti..." : "Memproses Pembayaran..."}
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Kirim Pembayaran
                </>
              )}
            </Button>

            {(!selectedPayment || !paymentProof) && (
              <p className="text-sm text-gray-500 mt-3">
                {!selectedPayment && "Pilih metode pembayaran dan "}
                {!paymentProof && "upload bukti pembayaran untuk melanjutkan"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
