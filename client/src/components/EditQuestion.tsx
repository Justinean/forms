import React, { useEffect, useState, useContext } from 'react'
import "./EditQuestion.css"

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

interface props {
    number: number,
    FormContext: React.Context<FormContextInterface | null>
}

const EditQuestion = ({ number, FormContext }: props) => {
    const { formData, setFormData } = useContext<any>(FormContext);
    const [tempFormData, setTempFormData] = useState(formData);
    const handleQuestionChange = (e: any) => {
        tempFormData.questions[number].name = e.target.value;
        setFormData({ ...tempFormData })
    }
    const handleInputChange = (e: any, index: number) => {
        setTempFormData(formData);
        const id = formData.questions[number].choices[index]._id;
        const editedAnswersCopy = [...formData.questions[number].choices];
        let newEditedAnswers = [...formData.questions[number].choices.splice(0, index), { _id: id, name: e.target.value }, ...editedAnswersCopy.splice(index + 1, editedAnswersCopy.length - 1)];
        tempFormData.questions[number].choices = newEditedAnswers
        setFormData({ ...tempFormData });
    }
    const deleteChoice = (index: number) => {
        setTempFormData(formData)
        if (index === -1 && formData.questions[number].hasOther) {
            tempFormData.questions[number].hasOther = false;
            setFormData({...tempFormData})
            return;
        }
        const newChoices = tempFormData.questions[number].choices.filter((i: any, ind: number) => ind !== index);
        tempFormData.questions[number].choices = newChoices
        setFormData({ ...tempFormData });
    }
    const addChoice = () => {
        setTempFormData(formData)
        tempFormData.questions[number].choices = [...formData.questions[number].choices, {name: "New choice"}];
        setFormData({...tempFormData})
    }
    const addOther = () => {
        setTempFormData(formData)
        if (formData.questions[number].hasOther) return;
        tempFormData.questions[number].hasOther = true;
        setFormData({...tempFormData});
    }
    useEffect(() => {
        setTempFormData(formData);
    }, [formData])
    return (
        <div className="EditQuestion" id={`${number}`}>
            <input className="question" value={formData.questions[number].name} onChange={handleQuestionChange}></input>
            <div className="choiceList">
                {formData.questions[number].choices.map((i: {_id: string, name: string} | null, index: number) => <div className="choice" key={index}><div className="subContainer"><button className="selectButton">()</button>{i?.name !== "Other..." ? <input aria-label={`${index}`} value={formData.questions[number].choices[index].name} onChange={(e) => handleInputChange(e, index)}></input> : <p>{i.name}</p>}</div><button className="deleteButton" onClick={(e) => deleteChoice(index)}>Delete choice</button></div>)}
                {formData.questions[number].hasOther ? <div className="choice"><div className="subContainer"><button className="selectButton">()</button><p>Other...</p></div><button className="deleteButton" onClick={(e) => deleteChoice(-1)}>Delete choice</button></div> : <></>}
            </div>
            <div className="buttonContainer">
                <button className="addButton" onClick={addChoice}>Add choice</button><button className="otherButton" onClick={addOther}>Add other</button>
            </div>
        </div>
    )
}


export default EditQuestion;

