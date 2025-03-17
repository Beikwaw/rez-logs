import React from 'react';
import { assignStaffToRequest } from '@/lib/firestore';

export default function AssignStaff({ requestId }: { requestId: string }) {
  const [staffId, setStaffId] = React.useState('');

  const handleAssign = async () => {
    await assignStaffToRequest(requestId, staffId);
    alert('Staff assigned successfully');
  };

  return (
    <div>
      <h2>Assign Staff</h2>
      <input
        type="text"
        value={staffId}
        onChange={(e) => setStaffId(e.target.value)}
        placeholder="Enter staff ID"
      />
      <button onClick={handleAssign}>Assign</button>
    </div>
  );
}
