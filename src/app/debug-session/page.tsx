'use client';

import { useSession } from 'next-auth/react';

export default function DebugSession() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Session</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-lg font-semibold mb-2">Status:</h2>
        <p>{status}</p>
      </div>

      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-lg font-semibold mb-2">Session Data:</h2>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">User Role:</h2>
        <p>{(session?.user as any)?.role || 'No role found'}</p>
      </div>
    </div>
  );
}