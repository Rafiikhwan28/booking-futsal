"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, LogOut } from "lucide-react"

interface Transaction {
  id: string
  userId: number
  date: string
  time: string
  field: string
  price: number
  paymentMethod: string
  status: string
  createdAt: string
  venue?: {
    name: string
    location: string
  }
}

export default function StatusPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/login")
      return
    }

    setCurrentUser(JSON.parse(user))
    loadTransactions()
  }, [router])

  const loadTransactions = () => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
    const allTransactions = JSON.parse(localStorage.getItem("transactions") || "[]")
    const userTransactions = allTransactions.filter((t: Transaction) => t.userId === user.id)

    // Sort by creation date (newest first)
    setTransactions(
      userTransactions.sort(
        (a: Transaction, b: Transaction) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    )
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      loadTransactions()
      setIsRefreshing(false)
    }, 1000)
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount)
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "success":
        return {
          badge: <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Dikonfirmasi</Badge>,
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          message: "Booking Anda telah dikonfirmasi! Silakan datang sesuai jadwal.",
          color: "text-green-600",
        }
      case "pending":
        return {
          badge: <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Menunggu Konfirmasi</Badge>,
          icon: <Clock className="w-5 h-5 text-yellow-600" />,
          message: "Pembayaran Anda sedang diverifikasi oleh admin. Mohon tunggu konfirmasi.",
          color: "text-yellow-600",
        }
      case "failed":
        return {
          badge: <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Ditolak</Badge>,
          icon: <XCircle className="w-5 h-5 text-red-600" />,
          message: "Pembayaran ditolak. Silakan hubungi customer service untuk informasi lebih lanjut.",
          color: "text-red-600",
        }
      case "cancelled":
        return {
          badge: <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Dibatalkan</Badge>,
          icon: <AlertCircle className="w-5 h-5 text-gray-600" />,
          message: "Booking telah dibatalkan.",
          color: "text-gray-600",
        }
      default:
        return {
          badge: <Badge variant="secondary">Unknown</Badge>,
          icon: <AlertCircle className="w-5 h-5 text-gray-600" />,
          message: "Status tidak diketahui.",
          color: "text-gray-600",
        }
    }
  }

  const pendingCount = transactions.filter((t) => t.status === "pending").length
  const confirmedCount = transactions.filter((t) => t.status === "success").length

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/home")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Home
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold text-green-800">FutsalBook</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={currentUser?.profileImage || "/placeholder.svg"} alt={currentUser?.name} />
                <AvatarFallback className="bg-green-600 text-white text-xs">
                  {currentUser?.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">Halo, {currentUser.name}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push("/profile")}>
              Profile
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push("/transactions")}>
              Semua Transaksi
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Status Booking</h1>
            <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-8 h-8 text-yellow-600" />
                  <div>
                    <div className="text-2xl font-bold">{pendingCount}</div>
                    <div className="text-sm text-gray-600">Menunggu Konfirmasi</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">{confirmedCount}</div>
                    <div className="text-sm text-gray-600">Dikonfirmasi</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">{transactions.length}</div>
                    <div className="text-sm text-gray-600">Total Booking</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Transactions Alert */}
          {pendingCount > 0 && (
            <Card className="mb-8 border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-yellow-600" />
                  <div>
                    <h3 className="font-medium text-yellow-800">
                      Anda memiliki {pendingCount} booking yang menunggu konfirmasi
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Admin sedang memverifikasi pembayaran Anda. Proses ini biasanya memakan waktu 1-24 jam.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transactions List */}
          {transactions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Clock className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Booking</h3>
                <p className="text-gray-500 mb-6">Anda belum melakukan booking lapangan futsal</p>
                <Button onClick={() => router.push("/home")} className="bg-green-600 hover:bg-green-700">
                  Mulai Booking
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {transactions.map((transaction) => {
                const statusInfo = getStatusInfo(transaction.status)
                return (
                  <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">#{transaction.id}</CardTitle>
                          <CardDescription>
                            Dibuat:{" "}
                            {new Date(transaction.createdAt).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </CardDescription>
                        </div>
                        {statusInfo.badge}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Detail Booking</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <strong>Venue:</strong> {transaction.venue?.name || "Unknown Venue"}
                            </div>
                            <div>
                              <strong>Lokasi:</strong> {transaction.venue?.location || "Unknown Location"}
                            </div>
                            <div>
                              <strong>Tanggal:</strong> {new Date(transaction.date).toLocaleDateString("id-ID")}
                            </div>
                            <div>
                              <strong>Waktu:</strong> {transaction.time} -{" "}
                              {(Number.parseInt(transaction.time.split(":")[0]) + 1).toString().padStart(2, "0")}:00
                            </div>
                            <div>
                              <strong>Lapangan:</strong> {transaction.field}
                            </div>
                            <div>
                              <strong>Total:</strong>{" "}
                              <span className="font-bold text-green-600">{formatCurrency(transaction.price)}</span>
                            </div>
                            <div>
                              <strong>Pembayaran:</strong> {transaction.paymentMethod}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Status Booking</h4>
                          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                            {statusInfo.icon}
                            <div>
                              <div className="font-medium">{statusInfo.badge}</div>
                              <p className={`text-sm mt-1 ${statusInfo.color}`}>{statusInfo.message}</p>
                            </div>
                          </div>

                          {transaction.status === "pending" && (
                            <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                              <strong>Tips:</strong> Pastikan Anda telah melakukan pembayaran sesuai instruksi. Jika
                              sudah lebih dari 24 jam, silakan hubungi customer service.
                            </div>
                          )}

                          {transaction.status === "success" && (
                            <div className="text-xs text-green-700 bg-green-50 p-3 rounded-lg">
                              <strong>Selamat!</strong> Booking Anda telah dikonfirmasi. Jangan lupa datang 15 menit
                              sebelum waktu bermain.
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Help Section */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-medium text-blue-900 mb-2">Butuh Bantuan?</h3>
              <p className="text-sm text-blue-800 mb-4">
                Jika Anda memiliki pertanyaan tentang status booking atau mengalami kendala, jangan ragu untuk
                menghubungi customer service kami.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent">
                  WhatsApp: +62 812-3456-7890
                </Button>
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent">
                  Email: support@futsalbook.com
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
