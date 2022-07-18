import React, { useEffect, useState } from 'react'
import "./Forms.css";
import Auth from '../utils/auth';


const Forms = () => {
    if (!Auth.loggedIn()) window.location.href = "/signIn"
    const [id, setId] = useState("");
    const [loading, setLoading] = useState(true)
    const [forms, setForms] = useState<any[]>([])

    const fetchData = async () => {
        const response = await fetch("/api/getForms", {
            method: "GET",
            headers: {
                Authorization: Auth.getToken()
            }
        });
        const data = await response.json();
        setLoading(false);
        if (data.code !== 200) return;
        setForms(data.formData);
    }

    const formatDate = (unix: number) => {
        const time = new Date(unix * 1000);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const year = time.getFullYear();
        const month = months[time.getMonth()];
        const date = time.getDate();
        const hour = time.getHours();
        const min = time.getMinutes();
        const sec = time.getSeconds();
        return `Last updated on ${month}/${date}/${year} at ${hour}:${min}:${sec}`
    }

    useEffect(() => {
        fetchData();
    }, [])

    const handleCreateForm = async () => {
        const response = await fetch("/api/createForm", {
            method: "POST",
            headers: {
                Authorization: Auth.getToken()
            }
        });
        const data = await response.json();
        setId(data.formId);
    }

    const handleDeleteForm = async (id: string) => {
        const response = await fetch(`/api/deleteForm/${id}`, {
            method: "POST",
            headers: {
                Authorization: Auth.getToken()
            }
        })

        const data = await response.json();

        if (data.code !== 200) return;
        window.location.reload();
    }

    useEffect(() => {
        if (id.length > 0) {
            window.location.href = `/forms/edit/${id}`;
        }
    }, [id])

    return (
        <div className="Forms">
            {loading ? <h2 className="loading">loading...</h2> :
                forms.length <= 0 ? <p className="noForms">You have no forms, make forms <button className="textCreateButton" onClick={handleCreateForm}>here</button></p> :
                    <>
                        {forms.map((i, index) => (
                            <div className="formContainer" id={i._id}>
                                <h2 className="formName">{i.name}</h2>
                                <p>{formatDate(i.lastUpdated)}</p>
                                <div className="buttonContainer">
                                    <button onClick={() => window.location.href = `/forms/edit/${i._id}`}>Edit form</button>
                                    <button onClick={() => handleDeleteForm(i._id)}>Delete form</button>
                                </div>
                            </div>
                        ))}
                        < button className="createButton" onClick={handleCreateForm}>Create form</button>
                    </>
            }
        </div >
    )
}

export default Forms