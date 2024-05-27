import styles from "./body.module.css"
import {Button} from "react-bootstrap";
import { useContext, useState } from "react";
import { AppContext } from "../../../App.jsx";
import { jwtDecode } from 'jwt-decode'
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
export default function Body() {
    const { setUser, user } = useContext(AppContext);
    const [editName, setEditName] = useState(false)
    const [editPassword, setEditPassword] = useState(false)
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState,
    } = useForm();
    const handleSave = (data) => {
        const state = {user: jwtDecode(data.token), access_token: data.token}
        setUser(state)
        localStorage.setItem("userStore", JSON.stringify(state))
        navigate("/")
    }
    function onSubmit(values) {
        fetch(`http://localhost:3000/user/update`, {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${user.access_token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => handleSave(data))
            .catch(error => console.error('Error:', error));
    }

    return (
        <div className={styles.auth}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <h2 className="text-center mt-4">Профиль</h2>
                <div className={styles.form_inputs}>
                    {!editPassword &&
                        <>
                    <label>
                        Имя
                    </label>
                    <div className="d-flex w-100">
                    <input className="text-black " disabled={editPassword | !editName} {...register('username' )} type="text" placeholder="Введите Имя"/>
                        {editName ? <Button style={{marginLeft: "10px"}} variant="danger" onClick={() => setEditName(false)}>Отмена</Button> : <Button style={{marginLeft: "10px"}} onClick={() => setEditName(true)}>Изменить</Button>}
                    </div>
                        </>}
                    {!editName &&
                        <>
                    <label>
                        Пароль
                    </label>
                    <div className="d-flex w-100">
                    <input disabled={!editPassword | editName} className="text-black" {...register('password')} type="password" placeholder="Введите пароль"/>
                        {editPassword ? <Button style={{marginLeft: "10px"}} variant="danger" onClick={() => setEditPassword(false)}>Отмена</Button> : <Button style={{marginLeft: "10px"}} onClick={() => setEditPassword(true)}>Изменить</Button>}
                    </div>
                        </>

                    }
                    <Button type="submit" className="mt-4 mb-4">Сохранить</Button>
                </div>
            </form>
        </div>
    )
}
