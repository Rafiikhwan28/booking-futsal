"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Shield,
  LogOut,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  FileImage,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Save,
  X,
  User,
  Building,
  DollarSign,
  Info,
} from "lucide-react"

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
  user?: {
    name: string
    email: string
    phone: string
  }
  paymentProof?: {
    fileName: string
    fileSize: number
    fileType: string
    uploadedAt: string
    fileData: string
  }
}

export default function TransactionDetailPage() {
  const [currentAdmin, setCurrentAdmin] = useState<any>(null)
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [showImageModal, setShowImageModal] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  useEffect(() => {
    const admin = localStorage.getItem("currentAdmin")
    if (!admin) {
      router.push("/admin/login")
      return
    }
    setCurrentAdmin(JSON.parse(admin))

    // Load transaction detail
    loadTransactionDetail(params.id as string)
  }, [router, params.id])

  const loadTransactionDetail = (transactionId: string) => {
    setTimeout(() => {
      const allTransactions = JSON.parse(localStorage.getItem("transactions") || "[]")
      const allUsers = JSON.parse(localStorage.getItem("users") || "[]")

      const foundTransaction = allTransactions.find((t: Transaction) => t.id === transactionId)

      if (foundTransaction) {
        const user = allUsers.find((u: any) => u.id === foundTransaction.userId)
        const enrichedTransaction = {
          ...foundTransaction,
          user: user
            ? {
                name: user.name,
                email: user.email,
                phone: user.phone,
              }
            : null,
        }

        setTransaction(enrichedTransaction)
        setNewStatus(enrichedTransaction.status)
      }

      setIsLoading(false)
    }, 1000)
  }

  const handleStatusUpdate = async () => {
    if (!transaction || newStatus === transaction.status) return

    setIsUpdating(true)

    setTimeout(() => {
      const allTransactions = JSON.parse(localStorage.getItem("transactions") || "[]")
      const updatedTransactions = allTransactions.map((t: Transaction) =>
        t.id === transaction.id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t,
      )

      localStorage.setItem("transactions", JSON.stringify(updatedTransactions))

      setTransaction({ ...transaction, status: newStatus })

      toast({
        title: "Status berhasil diperbarui!",
        description: `Transaksi ${transaction.id} telah diupdate ke status ${newStatus}`,
      })

      setIsUpdating(false)
    }, 1000)
  }

  const handleLogout = () => {
    localStorage.removeItem("currentAdmin")
    router.push("/admin/login")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>Berhasil</span>
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Menunggu</span>
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center space-x-1">
            <XCircle className="w-3 h-3" />
            <span>Gagal</span>
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 flex items-center space-x-1">
            <AlertCircle className="w-3 h-3" />
            <span>Dibatalkan</span>
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const downloadPaymentProof = () => {
    if (transaction?.paymentProof) {
      const link = document.createElement("a")
      link.href = transaction.paymentProof.fileData
      link.download = transaction.paymentProof.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Download dimulai",
        description: "Bukti pembayaran sedang didownload",
      })
    }
  }

  const saveAdminNotes = () => {
    // In real app, save to database
    toast({
      title: "Catatan disimpan",
      description: "Catatan admin telah disimpan",
    })
    setIsEditingNotes(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Transaksi tidak ditemukan</h2>
          <Button onClick={() => router.push("/admin")} className="bg-blue-600 hover:bg-blue-700">
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-800">Detail Transaksi</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-600 text-white text-xs">AD</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">Admin</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Transaction Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">Transaksi #{transaction.id}</h1>
              {getStatusBadge(transaction.status)}
            </div>
            <p className="text-gray-600">
              Dibuat pada{" "}
              {new Date(transaction.createdAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span>Informasi Pelanggan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-blue-600 text-white text-lg">
                        {transaction.user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {transaction.user?.name || "Unknown User"}
                        </h3>
                        <p className="text-gray-600">Customer ID: {transaction.userId}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{transaction.user?.email || "Email tidak tersedia"}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{transaction.user?.phone || "Telepon tidak tersedia"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    <span>Detail Booking</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Venue</label>
                        <p className="text-lg font-semibold">{transaction.venue?.name || "Unknown Venue"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Lokasi</label>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{transaction.venue?.location || "Unknown Location"}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Lapangan</label>
                        <p className="font-medium">{transaction.field}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tanggal Booking</label>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{new Date(transaction.date).toLocaleDateString("id-ID")}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Waktu</label>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">
                            {transaction.time} -{" "}
                            {(Number.parseInt(transaction.time.split(":")[0]) + 1).toString().padStart(2, "0")}:00
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Durasi</label>
                        <p className="font-medium">1 Jam</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <span>Informasi Pembayaran</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Metode Pembayaran</label>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{transaction.paymentMethod}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Total Pembayaran</label>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(transaction.price)}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status Pembayaran</label>
                        <div className="mt-1">{getStatusBadge(transaction.status)}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tanggal Pembayaran</label>
                        <p className="font-medium">
                          {new Date(transaction.createdAt).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Proof */}
              {transaction.paymentProof && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileImage className="w-5 h-5 text-blue-600" />
                      <span>Bukti Pembayaran</span>
                    </CardTitle>
                    <CardDescription>
                      Bukti pembayaran yang diupload oleh pelanggan pada{" "}
                      {new Date(transaction.paymentProof.uploadedAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* File Info */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Nama File</label>
                            <p className="font-medium">{transaction.paymentProof.fileName}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Ukuran File</label>
                            <p className="font-medium">{formatFileSize(transaction.paymentProof.fileSize)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Tipe File</label>
                            <p className="font-medium">{transaction.paymentProof.fileType}</p>
                          </div>
                        </div>
                      </div>

                      {/* Image Preview */}
                      <div className="relative">
                        <img
                          src={transaction.paymentProof.fileData || "/placeholder.svg"}
                          alt="Bukti Pembayaran"
                          className="w-full max-w-md mx-auto rounded-lg border-2 border-gray-200 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                          onClick={() => setShowImageModal(true)}
                        />
                        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                          Klik untuk memperbesar
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => setShowImageModal(true)}
                          className="flex items-center space-x-2 bg-transparent"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Lihat Penuh</span>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={downloadPaymentProof}
                          className="flex items-center space-x-2 bg-transparent"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Admin Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      <span>Catatan Admin</span>
                    </div>
                    {!isEditingNotes && (
                      <Button variant="outline" size="sm" onClick={() => setIsEditingNotes(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditingNotes ? (
                    <div className="space-y-4">
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Tambahkan catatan admin untuk transaksi ini..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={4}
                      />
                      <div className="flex space-x-2">
                        <Button onClick={saveAdminNotes} className="bg-blue-600 hover:bg-blue-700">
                          <Save className="w-4 h-4 mr-2" />
                          Simpan
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditingNotes(false)}>
                          <X className="w-4 h-4 mr-2" />
                          Batal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-600">{adminNotes || "Belum ada catatan admin untuk transaksi ini."}</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Update */}
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Update Status</CardTitle>
                  <CardDescription>Ubah status transaksi berdasarkan verifikasi pembayaran</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Status Saat Ini</label>
                    {getStatusBadge(transaction.status)}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Ubah Status</label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Menunggu</SelectItem>
                        <SelectItem value="success">Berhasil</SelectItem>
                        <SelectItem value="failed">Gagal</SelectItem>
                        <SelectItem value="cancelled">Dibatalkan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleStatusUpdate}
                    disabled={isUpdating || newStatus === transaction.status}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Memperbarui...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Status
                      </>
                    )}
                  </Button>

                  {newStatus !== transaction.status && (
                    <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                      Status akan berubah dari "{transaction.status}" ke "{newStatus}"
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Aksi Cepat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Mail className="w-4 h-4 mr-2" />
                    Kirim Email ke Customer
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Phone className="w-4 h-4 mr-2" />
                    Hubungi Customer
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileImage className="w-4 h-4 mr-2" />
                    Cetak Invoice
                  </Button>
                </CardContent>
              </Card>

              {/* Transaction Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Timeline Transaksi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-sm">Transaksi Dibuat</p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    {transaction.paymentProof && (
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-sm">Bukti Pembayaran Diupload</p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.paymentProof.uploadedAt).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-sm">Status: {transaction.status}</p>
                        <p className="text-xs text-gray-500">Status saat ini</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && transaction.paymentProof && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-12 right-0 text-white hover:bg-white/20"
              onClick={() => setShowImageModal(false)}
            >
              <X className="w-6 h-6" />
            </Button>
            <img
              src={transaction.paymentProof.fileData || "/placeholder.svg"}
              alt="Bukti Pembayaran"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-2 rounded text-sm">
              {transaction.paymentProof.fileName}
            </div>
            <Button variant="secondary" size="sm" className="absolute bottom-4 right-4" onClick={downloadPaymentProof}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
