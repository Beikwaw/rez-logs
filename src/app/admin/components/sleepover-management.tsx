// "use client"

// import { useState, useEffect } from "react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { createClient } from "@/lib/supabase/client"
// import { updateSleepoverRequest } from "@/app/actions/sleepover"
// import type { SleepoverRequest } from "@/lib/supabase/types"
// import { format } from "date-fns"
// import { useToast } from "@/hooks/use-toast"

// export function SleepoverManagement() {
//   const [requests, setRequests] = useState<SleepoverRequest[]>([])
//   const [loading, setLoading] = useState(true)
//   const [filter, setFilter] = useState("")
//   const [statusFilter, setStatusFilter] = useState<string>("all")
//   const { toast } = useToast()
//   const supabase = createClient()

//   useEffect(() => {
//     const fetchRequests = async () => {
//       const { data, error } = await supabase
//         .from("sleepover_requests")
//         .select(`
//           *,
//           profile:profiles(*)
//         `)
//         .order("created_at", { ascending: false })

//       if (error) {
//         console.error("Error fetching requests:", error)
//         return
//       }

//       setRequests(data)
//       setLoading(false)
//     }

//     fetchRequests()

//     // Set up real-time subscription
//     const subscription = supabase
//       .channel("sleepover-changes")
//       .on("postgres_changes", { event: "*", schema: "public", table: "sleepover_requests" }, fetchRequests)
//       .subscribe()

//     return () => {
//       supabase.removeChannel(subscription)
//     }
//   }, [supabase])

//   const handleStatusUpdate = async (requestId: string, status: "approved" | "denied", adminComment: string) => {
//     const result = await updateSleepoverRequest(requestId, status, adminComment)

//     if (result.error) {
//       toast({
//         title: "Error",
//         description: result.error,
//         variant: "destructive",
//       })
//     } else {
//       toast({
//         title: "Success",
//         description: `Request ${status} successfully`,
//       })
//     }
//   }

//   const filteredRequests = requests.filter((request) => {
//     const matchesSearch =
//       request.guest_name.toLowerCase().includes(filter.toLowerCase()) ||
//       request.profile?.full_name.toLowerCase().includes(filter.toLowerCase())
//     const matchesStatus = statusFilter === "all" || request.status === statusFilter
//     return matchesSearch && matchesStatus
//   })

//   return (
//     <div className="space-y-4">
//       <div className="flex gap-4">
//         <Input
//           placeholder="Search by student or guest name..."
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
//             <SelectItem value="pending">Pending</SelectItem>
//             <SelectItem value="approved">Approved</SelectItem>
//             <SelectItem value="denied">Denied</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Student</TableHead>
//               <TableHead>Guest</TableHead>
//               <TableHead>Dates</TableHead>
//               <TableHead>Status</TableHead>
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
//             ) : filteredRequests.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center py-4">
//                   No requests found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredRequests.map((request) => (
//                 <TableRow key={request.id}>
//                   <TableCell>{request.profile?.full_name}</TableCell>
//                   <TableCell>
//                     <div>
//                       <p className="font-medium">{request.guest_name}</p>
//                       <p className="text-sm text-muted-foreground">ID: {request.guest_id}</p>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div>
//                       <p>From: {format(new Date(request.from_date), "PP")}</p>
//                       <p>To: {format(new Date(request.to_date), "PP")}</p>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex flex-col gap-1">
//                       <span
//                         className={`
//                         inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
//                         ${
//                           request.status === "approved"
//                             ? "bg-green-100 text-green-700"
//                             : request.status === "denied"
//                               ? "bg-red-100 text-red-700"
//                               : "bg-yellow-100 text-yellow-700"
//                         }
//                       `}
//                       >
//                         {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
//                       </span>
//                       {request.admin_comment && (
//                         <span className="text-xs text-muted-foreground">Note: {request.admin_comment}</span>
//                       )}
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     {request.status === "pending" && (
//                       <div className="flex flex-col gap-2">
//                         <Textarea
//                           placeholder="Add a comment (optional)"
//                           className="text-sm min-h-[60px]"
//                           id={`comment-${request.id}`}
//                         />
//                         <div className="flex gap-2">
//                           <Button
//                             size="sm"
//                             variant="default"
//                             onClick={() => {
//                               const comment = (document.getElementById(`comment-${request.id}`) as HTMLTextAreaElement)
//                                 .value
//                               handleStatusUpdate(request.id, "approved", comment)
//                             }}
//                           >
//                             Approve
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="destructive"
//                             onClick={() => {
//                               const comment = (document.getElementById(`comment-${request.id}`) as HTMLTextAreaElement)
//                                 .value
//                               handleStatusUpdate(request.id, "denied", comment)
//                             }}
//                           >
//                             Deny
//                           </Button>
//                         </div>
//                       </div>
//                     )}
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

