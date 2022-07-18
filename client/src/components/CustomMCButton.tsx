import React, { useContext } from 'react';
import "./CustomMCButton.css";

interface props {
    SelectedContext: React.Context<{
        selected: number,
        setSelected: React.Dispatch<React.SetStateAction<number>>
    } | null>,
    number: number
}

const CustomButton = ({ SelectedContext, number }: props) => {
    const {selected, setSelected} = useContext<any>(SelectedContext);
    
    return (
        <div className='CustomButton' onClick={() => selected === number ? setSelected(-1) : setSelected(number)}>
            <div className="outsideCircle">
                <div className="insideCircle" style={selected === number ? {} : {display: 'none'}}></div>
            </div>
        </div>
    )
}

export default CustomButton