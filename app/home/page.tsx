"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star, Users, LogOut, Calendar, Menu, X, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Venue {
  id: string
  name: string
  location: string
  description: string
  image: string
  rating: number
  priceRange: string
  facilities: string[]
  openHours: string
  fields: number
}

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [venues, setVenues] = useState<Venue[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/login")
      return
    }
    setCurrentUser(JSON.parse(user))

    // Initialize venues data
    const venuesData: Venue[] = [
      {
        id: "venue-1",
        name: "Futsal Arena Jakarta",
        location: "Jakarta Selatan",
        description: "Lapangan futsal premium dengan fasilitas lengkap dan lokasi strategis di Jakarta Selatan",
        image: "/placeholder.svg?height=200&width=300",
        rating: 4.8,
        priceRange: "Rp 120.000 - 180.000",
        facilities: ["AC", "Parkir Luas", "Kantin", "Mushola", "Toilet"],
        openHours: "09:00 - 24:00",
        fields: 3,
      },
      {
        id: "venue-2",
        name: "Champion Futsal Center",
        location: "Jakarta Barat",
        description: "Pusat futsal terbaik dengan rumput sintetis berkualitas tinggi dan pencahayaan optimal",
        image: "/placeholder.svg?height=200&width=300",
        rating: 4.7,
        priceRange: "Rp 100.000 - 150.000",
        facilities: ["Sound System", "Parkir", "Kantin", "Locker Room"],
        openHours: "08:00 - 23:00",
        fields: 2,
      },
      {
        id: "venue-3",
        name: "Elite Sports Complex",
        location: "Jakarta Timur",
        description: "Kompleks olahraga elite dengan lapangan futsal standar FIFA dan fasilitas premium",
        image: "/placeholder.svg?height=200&width=300",
        rating: 4.9,
        priceRange: "Rp 150.000 - 200.000",
        facilities: ["AC", "Tribun", "Parkir VIP", "Cafe", "Gym", "Shower"],
        openHours: "06:00 - 24:00",
        fields: 4,
      },
      {
        id: "venue-4",
        name: "Green Field Futsal",
        location: "Jakarta Utara",
        description: "Lapangan futsal dengan konsep hijau dan ramah lingkungan, cocok untuk keluarga",
        image: "/placeholder.svg?height=200&width=300",
        rating: 4.5,
        priceRange: "Rp 90.000 - 130.000",
        facilities: ["Outdoor Area", "Parkir", "Kids Zone", "Kantin"],
        openHours: "09:00 - 22:00",
        fields: 2,
      },
      {
        id: "venue-5",
        name: "Pro Futsal Academy",
        location: "Jakarta Pusat",
        description: "Akademi futsal profesional dengan lapangan berkualitas internasional",
        image: "/placeholder.svg?height=200&width=300",
        rating: 4.6,
        priceRange: "Rp 110.000 - 160.000",
        facilities: ["Training Equipment", "Video Analysis", "Parkir", "Clinic"],
        openHours: "07:00 - 23:00",
        fields: 3,
      },
      {
        id: "venue-6",
        name: "Urban Futsal Hub",
        location: "Tangerang",
        description: "Hub futsal modern di area urban dengan teknologi booking terdepan",
        image: "/placeholder.svg?height=200&width=300",
        rating: 4.4,
        priceRange: "Rp 80.000 - 120.000",
        facilities: ["WiFi", "Digital Scoreboard", "Parkir", "Food Court"],
        openHours: "10:00 - 24:00",
        fields: 2,
      },
    ]

    setVenues(venuesData)
  }, [router])

  // Update the handleVenueSelect function to navigate to venue detail page instead of booking page directly

  const handleVenueSelect = (venue: Venue) => {
    router.push(`/venue/${venue.id}`)
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("selectedVenue")
    router.push("/")
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                FutsalBook
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-white/50 rounded-full px-4 py-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentUser?.profileImage || "/placeholder.svg"} alt={currentUser?.name} />
                  <AvatarFallback className="bg-emerald-600 text-white text-xs">
                    {currentUser?.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">Halo, {currentUser.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/profile")} className="rounded-full">
                Profile
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push("/transactions")} className="rounded-full">
                <Calendar className="w-4 h-4 mr-2" />
                Transaksi
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push("/status")} className="rounded-full">
                <Clock className="w-4 h-4 mr-2" />
                Status
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-full">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="flex items-center space-x-3 py-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={currentUser?.profileImage || "/placeholder.svg"} alt={currentUser?.name} />
                  <AvatarFallback className="bg-emerald-600 text-white text-sm">
                    {currentUser?.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-sm text-gray-500">{currentUser.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/profile")}>
                  Profile
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/transactions")}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Transaksi
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/status")}>
                  <Clock className="w-4 h-4 mr-2" />
                  Status
                </Button>
                <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Selamat Datang,
              <span className="block sm:inline bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {currentUser.name}!
              </span>
            </h1>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Pilih venue lapangan futsal terbaik untuk pengalaman bermain yang tak terlupakan
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Card className="text-center border-0 bg-gradient-to-br from-white to-emerald-50/30 backdrop-blur-sm shadow-lg">
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1 sm:mb-2">{venues.length}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">Venue Tersedia</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 bg-gradient-to-br from-white to-teal-50/30 backdrop-blur-sm shadow-lg">
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-2xl sm:text-3xl font-bold text-teal-600 mb-1 sm:mb-2">24/7</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">Layanan Booking</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 bg-gradient-to-br from-white to-cyan-50/30 backdrop-blur-sm shadow-lg col-span-2 lg:col-span-1">
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-2xl sm:text-3xl font-bold text-cyan-600 mb-1 sm:mb-2">4.7</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">Rating Rata-rata</div>
              </CardContent>
            </Card>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari venue futsal..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Venues Grid */}
          <div className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 text-center sm:text-left">
              Pilih Venue Futsal
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {venues.map((venue) => (
                <Card
                  key={venue.id}
                  className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={venue.image || "/placeholder.svg"}
                      alt={venue.name}
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-gray-900 hover:bg-white/90 shadow-lg backdrop-blur-sm">
                        {venue.fields} Lapangan
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base sm:text-lg group-hover:text-emerald-600 transition-colors line-clamp-1">
                          {venue.name}
                        </CardTitle>
                        <div className="flex items-center space-x-1 mt-1">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="text-xs sm:text-sm text-gray-600 line-clamp-1">{venue.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        {renderStars(venue.rating)}
                        <span className="text-xs sm:text-sm font-medium ml-1">{venue.rating}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <CardDescription className="mb-4 line-clamp-2 text-xs sm:text-sm">
                      {venue.description}
                    </CardDescription>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                        <span className="text-xs sm:text-sm text-gray-600">{venue.openHours}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                        <span className="text-xs sm:text-sm font-medium text-emerald-600">{venue.priceRange}</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {venue.facilities.slice(0, 3).map((facility) => (
                          <Badge key={facility} variant="secondary" className="text-xs px-2 py-1">
                            {facility}
                          </Badge>
                        ))}
                        {venue.facilities.length > 3 && (
                          <Badge variant="secondary" className="text-xs px-2 py-1">
                            +{venue.facilities.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button
                      className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                      onClick={() => handleVenueSelect(venue)}
                    >
                      Pilih Venue
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 shadow-2xl">
            <CardContent className="text-center py-8 sm:py-12">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">Tidak Menemukan Venue yang Cocok?</h3>
              <p className="text-emerald-100 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Hubungi kami untuk rekomendasi venue lain atau daftarkan venue Anda untuk bergabung dengan platform kami
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button variant="secondary" size="lg" className="rounded-xl">
                  Hubungi Kami
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-emerald-600 bg-transparent rounded-xl"
                >
                  Daftarkan Venue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
