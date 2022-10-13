import { useContext } from 'react';
import UserContext from '../context/UserContext';
export default function Logout() {
    const userCtx = useContext(UserContext);
    userCtx.logout();
}
