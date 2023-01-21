import React, {useState, useEffect} from 'react';
import { useAddNewUserMutation } from './usersApiSlice';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { ROLES } from '../../config/roles'
import useTitle from '../../hooks/useTitle';

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;


const NewUserForm = () => {
    useTitle('New User')

    const navigate = useNavigate();
    const [
        addNewUser,{
            isLoading,
            isSuccess,
            isError,
            error
        }
    ] = useAddNewUserMutation();
    
    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(["Employee"])

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if (isSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }
    }, [isSuccess, navigate])

    const onUsernameChange = e => setUsername(e.target.value)
    const onPasswordChange = e => setPassword(e.target.value)

    const onRolesChange = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setRoles(values)
    }
    const canSave = [roles.length, validPassword, validUsername].every(Boolean) && !isLoading;

    const onSaveUserClick = async (e) =>{
        e.preventDefault();
        if(canSave){
            await addNewUser({
                username,
                password,
                roles
            })
        }
    }

    const options = Object.values(ROLES).map(role =>{
        return (
            <option
                key = {role}
                value = {role}
            >
                {role}
            </option>
        )
    })
    const errClass = isError ? 'errmsg' : "offscreen";
    const validUserClass = !validUsername ? 'form__input--incomple': '';
    const validPwdClass = !validPassword ? 'form__input--incomplete' : '';
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : '';

  return (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className='form' onSubmit={onSaveUserClick}>
        <div className='form__title-row'>
            <h2>New User</h2>
            <div className='form__actions-buttons'>
                <button 
                    className='icon-button'
                    title='Save'
                    disabled={!canSave}
                >
                    <FontAwesomeIcon icon={faSave} />
                </button>
            </div>
        </div>
        <label className='form__label' htmlFor='username'>
            Username: <span className='nowrap'>
                [3-20 letters]
            </span>
        </label>
        <input
            className={`form__input ${validUserClass}`}
            id='username'
            name='username'
            type='text'
            autoComplete='off'
            value={username}
            onChange={onUsernameChange}
        />

        <label className='form__label' htmlFor='password'>
            Password: <span className='nowrap'>
                [4-12 charcters incl. !@#$%]
            </span>
        </label>

        <input
            className={`form__input ${validPwdClass}`}
            id='password'
            name='password'
            type={'password'}
            value={password}
            onChange={onPasswordChange}
        />

        <label className='form__label' htmlFor='roles'>
            ASSIGNED ROLES: 
        </label>
        <select
            id='roles'
            name='roles'
            className={`form__select ${validRolesClass}`}
            multiple={true}
            size='3'
            value={roles}
            onChange={onRolesChange}
        >
            {options}
        </select>
      </form>
    </>
  )
}

export default NewUserForm;
