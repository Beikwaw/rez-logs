// "use client"

// import { useState, useEffect } from "react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"
// import { createClient } from "@/lib/supabase/client"
// import { updateComplaintStatus } from "@/app/actions/complaints"
// import type { Complaint } from "@/lib/supabase/types"
// import { format } from "date-fns"
// import Image from "next/image"
// import { useToast } from "@/hooks/use-toast"

// export function ComplaintManagement() {
//   const [complaints, setComplaints] = useState<Complaint[]>([])
//   const [loading, setLoading] = useState(true)
//   const [filter, setFilter] = useState("")
//   const [statusFilter, setStatusFilter] = useState<string>("all")
//   const { toast } = useToast()
//   const supabase = createClient()

//   useEffect(() => {
//     const fetchComplaints = async () => {
//       const { data, error } = await supabase
//         .from("complaints")
//         .select(`
//           *,
//           profile:profiles(*)
//         `)
//         .order("created_at", { ascending: false })

//       if (error) {
//         console.error("Error fetching complaints:", error)
//         return
//       }

//       setComplaints(data)
//       setLoading(false)
//     }

//     fetchComplaints()

//     // Set up real-time subscription
//     const subscription = supabase
//       .channel("complaint-changes")
//       .on("postgres_changes", { event: "*", schema: "public", table: "complaints" }, fetchComplaints)
//       .subscribe()

//     return () => {
//       supabase.removeChannel(subscription)
//     }
//   }, [supabase])

//   const handleStatusUpdate = async (complaintId: string, status: "open" | "assigned" | "resolved") => {
//     const result = await updateComplaintStatus(complaintId, status)

//     if (result.error) {
//       toast({
//         title: "Error",
//         description: result.error,
//         variant: "destructive",
//       })
//     } else {
//       toast({
//         title: "Success",
//         description: `Complaint status updated to ${status}`,
//       })
//     }
//   }

//   const filteredComplaints = complaints.filter((complaint) => {
//     const matchesSearch =
//       complaint.title.toLowerCase().includes(filter.toLowerCase()) ||
//       complaint.profile?.full_name.toLowerCase().includes(filter.toLowerCase())
//     const matchesStatus = statusFilter === "all" || complaint.status === statusFilter
//     return matchesSearch && matchesStatus
//   })

//   return (
//     <div className="space-y-4">
//       <div className="flex gap-4">
//         <Input
//           placeholder="Search complaints..."
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="max-w-sm"
//         />
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Filter by status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Statuses</SelectItem>
//             <SelectItem value="open">Open</SelectItem>
//             <SelectItem value="assigned">Assigned</SelectItem>
//             <SelectItem value="resolved">Resolved</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Student</TableHead>
//               <TableHead>Complaint</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Photo</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center py-4">
//                   Loading...
//                 </TableCell>
//               </TableRow>
//             ) : filteredComplaints.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center py-4">
//                   No complaints found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredComplaints.map((complaint) => (
//                 <TableRow key={complaint.id}>
//                   <TableCell>{complaint.profile?.full_name}</TableCell>
//                   <TableCell>
//                     <div>
//                       <p className="font-medium">{complaint.title}</p>
//                       <p className="text-sm text-muted-foreground">{complaint.description}</p>
//                       <p className="text-xs text-muted-foreground">
//                         Submitted: {format(new Date(complaint.created_at), "PP")}
//                       </p>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <span
//                       className={`
//                       inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
//                       ${
//                         complaint.status === "resolved"
//                           ? "bg-green-100 text-green-700"
//                           : complaint.status === "assigned"
//                             ? "bg-blue-100 text-blue-700"
//                             : "bg-yellow-100 text-yellow-700"
//                       }
//                     `}
//                     >
//                       {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
//                     </span>
//                   </TableCell>
//                   <TableCell>
//                     {complaint.photo_url && (
//                       <div className="relative w-16 h-16">
//                         <Image
//                           src={complaint.photo_url || "/placeholder.svg"}
//                           alt="Complaint photo"
//                           fill
//                           className="object-cover rounded-md"
//                         />
//                       </div>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <Select
//                       defaultValue={complaint.status}
//                       onValueChange={(value) =>
//                         handleStatusUpdate(complaint.id, value as "open" | "assigned" | "resolved")
//                       }
//                     >
//                       <SelectTrigger className="w-[130px]">
//                         <SelectValue placeholder="Update status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="open">Open</SelectItem>
//                         <SelectItem value="assigned">Assigned</SelectItem>
//                         <SelectItem value="resolved">Resolved</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   )
// }

