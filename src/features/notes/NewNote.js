import { SyncLoader } from "react-spinners";
import { useGetUsersQuery } from "../users/usersApiSlice";
import NewNoteForm from "./NewNoteForm";
import useTitle from "../../hooks/useTitle"


const NewNote = () =>{
    useTitle('New-Note')

    const { users } = useGetUsersQuery(
        "usersList",
        {
            selectFromResult: ({data}) =>({
                users: data?.ids.map(id => data?.entities[id])
            })
        }
    )
    if(!users?.length){
        return <SyncLoader color={'#FFF'} />
    }
    
    return(
        <>
            {
                <NewNoteForm users={users} />
            }
        </>
    )
}

export default NewNote;