// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Textarea } from "@/components/ui/textarea"
// import { useToast } from "@/hooks/use-toast"
// import { CheckCircle, XCircle, Clock, Moon, Wrench, UserPlus, ChevronDown, ChevronUp } from "lucide-react"

// // Types for different request categories
// type RequestStatus = "pending" | "approved" | "rejected"

// interface BaseRequest {
//   id: string
//   studentName: string
//   roomNumber: string
//   dateSubmitted: string
//   status: RequestStatus
//   adminNotes?: string
// }

// interface SleepoverRequest extends BaseRequest {
//   type: "sleepover"
//   guestName: string
//   guestId: string
//   fromDate: string
//   tillDate: string
// }

// interface MaintenanceRequest extends BaseRequest {
//   type: "maintenance"
//   issueType: string
//   location: string
//   description: string
//   priority: "low" | "medium" | "high" | "emergency"
// }

// interface GuestRequest extends BaseRequest {
//   type: "guest"
//   guestName: string
//   purpose: string
//   fromDate: string
//   tillDate: string
// }

// type Request = SleepoverRequest | MaintenanceRequest | GuestRequest

// export function RequestManagement() {
//   const { toast } = useToast()
//   const [expandedRequest, setExpandedRequest] = useState<string | null>(null)
//   const [adminNote, setAdminNote] = useState("")

//   // Sample data - in a real app this would come from a database
//   const [requests, setRequests] = useState<Request[]>([
//     {
//       id: "1",
//       type: "sleepover",
//       studentName: "John Smith",
//       roomNumber: "A-101",
//       dateSubmitted: "2025-03-08",
//       status: "pending",
//       guestName: "Jane Doe",
//       guestId: "ID12345",
//       fromDate: "2025-03-15",
//       tillDate: "2025-03-16",
//     },
//     {
//       id: "2",
//       type: "maintenance",
//       studentName: "Sarah Johnson",
//       roomNumber: "B-205",
//       dateSubmitted: "2025-03-07",
//       status: "pending",
//       issueType: "plumbing",
//       location: "bathroom",
//       description: "The sink is leaking and causing water damage to the cabinet below.",
//       priority: "medium",
//     },
//     {
//       id: "3",
//       type: "guest",
//       studentName: "Michael Brown",
//       roomNumber: "C-310",
//       dateSubmitted: "2025-03-09",
//       status: "pending",
//       guestName: "Robert Brown",
//       purpose: "Family visit",
//       fromDate: "2025-03-12",
//       tillDate: "2025-03-12",
//     },
//   ])

//   const toggleExpand = (id: string) => {
//     setExpandedRequest(expandedRequest === id ? null : id)
//   }

//   const updateRequestStatus = (id: string, newStatus: RequestStatus) => {
//     setRequests(
//       requests.map((request) =>
//         request.id === id
//           ? {
//               ...request,
//               status: newStatus,
//               adminNotes: adminNote.trim() ? adminNote : request.adminNotes,
//             }
//           : request,
//       ),
//     )

//     toast({
//       title: `Request ${newStatus}`,
//       description: `The request has been ${newStatus}.`,
//     })

//     setAdminNote("")
//     setExpandedRequest(null)
//   }

//   const getRequestIcon = (request: Request) => {
//     switch (request.type) {
//       case "sleepover":
//         return <Moon className="h-4 w-4" />
//       case "maintenance":
//         return <Wrench className="h-4 w-4" />
//       case "guest":
//         return <UserPlus className="h-4 w-4" />
//     }
//   }

//   const getRequestTypeLabel = (request: Request) => {
//     switch (request.type) {
//       case "sleepover":
//         return "Sleepover Request"
//       case "maintenance":
//         return "Maintenance Request"
//       case "guest":
//         return "Guest Registration"
//     }
//   }

//   const getStatusBadge = (status: RequestStatus) => {
//     switch (status) {
//       case "approved":
//         return (
//           <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
//             <CheckCircle className="mr-1 h-3 w-3" /> Approved
//           </Badge>
//         )
//       case "rejected":
//         return (
//           <Badge variant="destructive">
//             <XCircle className="mr-1 h-3 w-3" /> Rejected
//           </Badge>
//         )
//       default:
//         return (
//           <Badge variant="outline">
//             <Clock className="mr-1 h-3 w-3" /> Pending
//           </Badge>
//         )
//     }
//   }

//   const renderRequestDetails = (request: Request) => {
//     switch (request.type) {
//       case "sleepover":
//         return (
//           <>
//             <div className="grid grid-cols-2 gap-4 mt-4">
//               <div>
//                 <p className="text-sm font-medium">Guest Name</p>
//                 <p className="text-sm">{request.guestName}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium">Guest ID</p>
//                 <p className="text-sm">{request.guestId}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium">From Date</p>
//                 <p className="text-sm">{request.fromDate}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium">Till Date</p>
//                 <p className="text-sm">{request.tillDate}</p>
//               </div>
//             </div>
//           </>
//         )
//       case "maintenance":
//         return (
//           <>
//             <div className="grid grid-cols-2 gap-4 mt-4">
//               <div>
//                 <p className="text-sm font-medium">Issue Type</p>
//                 <p className="text-sm capitalize">{request.issueType}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium">Location</p>
//                 <p className="text-sm capitalize">{request.location}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium">Priority</p>
//                 <p className="text-sm capitalize">{request.priority}</p>
//               </div>
//             </div>
//             <div className="mt-4">
//               <p className="text-sm font-medium">Description</p>
//               <p className="text-sm">{request.description}</p>
//             </div>
//           </>
//         )
//       case "guest":
//         return (
//           <>
//             <div className="grid grid-cols-2 gap-4 mt-4">
//               <div>
//                 <p className="text-sm font-medium">Guest Name</p>
//                 <p className="text-sm">{request.guestName}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium">Purpose</p>
//                 <p className="text-sm">{request.purpose}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium">From Date</p>
//                 <p className="text-sm">{request.fromDate}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium">Till Date</p>
//                 <p className="text-sm">{request.tillDate}</p>
//               </div>
//             </div>
//           </>
//         )
//     }
//   }

