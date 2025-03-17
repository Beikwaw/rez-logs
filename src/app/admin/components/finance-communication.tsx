// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { useToast } from "@/hooks/use-toast"
// import { Send, Upload } from "lucide-react"

// export function FinanceCommunication() {
//   const { toast } = useToast()
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)

//     // Simulate sending financial statement
//     setTimeout(() => {
//       setLoading(false)
//       toast({
//         title: "Financial statement sent",
//         description: "The student will be notified of the new statement.",
//       })

//       // Reset form
//       const form = e.target as HTMLFormElement
//       form.reset()
//     }, 1500)
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Send Financial Statement</CardTitle>
//         <CardDescription>Securely send financial statements to students</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid gap-4">
//             <div className="grid gap-2">
//               <Label htmlFor="roomNumber">Room Number</Label>
//               <Input id="roomNumber" placeholder="Enter student's room number" required />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="tenantCode">Tenant Code</Label>
//               <Input id="tenantCode" placeholder="Enter student's tenant code" required />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="subject">Subject</Label>
//               <Input id="subject" placeholder="e.g., March 2025 Statement" required />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="message">Message</Label>
//               <Textarea
//                 id="message"
//                 placeholder="Add a message to accompany the statement..."
//                 className="min-h-[100px]"
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label>Upload Statement</Label>
//               <div className="flex items-center gap-4">
//                 <Button type="button" variant="outline">
//                   <Upload className="mr-2 h-4 w-4" />
//                   Choose File
//                 </Button>
//                 <p className="text-sm text-muted-foreground">No file chosen</p>
//               </div>
//             </div>
//           </div>
//           <Button type="submit" className="w-full" disabled={loading}>
//             <Send className="mr-2 h-4 w-4" />
//             {loading ? "Sending..." : "Send Statement"}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }

