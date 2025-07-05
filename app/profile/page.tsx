"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Camera, User, Mail, Phone, Save, LogOut, Clock } from "lucide-react"

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [profileImage, setProfileImage] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(user)
    setCurrentUser(userData)
    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
    })
    setProfileImage(userData.profileImage || "")
    setPreviewImage(userData.profileImage || "")
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          description: "Hanya file gambar yang diperbolehkan",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string
        setPreviewImage(imageDataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      try {
        // Update current user data
        const updatedUser = {
          ...currentUser,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          profileImage: previewImage,
        }

        // Update in users array
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const userIndex = users.findIndex((u: any) => u.id === currentUser.id)
        if (userIndex !== -1) {
          users[userIndex] = updatedUser
          localStorage.setItem("users", JSON.stringify(users))
        }

        // Update current user
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
        setCurrentUser(updatedUser)
        setProfileImage(previewImage)

        toast({
          title: "Profile berhasil diperbarui!",
          description: "Data profile Anda telah disimpan",
        })
      } catch (error) {
        toast({
          title: "Gagal memperbarui profile",
          description: "Terjadi kesalahan saat menyimpan data",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("selectedVenue")
    router.push("/")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
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
              Kembali
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
                <AvatarImage src={currentUser.profileImage || "/placeholder.svg"} alt={currentUser.name} />
                <AvatarFallback className="bg-green-600 text-white text-xs">
                  {getInitials(currentUser.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">Halo, {currentUser.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Saya</h1>

          <div className="space-y-6">
            {/* Profile Photo Section */}
            <Card>
              <CardHeader>
                <CardTitle>Foto Profile</CardTitle>
                <CardDescription>Klik pada foto untuk mengubah gambar profile Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={previewImage || "/placeholder.svg"} alt={formData.name} />
                      <AvatarFallback className="bg-green-600 text-white text-2xl">
                        {getInitials(formData.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={triggerFileInput}
                    className="flex items-center space-x-2 bg-transparent"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Ubah Foto</span>
                  </Button>
                  <p className="text-xs text-gray-500 text-center">Format: JPG, PNG, GIF. Maksimal 5MB</p>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pribadi</CardTitle>
                <CardDescription>Perbarui informasi pribadi Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Nama Lengkap</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="nama@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Nomor Telepon</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="08123456789"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Simpan Perubahan
                        </>
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push("/home")} disabled={isLoading}>
                      Batal
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Account Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Statistik Akun</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {
                        JSON.parse(localStorage.getItem("transactions") || "[]").filter(
                          (t: any) => t.userId === currentUser.id,
                        ).length
                      }
                    </div>
                    <div className="text-sm text-gray-600">Total Booking</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {new Date(currentUser.id).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                      })}
                    </div>
                    <div className="text-sm text-gray-600">Member Sejak</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="flex items-center justify-center space-x-2 h-12 bg-transparent"
                    onClick={() => router.push("/status")}
                  >
                    <Clock className="w-4 h-4" />
                    <span>Cek Status Booking</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center space-x-2 h-12 bg-transparent"
                    onClick={() => router.push("/transactions")}
                  >
                    <span>Riwayat Transaksi</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
