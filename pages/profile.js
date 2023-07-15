import { useSession } from 'next-auth/react'
import React from 'react'


function profile() {
  const session =useSession()
  console.log('session profile :>> ', session);
  return (
    <div> well come to My profile </div>
  )
}

export default profile