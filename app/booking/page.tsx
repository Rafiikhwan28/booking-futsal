"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TimeSlot {
  time: string
  available: boolean
  price: number
}

export default function BookingPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedVenue, setSelectedVenue] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    const venue = localStorage.getItem("selectedVenue")

    if (!user) {
      router.push("/login")
      return
    }

    if (!venue) {
      router.push("/home")
      return
    }

    setCurrentUser(JSON.parse(user))
    setSelectedVenue(JSON.parse(venue))

    // Set default date to today
    const today = new Date().toISOString().split("T")[0]
    setSelectedDate(today)
  }, [router])

  useEffect(() => {
    if (selectedDate) {
      generateTimeSlots()
    }
  }, [selectedDate])

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = []
    const currentTime = new Date()
    const selectedDateTime = new Date(selectedDate)
    const isToday = selectedDateTime.toDateString() === currentTime.toDateString()

    // Generate slots from 9 AM to 12 AM (24 hours)
    for (let hour = 9; hour <= 23; hour++) {
      const timeString = `${hour.toString().padStart(2, "0")}:00`
      const slotDateTime = new Date(selectedDate + "T" + timeString)

      let available = true
      if (isToday && slotDateTime <= currentTime) {
        available = false
      }

      // Random availability for demo (some slots might be booked)
      if (available && Math.random() > 0.8) {
        available = false
      }

      slots.push({
        time: timeString,
        available,
        price: hour >= 18 ? 150000 : 120000, // Higher price for evening slots
      })
    }

    setTimeSlots(slots)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleBooking = () => {
    if (!selectedTime) {
      toast({
        title: "Pilih waktu",
        description: "Silakan pilih waktu booking terlebih dahulu",
        variant: "destructive",
      })
      return
    }

    const selectedSlot = timeSlots.find((slot) => slot.time === selectedTime)
    const bookingData = {
      date: selectedDate,
      time: selectedTime,
      price: selectedSlot?.price,
      field: "Lapangan A",
      venue: selectedVenue,
    }

    localStorage.setItem("currentBooking", JSON.stringify(bookingData))
    router.push("/checkout")
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount)
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold text-green-800">FutsalBook</span>
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
              <span className="text-sm text-gray-600">Halo, {currentUser?.name}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push("/profile")}>
              Profile
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push("/home")}>
              Pilih Venue Lain
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push("/transactions")}>
              Transaksi
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push("/status")}>
              Status
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Booking Lapangan Futsal</h1>

          {/* Field Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <span>{selectedVenue?.name || "Lapangan Futsal Premium"}</span>
              </CardTitle>
              <CardDescription>
                {selectedVenue?.description ||
                  "Lapangan futsal berkualitas dengan rumput sintetis dan fasilitas lengkap"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{selectedVenue?.openHours || "09:00 - 24:00"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{selectedVenue?.location || "Jakarta Selatan"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Tersedia Setiap Hari</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Pilih Tanggal</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </CardContent>
          </Card>

          {/* Time Slots */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Pilih Waktu</CardTitle>
              <CardDescription>
                Pilih slot waktu yang tersedia untuk tanggal {new Date(selectedDate).toLocaleDateString("id-ID")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    className={`h-auto p-3 flex flex-col items-center space-y-1 ${
                      !slot.available
                        ? "opacity-50 cursor-not-allowed"
                        : selectedTime === slot.time
                          ? "bg-green-600 hover:bg-green-700"
                          : "hover:bg-green-50"
                    }`}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                  >
                    <span className="font-medium">{slot.time}</span>
                    <span className="text-xs">{slot.available ? formatCurrency(slot.price) : "Tidak Tersedia"}</span>
                  </Button>
                ))}
              </div>
              <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-600 rounded"></div>
                  <span>Tersedia</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-300 rounded"></div>
                  <span>Tidak Tersedia</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          {selectedTime && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Ringkasan Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Tanggal:</span>
                    <span className="font-medium">{new Date(selectedDate).toLocaleDateString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waktu:</span>
                    <span className="font-medium">
                      {selectedTime} - {(Number.parseInt(selectedTime.split(":")[0]) + 1).toString().padStart(2, "0")}
                      :00
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lapangan:</span>
                    <span className="font-medium">Lapangan A</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Durasi:</span>
                    <span className="font-medium">1 Jam</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">
                        {formatCurrency(timeSlots.find((slot) => slot.time === selectedTime)?.price || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Book Button */}
          <div className="text-center">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 px-12"
              onClick={handleBooking}
              disabled={!selectedTime}
            >
              Lanjut ke Pembayaran
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
