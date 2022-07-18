import React, { useEffect, useState, createContext } from 'react'
import EditQuestion from '../components/EditQuestion'
import "./EditForms.css";
import Auth from '../utils/auth';

interface Form {
    id: string,
    user: Object,
    name: string,
    lastUpdated: number,
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

interface FormContextInterface {
    formData: Form,
    setFormData: React.Dispatch<React.SetStateAction<Form>>
}

const defaultFormData = {
    id: "0",
    user: {},
    name: "New Form",
    lastUpdated: 0,
    questions: [
        {
            name: "New Question",
            number: 0,
            hasOther: false,
            choices: [
                {
                    name: "New Choice"
                },
                {
                    name: "New Choice"
                },
                {
                    name: "New Choice"
                },
                {
                    name: "New Choice"
                },
            ]
        }
    ]
};


const FormContext = createContext<FormContextInterface | null>(null)

const EditForms = () => {
    if (!Auth.loggedIn()) window.location.href = "/signIn";
    const [number, setNumber] = useState(0)
    const [formData, setFormData] = useState(defaultFormData);
    const [successMessage, setSuccessMessage] = useState("");
    const getFormData = async () => {
        const response = await fetch(`/api/formInfo/${window.location.pathname.split("/")[window.location.pathname.split("/").length - 1]}`, {
            method: "GET",
            headers: {
                Authorization: Auth.getToken(),
                edit: "true"
            }
        });
        const data = await response.json();
        if (data.code === 401) window.location.href = "/forms";
        setFormData(data.form);
        setNumber(formData.questions[formData.questions.length - 1].number + 1);
    }

    const addEditQuestion = () => {
        const tempFormData = formData
        tempFormData.questions.push({ name: "New Question", hasOther: false, number, choices: [{ name: "New choice" }, { name: "New choice" }, { name: "New choice" }, { name: "New choice" }] })
        setFormData({ ...tempFormData });
        setNumber(number + 1);
    }

    const deleteQuestionParent = (question: number) => {
        const tempFormData = formData;
        tempFormData.questions = formData.questions.filter(i => i.number !== question);
        setFormData({ ...tempFormData });
    }

    const handleInputChange = (e: any) => {
        const tempFormData = formData;
        tempFormData.name = e.target.value;
        setFormData({ ...tempFormData });
    }

    const saveChanges = async () => {
        const response = await fetch(`/api/saveForm/${formData.id}`, {
            method: "POST",
            headers: {
                Authorization: Auth.getToken(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.code === 500 || 401) {
            setSuccessMessage(data.message);
            setTimeout(() => setSuccessMessage(""), 3000)
            return;
        }
        getFormData();
        setSuccessMessage("Successfully saved form!");
        setTimeout(() => setSuccessMessage(""), 3000);
    }

    useEffect(() => {
        getFormData();
    }, [])

    return (
        <div className="EditForms">
            <h2 className="successMessage" style={successMessage.length > 0 ? successMessage[0] === "S" ? {display: "block"} : {display: "block", color: "red"}: {display: "none"}}>{successMessage}</h2>
            <input className="name" value={formData.name} onChange={handleInputChange}></input>
            <FormContext.Provider value={{ formData, setFormData }}>
                {formData.questions.map((i: any, index: number) => <div className="questionContainer"><button onClick={() => deleteQuestionParent(i.number)}>Delete</button><EditQuestion number={index} FormContext={FormContext}></EditQuestion></div>)}
            </FormContext.Provider>
            <button onClick={addEditQuestion}>Add question</button>
            <button onClick={saveChanges}>Save changes</button>
        </div>
    )
}

export default EditForms