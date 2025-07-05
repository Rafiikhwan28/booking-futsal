"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  Shield,
  LogOut,
  Users,
  Building,
  CreditCard,
  Calendar,
  Clock,
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Activity,
  Bell,
  Settings,
  FileText,
  Mail,
  Phone,
} from "lucide-react"

interface Transaction {
  id: string
  userId: number
  customerName: string
  customerEmail: string
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

interface DashboardStats {
  totalRevenue: number
  totalBookings: number
  totalUsers: number
  totalVenues: number
  pendingTransactions: number
  successfulTransactions: number
  failedTransactions: number
  todayBookings: number
}

export default function AdminDashboard() {
  const [currentAdmin, setCurrentAdmin] = useState<any>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalVenues: 6,
    pendingTransactions: 0,
    successfulTransactions: 0,
    failedTransactions: 0,
    todayBookings: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const admin = localStorage.getItem("currentAdmin")
    if (!admin) {
      router.push("/admin/login")
      return
    }
    setCurrentAdmin(JSON.parse(admin))
    loadDashboardData()
  }, [router])

  useEffect(() => {
    filterTransactions()
  }, [transactions, searchTerm, statusFilter])

  const loadDashboardData = () => {
    setTimeout(() => {
      const allTransactions = JSON.parse(localStorage.getItem("transactions") || "[]")
      const allUsers = JSON.parse(localStorage.getItem("users") || "[]")

      // Enrich transactions with user data
      const enrichedTransactions = allTransactions.map((transaction: any) => {
        const user = allUsers.find((u: any) => u.id === transaction.userId)
        return {
          ...transaction,
          customerName: user?.name || "Unknown User",
          customerEmail: user?.email || "Unknown Email",
        }
      })

      setTransactions(enrichedTransactions)

      // Calculate stats
      const totalRevenue = allTransactions.reduce((sum: number, t: any) => {
        return t.status === "success" ? sum + t.price : sum
      }, 0)

      const today = new Date().toISOString().split("T")[0]
      const todayBookings = allTransactions.filter((t: any) => t.date === today).length

      const newStats: DashboardStats = {
        totalRevenue,
        totalBookings: allTransactions.length,
        totalUsers: allUsers.length,
        totalVenues: 6,
        pendingTransactions: allTransactions.filter((t: any) => t.status === "pending").length,
        successfulTransactions: allTransactions.filter((t: any) => t.status === "success").length,
        failedTransactions: allTransactions.filter((t: any) => t.status === "failed").length,
        todayBookings,
      }

      setStats(newStats)
      setIsLoading(false)
    }, 1000)
  }

  const filterTransactions = () => {
    let filtered = transactions

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter)
    }

    setFilteredTransactions(filtered)
  }

  const handleStatusUpdate = async (transactionId: string, newStatus: string) => {
    setIsUpdating(true)

    setTimeout(() => {
      const allTransactions = JSON.parse(localStorage.getItem("transactions") || "[]")
      const updatedTransactions = allTransactions.map((t: any) =>
        t.id === transactionId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t,
      )

      localStorage.setItem("transactions", JSON.stringify(updatedTransactions))

      // Update local state
      setTransactions((prev) => prev.map((t) => (t.id === transactionId ? { ...t, status: newStatus } : t)))

      toast({
        title: "Status berhasil diperbarui!",
        description: `Transaksi ${transactionId} telah diupdate ke status ${newStatus}`,
      })

      setIsUpdating(false)
      loadDashboardData() // Refresh stats
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Admin Dashboard
                  </span>
                  <p className="text-sm text-gray-600">FutsalBook Management</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </Button>
              <div className="flex items-center space-x-3 bg-white/50 rounded-full px-4 py-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-600 text-white text-xs">AD</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">Administrator</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-full">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Selamat Datang, Administrator! 👋</h1>
            <p className="text-lg text-gray-600">Kelola platform FutsalBook dengan mudah dan efisien</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
                    <div className="text-sm text-gray-600">Total Bookings</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-white to-cyan-50/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
                    <div className="text-sm text-gray-600">Total Users</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-white to-orange-50/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalVenues}</div>
                    <div className="text-sm text-gray-600">Total Venues</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{stats.pendingTransactions}</div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{stats.successfulTransactions}</div>
                    <div className="text-sm text-gray-600">Success</div>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-600">{stats.failedTransactions}</div>
                    <div className="text-sm text-gray-600">Failed</div>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{stats.todayBookings}</div>
                    <div className="text-sm text-gray-600">Today</div>
                  </div>
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                  <Users className="w-6 h-6" />
                  <span className="text-xs">Manage Users</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                  <Building className="w-6 h-6" />
                  <span className="text-xs">Manage Venues</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                  <BarChart3 className="w-6 h-6" />
                  <span className="text-xs">Analytics</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                  <FileText className="w-6 h-6" />
                  <span className="text-xs">Reports</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                  <Download className="w-6 h-6" />
                  <span className="text-xs">Export Data</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2 bg-transparent">
                  <Settings className="w-6 h-6" />
                  <span className="text-xs">Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Management */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span>Transaction Management</span>
                  </CardTitle>
                  <CardDescription>Kelola dan monitor semua transaksi booking</CardDescription>
                </div>
                <Button onClick={loadDashboardData} variant="outline" size="sm" disabled={isLoading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari transaksi, customer, atau ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="success">Berhasil</SelectItem>
                    <SelectItem value="failed">Gagal</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Transactions Table */}
              <div className="space-y-4">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada transaksi</h3>
                    <p className="text-gray-500">
                      {searchTerm || statusFilter !== "all"
                        ? "Tidak ada transaksi yang sesuai dengan filter"
                        : "Belum ada transaksi yang masuk"}
                    </p>
                  </div>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                          {/* Transaction Info */}
                          <div className="lg:col-span-2">
                            <div className="flex items-start space-x-4">
                              <Avatar className="w-12 h-12">
                                <AvatarFallback className="bg-blue-600 text-white">
                                  {transaction.customerName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">#{transaction.id}</h4>
                                <p className="text-sm text-gray-600">{transaction.customerName}</p>
                                <p className="text-xs text-gray-500">{transaction.customerEmail}</p>
                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(transaction.date).toLocaleDateString("id-ID")}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{transaction.time}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Booking Details */}
                          <div>
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs text-gray-500">Venue</p>
                                <p className="font-medium text-sm">{transaction.venue?.name || "Unknown Venue"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Lapangan</p>
                                <p className="font-medium text-sm">{transaction.field}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Total</p>
                                <p className="font-bold text-green-600">{formatCurrency(transaction.price)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Status</span>
                              {getStatusBadge(transaction.status)}
                            </div>

                            <Select
                              value={transaction.status}
                              onValueChange={(newStatus) => handleStatusUpdate(transaction.id, newStatus)}
                              disabled={isUpdating}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Menunggu</SelectItem>
                                <SelectItem value="success">Berhasil</SelectItem>
                                <SelectItem value="failed">Gagal</SelectItem>
                                <SelectItem value="cancelled">Dibatalkan</SelectItem>
                              </SelectContent>
                            </Select>

                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 bg-transparent"
                                onClick={() => router.push(`/admin/transaction/${transaction.id}`)}
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Detail
                              </Button>
                              <Button variant="outline" size="sm" className="bg-transparent">
                                <Mail className="w-3 h-3" />
                              </Button>
                              <Button variant="outline" size="sm" className="bg-transparent">
                                <Phone className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
