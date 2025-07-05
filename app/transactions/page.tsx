"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, MapPin, CreditCard, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

export default function TransactionsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(user)
    setCurrentUser(userData)

    // Get user's transactions
    const allTransactions = JSON.parse(localStorage.getItem("transactions") || "[]")
    const userTransactions = allTransactions.filter((t: Transaction) => t.userId === userData.id)
    setTransactions(
      userTransactions.sort(
        (a: Transaction, b: Transaction) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    )
  }, [router])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Berhasil</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Menunggu</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Gagal</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

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
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Riwayat Transaksi</h1>
            <Button onClick={() => router.push("/home")} className="bg-green-600 hover:bg-green-700">
              Booking Baru
            </Button>
            <Button onClick={() => router.push("/status")} variant="outline" className="bg-transparent">
              Cek Status
            </Button>
          </div>

          {transactions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <CreditCard className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Transaksi</h3>
                <p className="text-gray-500 mb-6">
                  Anda belum melakukan booking lapangan futsal. Untuk melihat status booking terbaru, kunjungi halaman
                  Status.
                </p>
                <Button onClick={() => router.push("/home")} className="bg-green-600 hover:bg-green-700">
                  Pilih Venue
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">#{transaction.id}</CardTitle>
                        <CardDescription>
                          {new Date(transaction.createdAt).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </CardDescription>
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Detail Booking</h4>
                        <div className="space-y-2 text-sm">
                          {transaction.venue && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span>
                                {transaction.venue.name} - {transaction.venue.location}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>{new Date(transaction.date).toLocaleDateString("id-ID")}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>
                              {transaction.time} -{" "}
                              {(Number.parseInt(transaction.time.split(":")[0]) + 1).toString().padStart(2, "0")}:00
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span>{transaction.field}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Detail Pembayaran</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Metode Pembayaran:</span>
                            <span className="font-medium">{transaction.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total:</span>
                            <span className="font-bold text-green-600">{formatCurrency(transaction.price)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
