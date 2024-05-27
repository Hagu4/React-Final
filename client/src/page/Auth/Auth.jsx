import styles from "./auth.module.css"
import {Button} from "react-bootstrap";
import {useContext, useState} from "react";
import {AppContext} from "../../App.jsx";
import { jwtDecode } from 'jwt-decode'
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
export function Auth() {
    const { setPage,setUser } = useContext(AppContext);
    const [create, setCreate] = useState(false);
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const handleSave = (data) => {
        const state = {user: jwtDecode(data.token), access_token: data.token}
        setUser(state)
        localStorage.setItem("userStore", JSON.stringify(state))
        navigate("/")
    }
    function onSubmit(values) {
        fetch(`http://localhost:3000/${create? "register": "login"}`, {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json'
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
                <h2 className="text-center mt-4">{create? "Регистрация" : "Вход"}</h2>
                <div className={styles.form_inputs}>
                <label>
                    Имя
                </label>
                    <input className="text-black" {...register('username' )} type="text" placeholder="Введите Имя"/>
                    {errors.username && <p>Имя пользователя обязательно</p>}
                <label>
                    Пароль
                </label>
                    <input className="text-black" {...register('password')} type="password" placeholder="Введите пароль"/>
                    {errors.password && <p>Пароль обязателен.</p>}
                    <Button type="submit" className="mt-4 mb-4">Войти</Button>
                </div>
                <h2 className="mb-5" style={{color: "blue", fontSize: "16px", textAlign: 'center'}} onClick={() => setCreate(el => !el)}>{create ? "Есть аккаунт, войдите сейчас!" : "Нет аккаунта, создайте сейчас!"}</h2>
            </form>
        </div>
    )
}
