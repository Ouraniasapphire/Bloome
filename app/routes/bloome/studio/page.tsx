import { useParams } from "react-router";
import useAuth from "~/hooks/useAuth";


const Studio = () => {

    const { classID } = useParams();

    return <>
    
        {classID}
    </>
}