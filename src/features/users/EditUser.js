import { useParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";

import { useGetUsersQuery } from "./usersApiSlice";
import EditUserForm from "./EditUserForm";
import useTitle from "../../hooks/useTitle";

const EditUser = () => {
    useTitle('Edit User')

    const { id } = useParams();
    const { user } = useGetUsersQuery(
      'usersList',
      {
        selectFromResult: ({ data }) => ({
          user: data?.entities[id]
        }),
      }
    )
    
    if(!user){
      return <SyncLoader color={"#FFF"} />
    }
    return (
      <>
          {
            <EditUserForm user={user} />
          } 
      </>
    )
}

export default EditUser
