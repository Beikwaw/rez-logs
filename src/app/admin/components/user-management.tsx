// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { createClient } from "@/lib/supabase/client"
// import { createUser, deleteUser } from "@/app/actions/users"
// import type { Profile } from "@/lib/supabase/types"
// import { format } from "date-fns"
// import { UserPlus, Trash2 } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// export function UserManagement() {
//   const [users, setUsers] = useState<Profile[]>([])
//   const [loading, setLoading] = useState(true)
//   const [filter, setFilter] = useState("")
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const { toast } = useToast()
//   const supabase = createClient()

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

//       if (error) {
//         console.error("Error fetching users:", error)
//         return
//       }

//       setUsers(data)
//       setLoading(false)
//     }

//     fetchUsers()

//     // Set up real-time subscription
//     const subscription = supabase
//       .channel("profile-changes")
//       .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, fetchUsers)
//       .subscribe()

//     return () => {
//       supabase.removeChannel(subscription)
//     }
//   }, [supabase])

//   const handleCreateUser = async (e: React.FormEvent) => {
//     e.preventDefault()

//     const formData = new FormData(e.target as HTMLFormElement)
//     const result = await createUser(formData)

//     if (result.error) {
//       toast({
//         title: "Error",
//         description: result.error,
//         variant: "destructive",
//       })
//     } else {
//       toast({
//         title: "Success",
//         description: "User created successfully",
//       })
//       setIsDialogOpen(false)(
//         // Reset form
//         e.target as HTMLFormElement,
//       ).reset()
//     }
//   }

//   const handleDeleteUser = async (userId: string) => {
//     const result = await deleteUser(userId)

//     if (result.error) {
//       toast({
//         title: "Error",
//         description: result.error,
//         variant: "destructive",
//       })
//     } else {
//       toast({
//         title: "Success",
//         description: "User deleted successfully",
//       })
//     }
//   }

//   const filteredUsers = users.filter(
//     (user) =>
//       user.full_name.toLowerCase().includes(filter.toLowerCase()) ||
//       user.email.toLowerCase().includes(filter.toLowerCase()),
//   )

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <Input
//           placeholder="Search users..."
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="max-w-sm"
//         />
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogTrigger asChild>
//             <Button>
//               <UserPlus className="h-4 w-4 mr-2" />
//               Add New Student
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add New Student</DialogTitle>
//               <DialogDescription>
//                 Create a new student account. A temporary password will be generated and sent to their email.
//               </DialogDescription>
//             </DialogHeader>
//             <form onSubmit={handleCreateUser} className="space-y-4">
//               <div className="space-y-2">
//                 <Input name="full_name" placeholder="Full Name" required />
//               </div>
//               <div className="space-y-2">
//                 <Input name="email" type="email" placeholder="Email Address" required />
//               </div>
//               <div className="space-y-2">
//                 <Input name="room_number" placeholder="Room Number" required />
//               </div>
//               <DialogFooter>
//                 <Button type="submit">Create Account</Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>Email</TableHead>
//               <TableHead>Room</TableHead>
//               <TableHead>Role</TableHead>
//               <TableHead>Joined</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={6} className="text-center py-4">
//                   Loading...
//                 </TableCell>
//               </TableRow>
//             ) : filteredUsers.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={6} className="text-center py-4">
//                   No users found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredUsers.map((user) => (
//                 <TableRow key={user.id}>
//                   <TableCell>{user.full_name}</TableCell>
//                   <TableCell>{user.email}</TableCell>
//                   <TableCell>{user.room_number}</TableCell>
//                   <TableCell>
//                     <span
//                       className={`
//                       inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
//                       ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}
//                     `}
//                     >
//                       {user.role}
//                     </span>
//                   </TableCell>
//                   <TableCell>{format(new Date(user.created_at), "PP")}</TableCell>
//                   <TableCell>
//                     {user.role !== "admin" && (
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="text-destructive"
//                         onClick={() => handleDeleteUser(user.id)}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
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

