"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Shield, ArrowLeft, Lock, Mail } from "lucide-react"
import Link from "next/link"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Default admin credentials
      if (email === "admin@futsalbook.com" && password === "admin123") {
        const adminUser = {
          id: 999999,
          name: "Administrator",
          email: "admin@futsalbook.com",
          role: "admin",
          profileImage: "",
        }
        localStorage.setItem("currentAdmin", JSON.stringify(adminUser))
        toast({
          title: "Login admin berhasil!",
          description: "Selamat datang di dashboard admin",
        })
        router.push("/admin")
      } else {
        toast({
          title: "Login gagal",
          description: "Email atau password admin salah",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="w-full max-w-md relative">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="font-medium">Kembali ke beranda</span>
        </Link>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Admin Panel
                </span>
              </div>
              <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium">
                Login User
              </Link>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">Login Administrator</CardTitle>
            <CardDescription className="text-base text-gray-600 mt-2">
              Masukkan kredensial admin untuk mengakses dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-blue-600" />
                  Email Admin
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@futsalbook.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-blue-600" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password admin"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Memproses...
                  </>
                ) : (
                  "Login Admin"
                )}
              </Button>
            </form>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-2 font-medium">Demo Credentials:</p>
              <p className="text-xs text-gray-500">Email: admin@futsalbook.com</p>
              <p className="text-xs text-gray-500">Password: admin123</p>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Bukan admin?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                >
                  Login sebagai User
                </Link>
              </p>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">Akses terbatas untuk administrator yang berwenang</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
