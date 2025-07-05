import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, MapPin, Users, Shield, Star, Zap, Trophy } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              FutsalBook
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Fitur
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Tentang
            </Link>
            <Link href="#contact" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Kontak
            </Link>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link href="/admin/login">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                <Shield className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm" className="border-emerald-200 hover:bg-emerald-50 bg-transparent">
                <span className="hidden sm:inline">Masuk</span>
                <span className="sm:hidden">Login</span>
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg"
              >
                Daftar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-3xl mx-4 sm:mx-8"></div>
        <div className="container mx-auto text-center relative">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Booking Lapangan
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Futsal Terbaik
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
              Platform terpercaya untuk memesan lapangan futsal dengan sistem booking online yang praktis, aman, dan
              mudah digunakan
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Mulai Booking Sekarang
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-4 text-lg border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 bg-transparent"
                >
                  Sudah Punya Akun?
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Mengapa Pilih
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {" "}
                FutsalBook?
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Nikmati pengalaman booking yang tak terlupakan dengan fitur-fitur unggulan kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-emerald-50/30 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <CardTitle className="text-xl sm:text-2xl group-hover:text-emerald-600 transition-colors">
                  Booking Real-time
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  Lihat ketersediaan lapangan secara real-time dan booking langsung tanpa antri dengan sistem yang
                  canggih
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-teal-50/30 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <CardTitle className="text-xl sm:text-2xl group-hover:text-teal-600 transition-colors">
                  Lokasi Strategis
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  Lapangan futsal berkualitas premium di lokasi yang mudah dijangkau dengan fasilitas lengkap dan modern
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-cyan-50/30 backdrop-blur-sm md:col-span-2 lg:col-span-1">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <CardTitle className="text-xl sm:text-2xl group-hover:text-cyan-600 transition-colors">
                  Komunitas Aktif
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  Bergabung dengan komunitas futsal aktif dan temukan teman bermain baru di seluruh Indonesia
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-r from-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">50+</div>
              <div className="text-emerald-100 text-sm sm:text-base font-medium">Venue Partner</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">10K+</div>
              <div className="text-emerald-100 text-sm sm:text-base font-medium">User Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">25K+</div>
              <div className="text-emerald-100 text-sm sm:text-base font-medium">Booking Sukses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">4.9</div>
              <div className="text-emerald-100 text-sm sm:text-base font-medium">Rating Pengguna</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20"></div>
        <div className="container mx-auto text-center relative">
          <div className="max-w-3xl mx-auto">
            <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Siap Untuk Main Futsal?</h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 leading-relaxed">
              Daftar sekarang dan dapatkan pengalaman booking lapangan yang tak terlupakan dengan teknologi terdepan
            </p>
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-8 sm:px-12 py-4 text-lg sm:text-xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Star className="w-5 h-5 mr-2" />
                Daftar Gratis Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  FutsalBook
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Platform booking lapangan futsal terpercaya di Indonesia dengan teknologi terdepan dan layanan terbaik.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4 text-emerald-400">Layanan</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Booking Lapangan</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Turnamen</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Pelatihan</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Event Organizer</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4 text-emerald-400">Bantuan</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">FAQ</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Kontak</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Kebijakan</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Syarat & Ketentuan</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4 text-emerald-400">Kontak</h3>
              <ul className="space-y-3 text-gray-400">
                <li>Email: info@futsalbook.com</li>
                <li>Phone: +62 812-3456-7890</li>
                <li>WhatsApp: +62 812-3456-7890</li>
                <li>Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 FutsalBook. All rights reserved. Made with ❤️ in Indonesia</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
