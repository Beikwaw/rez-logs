// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { createAnnouncement, updateAnnouncement, deleteAnnouncement } from "@/app/actions/announcements"
// import { Pencil, Trash2, Save, X } from "lucide-react"
// import { format } from "date-fns"

// export function AnnouncementManagement() {
//   const [announcements, setAnnouncements] = useState<Announcement[]>([])
//   const [loading, setLoading] = useState(true)
//   const [editingId, setEditingId] = useState<string | null>(null)
//   const { toast } = useToast()
//   const supabase = createClient()

//   const [newAnnouncement, setNewAnnouncement] = useState({
//     title: "",
//     message: "",
//   })

//   useEffect(() => {
//     const fetchAnnouncements = async () => {
//       const { data, error } = await supabase
//         .from("announcements")
//         .select(`
//           *,
//           profile:profiles(*)
//         `)
//         .order("created_at", { ascending: false })

//       if (error) {
//         console.error("Error fetching announcements:", error)
//         return
//       }

//       setAnnouncements(data)
//       setLoading(false)
//     }

//     fetchAnnouncements()

//     // Set up real-time subscription
//     const subscription = supabase
//       .channel("announcement-changes")
//       .on("postgres_changes", { event: "*", schema: "public", table: "announcements" }, fetchAnnouncements)
//       .subscribe()

//     return () => {
//       supabase.removeChannel(subscription)
//     }
//   }, [supabase])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     const formData = new FormData()
//     formData.append("title", newAnnouncement.title)
//     formData.append("message", newAnnouncement.message)

//     const result = await createAnnouncement(formData)

//     if (result.error) {
//       toast({
//         title: "Error",
//         description: result.error,
//         variant: "destructive",
//       })
//     } else {
//       toast({
//         title: "Success",
//         description: "Announcement created successfully",
//       })
//       setNewAnnouncement({ title: "", message: "" })
//     }
//   }

//   const handleUpdate = async (id: string, title: string, message: string) => {
//     const result = await updateAnnouncement(id, title, message)

//     if (result.error) {
//       toast({
//         title: "Error",
//         description: result.error,
//         variant: "destructive",
//       })
//     } else {
//       toast({
//         title: "Success",
//         description: "Announcement updated successfully",
//       })
//       setEditingId(null)
//     }
//   }

//   const handleDelete = async (id: string) => {
//     const result = await deleteAnnouncement(id)

//     if (result.error) {
//       toast({
//         title: "Error",
//         description: result.error,
//         variant: "destructive",
//       })
//     } else {
//       toast({
//         title: "Success",
//         description: "Announcement deleted successfully",
//       })
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Create New Announcement</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Input
//                 placeholder="Announcement Title"
//                 value={newAnnouncement.title}
//                 onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, title: e.target.value }))}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Textarea
//                 placeholder="Announcement Message"
//                 value={newAnnouncement.message}
//                 onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, message: e.target.value }))}
//                 required
//                 className="min-h-[100px]"
//               />
//             </div>
//             <Button type="submit">Post Announcement</Button>
//           </form>
//         </CardContent>
//       </Card>

//       <div className="space-y-4">
//         {loading ? (
//           <Card>
//             <CardContent className="py-6 text-center">Loading announcements...</CardContent>
//           </Card>
//         ) : announcements.length === 0 ? (
//           <Card>
//             <CardContent className="py-6 text-center">No announcements found</CardContent>
//           </Card>
//         ) : (
//           announcements.map((announcement) => (
//             <Card key={announcement.id}>
//               <CardContent className="pt-6">
//                 {editingId === announcement.id ? (
//                   <div className="space-y-4">
//                     <Input defaultValue={announcement.title} id={`title-${announcement.id}`} />
//                     <Textarea
//                       defaultValue={announcement.message}
//                       id={`message-${announcement.id}`}
//                       className="min-h-[100px]"
//                     />
//                     <div className="flex gap-2">
//                       <Button
//                         size="sm"
//                         onClick={() => {
//                           const title = (document.getElementById(`title-${announcement.id}`) as HTMLInputElement).value
//                           const message = (document.getElementById(`message-${announcement.id}`) as HTMLTextAreaElement)
//                             .value
//                           handleUpdate(announcement.id, title, message)
//                         }}
//                       >
//                         <Save className="h-4 w-4 mr-1" />
//                         Save
//                       </Button>
//                       <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
//                         <X className="h-4 w-4 mr-1" />
//                         Cancel
//                       </Button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div>
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="font-semibold text-lg">{announcement.title}</h3>
//                         <p className="text-sm text-muted-foreground">
//                           Posted by {announcement.profile?.full_name} on{" "}
//                           {format(new Date(announcement.created_at), "PP")}
//                         </p>
//                       </div>
//                       <div className="flex gap-2">
//                         <Button size="sm" variant="ghost" onClick={() => setEditingId(announcement.id)}>
//                           <Pencil className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="ghost"
//                           className="text-destructive"
//                           onClick={() => handleDelete(announcement.id)}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                     <p className="mt-2">{announcement.message}</p>
//                     {announcement.updated_at !== announcement.created_at && (
//                       <p className="text-xs text-muted-foreground mt-2">
//                         Last updated: {format(new Date(announcement.updated_at), "PP")}
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }

