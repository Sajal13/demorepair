import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'

import { 
    useUpdatedNoteMutation, 
    useDeleteNoteMutation 
} from './notesApiSlice';
import useAuth from '../../hooks/useAuth';


const EditNoteForm = ({ note, users }) => {
    const navigate = useNavigate();
    const { isManager, isAdmin } = useAuth();
    const [
        updateNote,
        {
            isLoading,
            isSuccess,
            isError,
            error
        }
    ]= useUpdatedNoteMutation();

    const [
        deleteNote,
        {
            isSuccess: isDelSuccess,
            isError: isDelError,
            error: delError
        }
    ]=useDeleteNoteMutation();

    const [title, setTitle] = useState(note.title);
    const [text, setText] = useState(note.text);
    const [completed, setComplete] = useState(note.completed);
    const [userId, setUserId] = useState(note.user);
    let deleteButton = null;

    useEffect(()=>{
        if(isSuccess || isDelSuccess){
            setTitle('');
            setText('');
            setUserId('');
            navigate('/dash/notes');
        }
    }, [isSuccess, isDelSuccess, navigate]);

    const onTitleChange = e => setTitle(e.target.value);
    const onTextChange = e => setText(e.target.value);
    const onCompletedChange = e => setComplete(prev => !prev);
    const onUserIdChange = e => setUserId(e.target.value);

    const canSave = [title, text, userId].every(Boolean) && !isLoading;

    const onSaveNoteClick = async (e) =>{
        if(canSave){
            await updateNote({
                id: note.id,
                user: userId,
                title,
                text,
                completed
            });
        }
    }

    const onDeleteUserClick = async () =>{
        await deleteNote({
            id: note.id
        });
    }

    const created = new Date(note.createdAt).toLocaleString(
        'en-bn',
        {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }
    );
    const updated = new Date(note.updatedAt).toLocaleString(
        'en-bn',
        {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }
    );
    const options = users.map(user =>{
        return (
            <option
                key={user.id}
                value={user.id}
            >
                {user.username}
            </option>
        )
    });

    if(isManager || isAdmin){
        deleteButton = (
            <button
                className='icon-button'
                title='Delete'
                onClick={onDeleteUserClick}
            >
                <FontAwesomeIcon icon={faTrashCan} />
            </button>
        )
    }

    const errClass = (isError || isDelError) ? 'errmsg' : 'offscreen';
    const validTitleClass = !title ? 'form__input--incomplete' : '';
    const validTextClass = !text ? 'form__input--incomplete' : '';
    const errContent = (error?.data?.message || delError?.data?.message) ?? '';

    return (
        <>
            <p className={errClass}>
                {errContent}
            </p>

            <form 
                className='form'
                onSubmit={e => e.preventDefault()}
            >
                <div 
                    className='form__title-row'
                >
                    <h2>Edit Note #{note.ticket}</h2>
                    <div 
                        className='form__action-buttons'
                    >
                        <button
                            className='icon-button'
                            title='Save'
                            onClick={onSaveNoteClick}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        {
                            deleteButton
                        }
                    </div>
                </div>
                
                <label
                    className='form__label' 
                    htmlFor='note-title'
                >
                    Title:
                </label>
                <input
                    className={`form__input ${validTitleClass}`}
                    id='note-title'
                    name='title'
                    type={'text'}
                    autoComplete='off'
                    value={title}
                    onChange={onTitleChange}
                />

                <label 
                    className='form__label'
                    htmlFor='note-text'
                >
                    Text:
                </label>
                <textarea
                    className={`form__input form__input--text ${validTextClass}`}
                    id='note-text'
                    name='text'
                    value={text}
                    onChange={onTextChange}
                />

                <div className='form__row'>
                    <div className='form__divider'>
                        <label
                            className='form__label form__checkbox-container'
                            htmlFor='note-completed'
                        >
                            WORK COMPLETE:
                            <input
                                className='form__checkbox'
                                id='note-completed'
                                name='completed'
                                type={'checkbox'}
                                checked={completed}
                                onChange={onCompletedChange}
                            />
                        </label>
                        <label
                            className='form__label form__checkbox-container'
                            htmlFor='note-username'
                        >
                            ASSIGNED TO:
                        </label>
                        <select 
                            id='note-username'
                            name='username'
                            className='form__select'
                            value={userId}
                            onChange={onUserIdChange}
                        >
                            {options}
                        </select>
                    </div>
                    <div 
                        className='form__divider'
                    >
                        <p 
                            className='form__created'
                        >
                            Created At: <br/> {created}
                        </p>
                        <p 
                            className='form__updated'
                        >
                            Updated At: <br/> {updated}
                        </p>
                    </div>
                </div>
            </form>
        </>
    )
}

export default EditNoteForm
