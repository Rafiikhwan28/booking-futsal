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
import { Eye, EyeOff, ArrowLeft, User, Mail, Phone, Lock } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password tidak cocok",
        description: "Pastikan password dan konfirmasi password sama",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const existingUser = users.find((u: any) => u.email === formData.email)

      if (existingUser) {
        toast({
          title: "Email sudah terdaftar",
          description: "Gunakan email lain atau masuk dengan akun yang ada",
          variant: "destructive",
        })
      } else {
        const newUser = {
          id: Date.now(),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }
        users.push(newUser)
        localStorage.setItem("users", JSON.stringify(users))
        localStorage.setItem("currentUser", JSON.stringify(newUser))

        toast({
          title: "Registrasi berhasil!",
          description: "Akun Anda telah dibuat",
        })
        router.push("/home")
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
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                FutsalBook
              </span>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">Buat Akun Baru</CardTitle>
            <CardDescription className="text-base text-gray-600 mt-2">
              Daftar untuk mulai booking lapangan futsal favorit Anda
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center">
                  <User className="w-4 h-4 mr-2 text-emerald-600" />
                  Nama Lengkap
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-emerald-600" />
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-emerald-600" />
                  Nomor Telepon
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="08123456789"
                  value={formData.phone}
                  onChange={handleInputChange}
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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={6}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-emerald-600" />
                  Konfirmasi Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
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
                  "Buat Akun"
                )}
              </Button>
            </form>

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors"
                >
                  Masuk sekarang
                </Link>
              </p>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Dengan mendaftar, Anda menyetujui{" "}
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
