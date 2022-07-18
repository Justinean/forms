import React, { createContext, useState } from 'react'
import CustomButton from './CustomMCButton'
import "./Question.css"

interface props {
    // choices: number,
    question:
    {
        name: string,
        number: number,
        hasOther: boolean,
        choices:
        {
            name: string
        }[]
    }
}

const SelectedContext = createContext<{selected: number, setSelected: React.Dispatch<React.SetStateAction<number>>} | null>(null);

const Question = ({ question }: props) => {
    const [selected, setSelected] = useState(-1)
    const [otherValue, setOtherValue] = useState("")
    return (
        <div className="Question">
            <h3 className="questionName">{question.name}</h3>
            <SelectedContext.Provider value={{selected, setSelected}}>
                {question.choices.map((i, index) => <div className="questionContainer"><CustomButton SelectedContext={SelectedContext} number={index}></CustomButton><p className="choiceName">{i.name}</p></div>)}
                {question.hasOther ? <div className="questionContainer"><CustomButton SelectedContext={SelectedContext} number={question.choices.length}></CustomButton><input className="choiceName" placeholder='Other...' value={otherValue} onChange={e => setOtherValue(e.target.value)}></input></div> : <></>}
            </SelectedContext.Provider>
        </div>
    )
}

export default Question;