"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  MapPin,
  Clock,
  Star,
  Users,
  LogOut,
  Calendar,
  Phone,
  Mail,
  Wifi,
  Car,
  Coffee,
  Shield,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  MessageCircle,
  CheckCircle,
  Info,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Venue {
  id: string
  name: string
  location: string
  description: string
  detailedDescription: string
  images: string[]
  rating: number
  priceRange: string
  facilities: string[]
  openHours: string
  fields: number
  contact: {
    phone: string
    email: string
    whatsapp: string
  }
  address: {
    street: string
    city: string
    province: string
    postalCode: string
  }
  specifications: {
    fieldSize: string
    surface: string
    lighting: string
    capacity: number
  }
  amenities: {
    parking: boolean
    wifi: boolean
    canteen: boolean
    restroom: boolean
    prayer_room: boolean
    locker_room: boolean
    sound_system: boolean
    air_conditioning: boolean
  }
  reviews: {
    id: string
    userName: string
    userAvatar: string
    rating: number
    comment: string
    date: string
  }[]
  policies: string[]
}

export default function VenueDetailPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [venue, setVenue] = useState<Venue | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/login")
      return
    }
    setCurrentUser(JSON.parse(user))

    // Load venue data based on ID
    loadVenueData(params.id as string)
  }, [router, params.id])

  const loadVenueData = (venueId: string) => {
    // Simulate API call to get venue details
    setTimeout(() => {
      const venueData: Venue = {
        id: venueId,
        name: "Futsal Arena Jakarta",
        location: "Jakarta Selatan",
        description: "Lapangan futsal premium dengan fasilitas lengkap dan lokasi strategis di Jakarta Selatan",
        detailedDescription:
          "Futsal Arena Jakarta adalah destinasi utama untuk penggemar futsal di Jakarta Selatan. Dengan 3 lapangan berkualitas internasional, kami menawarkan pengalaman bermain yang tak terlupakan. Lapangan kami menggunakan rumput sintetis premium dengan sistem drainase terbaik, memastikan permukaan yang sempurna dalam segala cuaca. Dilengkapi dengan pencahayaan LED modern dan sistem ventilasi yang optimal, setiap pertandingan akan terasa profesional dan nyaman.",
        images: [
          "/placeholder.svg?height=400&width=600&text=Lapangan+Utama",
          "/placeholder.svg?height=400&width=600&text=Lapangan+2",
          "/placeholder.svg?height=400&width=600&text=Lapangan+3",
          "/placeholder.svg?height=400&width=600&text=Fasilitas+Kantin",
          "/placeholder.svg?height=400&width=600&text=Area+Parkir",
          "/placeholder.svg?height=400&width=600&text=Ruang+Ganti",
        ],
        rating: 4.8,
        priceRange: "Rp 120.000 - 180.000",
        facilities: ["AC", "Parkir Luas", "Kantin", "Mushola", "Toilet", "Ruang Ganti", "Sound System"],
        openHours: "09:00 - 24:00",
        fields: 3,
        contact: {
          phone: "+62 21 1234 5678",
          email: "info@futsalarena.com",
          whatsapp: "+62 812 3456 7890",
        },
        address: {
          street: "Jl. Sudirman No. 123",
          city: "Jakarta Selatan",
          province: "DKI Jakarta",
          postalCode: "12190",
        },
        specifications: {
          fieldSize: "40m x 20m",
          surface: "Rumput Sintetis Premium",
          lighting: "LED Floodlight 500 Lux",
          capacity: 50,
        },
        amenities: {
          parking: true,
          wifi: true,
          canteen: true,
          restroom: true,
          prayer_room: true,
          locker_room: true,
          sound_system: true,
          air_conditioning: true,
        },
        reviews: [
          {
            id: "1",
            userName: "Ahmad Rizki",
            userAvatar: "/placeholder.svg?height=40&width=40",
            rating: 5,
            comment:
              "Lapangan sangat bagus, bersih, dan fasilitas lengkap. Pelayanan juga ramah. Pasti akan booking lagi!",
            date: "2024-01-15",
          },
          {
            id: "2",
            userName: "Sari Dewi",
            userAvatar: "/placeholder.svg?height=40&width=40",
            rating: 4,
            comment: "Lokasi strategis dan mudah dijangkau. Lapangan berkualitas dengan harga yang reasonable.",
            date: "2024-01-10",
          },
          {
            id: "3",
            userName: "Budi Santoso",
            userAvatar: "/placeholder.svg?height=40&width=40",
            rating: 5,
            comment: "Fasilitas parkir luas, kantin enak, dan lapangan selalu dalam kondisi prima. Recommended!",
            date: "2024-01-08",
          },
        ],
        policies: [
          "Booking minimal 2 jam sebelum waktu bermain",
          "Pembatalan gratis hingga 4 jam sebelum waktu bermain",
          "Dilarang merokok di area lapangan",
          "Wajib menggunakan sepatu futsal",
          "Maksimal 10 pemain per tim",
          "Fasilitas tersedia mulai 30 menit sebelum waktu booking",
        ],
      }

      setVenue(venueData)
      setIsLoading(false)
    }, 1000)
  }

  const handleBookNow = () => {
    if (venue) {
      localStorage.setItem("selectedVenue", JSON.stringify(venue))
      router.push("/booking")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("selectedVenue")
    router.push("/")
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast({
      title: isFavorite ? "Dihapus dari favorit" : "Ditambah ke favorit",
      description: isFavorite ? "Venue dihapus dari daftar favorit" : "Venue ditambahkan ke daftar favorit",
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: venue?.name,
        text: venue?.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link disalin",
        description: "Link venue telah disalin ke clipboard",
      })
    }
  }

  const nextImage = () => {
    if (venue) {
      setCurrentImageIndex((prev) => (prev + 1) % venue.images.length)
    }
  }

  const prevImage = () => {
    if (venue) {
      setCurrentImageIndex((prev) => (prev - 1 + venue.images.length) % venue.images.length)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  const getAmenityIcon = (amenity: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      parking: <Car className="w-5 h-5" />,
      wifi: <Wifi className="w-5 h-5" />,
      canteen: <Coffee className="w-5 h-5" />,
      restroom: <Users className="w-5 h-5" />,
      prayer_room: <Shield className="w-5 h-5" />,
      locker_room: <Users className="w-5 h-5" />,
      sound_system: <Users className="w-5 h-5" />,
      air_conditioning: <Users className="w-5 h-5" />,
    }
    return icons[amenity] || <CheckCircle className="w-5 h-5" />
  }

  const getAmenityName = (amenity: string) => {
    const names: { [key: string]: string } = {
      parking: "Parkir",
      wifi: "WiFi Gratis",
      canteen: "Kantin",
      restroom: "Toilet",
      prayer_room: "Mushola",
      locker_room: "Ruang Ganti",
      sound_system: "Sound System",
      air_conditioning: "AC",
    }
    return names[amenity] || amenity
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Venue tidak ditemukan</h2>
          <Button onClick={() => router.push("/home")} className="bg-emerald-600 hover:bg-emerald-700">
            Kembali ke Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/home")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  FutsalBook
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3 bg-white/50 rounded-full px-4 py-2">
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
              <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-full">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Image Gallery */}
          <Card className="mb-8 overflow-hidden border-0 shadow-2xl">
            <div className="relative">
              <div className="relative h-64 sm:h-96 lg:h-[500px] overflow-hidden">
                <img
                  src={venue.images[currentImageIndex] || "/placeholder.svg"}
                  alt={`${venue.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                {venue.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 p-0"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 p-0"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {venue.images.length}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/90 hover:bg-white text-gray-900 rounded-full w-10 h-10 p-0"
                    onClick={toggleFavorite}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/90 hover:bg-white text-gray-900 rounded-full w-10 h-10 p-0"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {venue.images.length > 1 && (
                <div className="p-4 bg-gray-50">
                  <div className="flex space-x-2 overflow-x-auto">
                    {venue.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex ? "border-emerald-500" : "border-gray-200"
                        }`}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Venue Info */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{venue.name}</CardTitle>
                      <div className="flex items-center space-x-2 mb-4">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-600">{venue.location}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          {renderStars(venue.rating)}
                          <span className="font-medium ml-2">{venue.rating}</span>
                          <span className="text-gray-500">({venue.reviews.length} ulasan)</span>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                          {venue.fields} Lapangan
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed mb-6">{venue.detailedDescription}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-emerald-50 rounded-lg">
                      <Clock className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                      <div className="text-sm font-medium text-gray-900">{venue.openHours}</div>
                      <div className="text-xs text-gray-500">Jam Operasional</div>
                    </div>
                    <div className="text-center p-4 bg-teal-50 rounded-lg">
                      <Users className="w-6 h-6 text-teal-600 mx-auto mb-2" />
                      <div className="text-sm font-medium text-gray-900">{venue.specifications.capacity}</div>
                      <div className="text-xs text-gray-500">Kapasitas</div>
                    </div>
                    <div className="text-center p-4 bg-cyan-50 rounded-lg">
                      <Star className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
                      <div className="text-sm font-medium text-gray-900">{venue.rating}/5</div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-sm font-medium text-gray-900">Setiap Hari</div>
                      <div className="text-xs text-gray-500">Tersedia</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Specifications */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Info className="w-5 h-5 text-emerald-600" />
                    <span>Spesifikasi Lapangan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Ukuran Lapangan:</span>
                      <span className="font-medium">{venue.specifications.fieldSize}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Permukaan:</span>
                      <span className="font-medium">{venue.specifications.surface}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Pencahayaan:</span>
                      <span className="font-medium">{venue.specifications.lighting}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Kapasitas:</span>
                      <span className="font-medium">{venue.specifications.capacity} orang</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Fasilitas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Object.entries(venue.amenities).map(([key, available]) => (
                      <div
                        key={key}
                        className={`flex items-center space-x-3 p-3 rounded-lg ${
                          available ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-400"
                        }`}
                      >
                        {getAmenityIcon(key)}
                        <span className="text-sm font-medium">{getAmenityName(key)}</span>
                        {available && <CheckCircle className="w-4 h-4 text-emerald-600 ml-auto" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Ulasan Pelanggan</span>
                    <Badge variant="secondary">{venue.reviews.length} ulasan</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {venue.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={review.userAvatar || "/placeholder.svg"} alt={review.userName} />
                            <AvatarFallback className="bg-emerald-600 text-white text-sm">
                              {review.userName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{review.userName}</h4>
                              <span className="text-sm text-gray-500">
                                {new Date(review.date).toLocaleDateString("id-ID")}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 mb-2">{renderStars(review.rating)}</div>
                            <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Policies */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Kebijakan & Aturan</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {venue.policies.map((policy, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{policy}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <Card className="border-0 shadow-lg sticky top-24">
                <CardHeader>
                  <CardTitle className="text-center">Booking Sekarang</CardTitle>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-emerald-600">{venue.priceRange}</span>
                    <span className="text-gray-500 text-sm block">per jam</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleBookNow}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Pilih Jadwal
                  </Button>

                  <Separator />

                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">Butuh bantuan?</p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Informasi Kontak</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium">{venue.contact.phone}</div>
                      <div className="text-sm text-gray-500">Telepon</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium">{venue.contact.whatsapp}</div>
                      <div className="text-sm text-gray-500">WhatsApp</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium">{venue.contact.email}</div>
                      <div className="text-sm text-gray-500">Email</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Alamat Lengkap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{venue.address.street}</p>
                    <p className="text-gray-600">
                      {venue.address.city}, {venue.address.province}
                    </p>
                    <p className="text-gray-600">{venue.address.postalCode}</p>
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    <MapPin className="w-4 h-4 mr-2" />
                    Lihat di Maps
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
