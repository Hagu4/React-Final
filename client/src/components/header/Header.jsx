import styles from "./header.module.css";
import { Button } from "react-bootstrap";
import {useContext} from "react";
import {AppContext} from "../../App.jsx";
import {useNavigate} from "react-router-dom";


export function Header() {
    const { setPage, user, setUser } = useContext(AppContext)
    const navigate = useNavigate()
    const LogOut = () => {
        navigate("/auth")
        localStorage.removeItem("userStore")
        setUser(null)
    }
    return (
        <header className={styles.header}>
            <div className={styles.contain}>
                <h3 style={{cursor: "pointer"}} onClick={() => navigate("/")}>Админ панель</h3>
            </div>
            <div className={styles.contain}>
                {user ?
                    <>
                        <h4 style={{marginRight: '25px', cursor: "pointer"}}
                            onClick={() => navigate("/account")}>Профиль</h4>
                        <h3 style={{marginRight: '25px'}}>{user.user.username}</h3>
                        <Button onClick={LogOut} variant="primary">Выйти</Button>
                    </>
                    :
                    <Button className={styles.button} onClick={() => setPage("/auth")} variant="primary">Войти</Button>
                }
            </div>
        </header>
    )
}
