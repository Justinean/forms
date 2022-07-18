import React, { useEffect, useState } from 'react';
import "./AnswerForms.css";
import Auth from "../utils/auth";
import Question from '../components/Question';

interface Form {
    id: string,
    name: string,
    lastUpdated: number,
    username: string,
    questions:
    {
        name: string,
        number: number,
        hasOther: boolean,
        choices:
        {
            name: string
        }[]
    }[]
}

const AnswerForms = () => {
    const [loading, setLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(false);
    const [formData, setFormData] = useState<Form | null>(null)
    const getFormData = async () => {
        const response = await fetch(`/api/formInfo/${window.location.pathname.split("/")[window.location.pathname.split("/").length - 1]}`, {
            method: "GET",
            headers: {
                Authorization: Auth.getToken(),
                edit: "false"
            }
        });
        const data = await response.json();
        console.log(data)
        if (data.code !== 200) {
            setLoading(false);
            return setLoadingError(true);
        }
        setFormData(data.form)
        setLoading(false);
    }
    useEffect(() => {
        getFormData();
    }, [])
    return (
        <div className='AnswerForms' style={loading || loadingError ? { justifyContent: "center" } : {}}>
            {loading ? <h2 className="loading">Loading...</h2> :
                loadingError ? <h2 className="loadingError">Could not get form data, please try again.</h2> :
                    <>
                        <h2 className="formName">{formData?.name}</h2>
                        <h3 className="creator">Created by: {formData?.username}</h3>
                        {formData?.questions.map((i) => <Question question={i}></Question>)}
                    </>
            }
        </div>
    )
}

export default AnswerForms