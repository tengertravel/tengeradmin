import React, { useState } from 'react';
const VacationContext = React.createContext();
const initialState = {
    mcode: null,
    consultantid:null,
}
export const VacationStore = (props) =>{
    const [vacationState, setVacationState] = useState(initialState);
    const consultantCall = (mcode,consultantid) =>{
        setVacationState({mcode,consultantid});
    }
    return(
        <VacationContext.Provider value={{ vacationState, consultantCall }}>
            {props.children}
        </VacationContext.Provider>
    );
}

export default VacationContext;