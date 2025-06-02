import { Box, Button, Input, Page, useNavigate } from "zmp-ui"
import SessionCard from "../SessionCard/SessionCard"
import "./studentGroup.scss"
import { useEffect, useState } from "react"
import axios from "axios"
import { url } from "../../../AppConfig/AppConfig"

const StudentGroup = () => {

    const navigate = useNavigate()
    const [sesision, setSession]= useState([])

    useEffect(()=>{
        getAllSession()
    }, [])

    const getAllSession = async()=>{
        const id = JSON.parse(localStorage.getItem("user")).userId
        try {

            const response = await axios.get(`${url}/api/admin/sessions/get?gvId=${id}`)
            const { data } = response
            setSession(data)
            console.log(data);
            
        } catch (error) {
            console.log(error);
            
        }
    }
  
    return (


        <Page>
            <Box className="groupContainer">
                <Box>
                    <Button className="btn-class" onClick={()=>navigate("/create-session")}>Tạo nhóm học</Button>
                </Box>
                <Box className="sessionCard">
                    {
                        sesision.length > 0 &&
                        sesision.map((item, index)=>(<SessionCard  s={item} key={index} />))
                    }    
                    
                </Box>
            </Box>

        </Page>
    )
}

export default StudentGroup