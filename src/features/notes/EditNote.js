import { useParams } from "react-router";
import { SyncLoader } from "react-spinners";

import { useGetNotesQuery } from "./notesApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import EditNoteForm from "./EditNoteForm";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle"

const EditNote = () => {
    useTitle('Edit-Note')
    const { id } = useParams();
    
    const { username, isManager, isAdmin } = useAuth()

    const { note } = useGetNotesQuery(
        'noteList',
        {
            selectFromResult: ({ data }) => ({
                note: data?.entities[id]
            }),
        }
    )

    const { users } = useGetUsersQuery(
        'userList',
        {
            selectFromResult: ({ data }) => ({
                users: data?.ids.map(id =>(
                    data?.entities[id]
                ))
            }),
        }
    )
    if(!note || !users.length) {
        return <SyncLoader color={'#FFF'} />
    }

    if(!isManager && !isAdmin) {
        if(note.username !== username){
            return (
                <p className="errmsg">
                    No Access Allowed...
                </p>
            )
        }
    }
    return (
        <>
            {
            
                 <EditNoteForm note={note} users={users} />

            }
        </>
    )
}

export default EditNote