//   const pendingRequests = requests.filter((r) => r.status === "pending")
//   const processedRequests = requests.filter((r) => r.status !== "pending")

//   return (
//     <div className="space-y-6">
//       <Tabs defaultValue="pending">
//         <TabsList>
//           <TabsTrigger value="pending">Pending Requests ({pendingRequests.length})</TabsTrigger>
//           <TabsTrigger value="processed">Processed Requests ({processedRequests.length})</TabsTrigger>
//         </TabsList>

//         <TabsContent value="pending" className="space-y-4 mt-4">
//           {pendingRequests.length === 0 ? (
//             <Card>
//               <CardContent className="pt-6 text-center text-muted-foreground">
//                 No pending requests to display.
//               </CardContent>
//             </Card>
//           ) : (
//             pendingRequests.map((request) => (
//               <Card key={request.id} className="overflow-hidden">
//                 <CardHeader className="pb-3">
//                   <div className="flex justify-between items-start">
//                     <div className="flex items-center gap-2">
//                       {getRequestIcon(request)}
//                       <CardTitle className="text-lg">{getRequestTypeLabel(request)}</CardTitle>
//                     </div>
//                     {getStatusBadge(request.status)}
//                   </div>
//                   <CardDescription>
//                     From {request.studentName} in Room {request.roomNumber} • Submitted on {request.dateSubmitted}
//                   </CardDescription>
//                 </CardHeader>

//                 <CardContent className="pb-3">
//                   <Button
//                     variant="ghost"
//                     className="p-0 h-auto text-sm flex items-center"
//                     onClick={() => toggleExpand(request.id)}
//                   >
//                     {expandedRequest === request.id ? (
//                       <>
//                         View Less <ChevronUp className="ml-1 h-4 w-4" />
//                       </>
//                     ) : (
//                       <>
//                         View Details <ChevronDown className="ml-1 h-4 w-4" />
//                       </>
//                     )}
//                   </Button>

//                   {expandedRequest === request.id && (
//                     <div className="mt-4 space-y-4">
//                       {renderRequestDetails(request)}

//                       <div className="border-t pt-4 mt-4">
//                         <p className="text-sm font-medium mb-2">Admin Notes</p>
//                         <Textarea
//                           placeholder="Add notes about this request..."
//                           value={adminNote}
//                           onChange={(e) => setAdminNote(e.target.value)}
//                           className="mb-4"
//                         />
//                         <div className="flex gap-2 justify-end">
//                           <Button variant="outline" onClick={() => updateRequestStatus(request.id, "rejected")}>
//                             <XCircle className="mr-2 h-4 w-4" />
//                             Reject
//                           </Button>
//                           <Button onClick={() => updateRequestStatus(request.id, "approved")}>
//                             <CheckCircle className="mr-2 h-4 w-4" />
//                             Approve
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </TabsContent>

//         <TabsContent value="processed" className="space-y-4 mt-4">
//           {processedRequests.length === 0 ? (
//             <Card>
//               <CardContent className="pt-6 text-center text-muted-foreground">
//                 No processed requests to display.
//               </CardContent>
//             </Card>
//           ) : (
//             processedRequests.map((request) => (
//               <Card key={request.id}>
//                 <CardHeader className="pb-3">
//                   <div className="flex justify-between items-start">
//                     <div className="flex items-center gap-2">
//                       {getRequestIcon(request)}
//                       <CardTitle className="text-lg">{getRequestTypeLabel(request)}</CardTitle>
//                     </div>
//                     {getStatusBadge(request.status)}
//                   </div>
//                   <CardDescription>
//                     From {request.studentName} in Room {request.roomNumber} • Submitted on {request.dateSubmitted}
//                   </CardDescription>
//                 </CardHeader>

//                 <CardContent className="pb-3">
//                   <Button
//                     variant="ghost"
//                     className="p-0 h-auto text-sm flex items-center"
//                     onClick={() => toggleExpand(request.id)}
//                   >
//                     {expandedRequest === request.id ? (
//                       <>
//                         View Less <ChevronUp className="ml-1 h-4 w-4" />
//                       </>
//                     ) : (
//                       <>
//                         View Details <ChevronDown className="ml-1 h-4 w-4" />
//                       </>
//                     )}
//                   </Button>

//                   {expandedRequest === request.id && (
//                     <div className="mt-4 space-y-4">
//                       {renderRequestDetails(request)}

//                       {request.adminNotes && (
//                         <div className="border-t pt-4 mt-4">
//                           <p className="text-sm font-medium mb-2">Admin Notes</p>
//                           <div className="bg-muted p-3 rounded-md text-sm">{request.adminNotes}</div>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

