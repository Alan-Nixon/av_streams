import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { cancelSubscription, getPremiumUsers } from '../../../Functions/userFunctions/adminManagement'
import { DataTable, showConfirmationToast } from '../../Helpers/helperComponents'
import { channelInterface } from '../../../Functions/interfaces'
import { toast } from 'react-toastify'

function OfferManagement() {

  const [premiumUsers, setPremiumUsers] = useState<channelInterface[]>([])
  const [subscription, setSubscription] = useState(false)

  useEffect(() => {
    getPremiumUsers().then(({ data }) => setPremiumUsers(data))
    console.log(premiumUsers)
  }, [])

  const confirmCancelSubscription = () => {
    toast.dismiss()
    cancelSubscription(subscription).then(() => {
      getPremiumUsers().then(({ data }) => setPremiumUsers(data))
      setTimeout(() => toast.success("successfully canceled subscription"))
    })
  }

  const Headings = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'userName', headerName: 'Name', width: 110 },
    { field: 'channelName', headerName: 'Channel Name', width: 130 },
    {
      field: 'Email', headerName: 'Email', width: 210,
      renderCell: (params: any) => params?.row?.subscription?.email || ''
    },
    {
      field: 'Expires', headerName: 'Blocked', width: 130,
      renderCell: (params: any) => params?.row?.subscription?.expires || ''
    },
    {
      field: 'Section', headerName: 'Section', width: 150,
      renderCell: (params: any) => params?.row?.subscription?.section || ''
    },
    {
      field: 'Amount', headerName: 'Amount', width: 100,
      renderCell: (params: any) => params?.row?.subscription?.amount || ''
    },
    {
      field: 'cancel', headerName: 'Action', width: 130, renderCell: (params: any) => {
        setSubscription(params.row.subscription)
        return (
          <a href="#" onClick={() => showConfirmationToast(confirmCancelSubscription)}>cancel</a>
        );
      }
    }
  ]



  return (
    <div>
      <Layout>
        <h1 className="text-xl m-2">Subscription Management</h1>
        <div className="w-[90%] m-8">
          {premiumUsers.length !== 0 && <DataTable columnsData={Headings} rowsData={premiumUsers} />}
        </div>
      </Layout>
    </div>
  )
}

export default React.memo(OfferManagement)
