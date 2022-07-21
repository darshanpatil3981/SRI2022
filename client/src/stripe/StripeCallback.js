import { useEffect } from "react";
import { useSelector, useDispatch} from 'react-redux';
import { LoadingOutlined } from "@ant-design/icons";
import { getAccountStatus } from "../actions/stripe";
import { updateUserInLocalStorage } from "../actions/auth";


const StripeCallback = ({history}) => {

    const {auth} = useSelector((state) => ({...state}));
    const dispatch = useDispatch();

    useEffect(() => {
        if(auth && auth.token) accountStatus();
    }, [auth])

    const accountStatus = async () => {
        try {
            const res = await getAccountStatus(auth.token);
            // console.log("User status on stripe callback: ",res);
            // update user in localStorage
            updateUserInLocalStorage(res.data, () =>{
                // update user in redux 
                dispatch({
                    type: "LOGGED_IN_USER",
                    payload: res.data,
                });

                //redirect user to dashboard
                window.location.href = '/dashboard/seller';
            });
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <div className="d-flex justify-content-center p-5">
                <LoadingOutlined className="display-1 p-5 text-danger" />
            </div>
        </>
    );
};

export default StripeCallback;