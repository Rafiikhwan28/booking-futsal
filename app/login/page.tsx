"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from "lucide-react"

export default function LoginPage() {
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
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const user = users.find((u: any) => u.email === email && u.password === password)

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user))
        toast({
          title: "Login berhasil!",
          description: "Selamat datang kembali",
        })
        router.push("/home")
      } else {
        toast({
          title: "Login gagal",
          description: "Email atau password salah",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="w-full max-w-md relative">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="font-medium">Kembali ke beranda</span>
        </Link>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                FutsalBook
              </span>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">Selamat Datang Kembali</CardTitle>
            <CardDescription className="text-base text-gray-600 mt-2">
              Masukkan email dan password untuk mengakses akun Anda
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-emerald-600" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-emerald-600" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl pr-12"
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
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Memproses...
                  </>
                ) : (
                  "Masuk ke Akun"
                )}
              </Button>
            </form>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors"
                >
                  Daftar sekarang
                </Link>
              </p>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Dengan masuk, Anda menyetujui{" "}
                  <Link href="#" className="text-emerald-600 hover:underline">
                    Syarat & Ketentuan
                  </Link>{" "}
                  dan{" "}
                  <Link href="#" className="text-emerald-600 hover:underline">
                    Kebijakan Privasi
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
