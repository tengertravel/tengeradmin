import React,{ useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import './draggable-list.css'
import DraggableListItem from './DraggableListItem'
function DraggableList(props) {
    const [data, setData] = useState(props.data);
    const [dragStartIndex, setDragStartIndex] = useState(null)
    const onDragStart = (index) => setDragStartIndex(index)
    const onDrop = (dropIndex) =>{
        //console.log(dropIndex)
        const dragItem = data[dragStartIndex]
        let list = [...data]
        list.splice(dragStartIndex,1)
        let newnewData = [];
        if(dragStartIndex < dropIndex){
            newnewData = [...list.slice(0,dropIndex -1 ),dragItem,...list.splice(dropIndex -1, list.length)]
        }else{ 
            newnewData = [...list.slice(0,dropIndex),dragItem,...list.splice(dropIndex, list.length)]
        }
        setData(newnewData);
        priceIncludSave(newnewData);
        vProvideSave(newnewData)
    }

    const priceIncludSave = (newData) =>{
        if(props.priceIncluded&&props.vacationState&&props.priceIncludedCate){
            if(props.priceIncludedCate === 1){
                props.priceIncluded({...props.vacationState, priceIncluded:[newData,props.vacationState.priceIncluded[1]]})
            }else if(props.priceIncludedCate === 2){
                props.priceIncluded({...props.vacationState, priceIncluded:[props.vacationState.priceIncluded[0],newData]})
            }
        }
    }

    const vProvideSave = (newData) =>{
        if(props.provideSave&&props.provideCate){
            if(props.provideCate === 1){
                props.provideSave(newData)
            }
        }
    }

    const deleteListItem = (idx) => {
        let newData = [];
        data.map((item, index) =>index === idx ?null: newData.push(item) )
        setData(newData);
        priceIncludSave(newData);
        vProvideSave(newData)
    }
    useEffect(()=>{
        setData(props.data);
    },[props.data])
  return (
    <ul style={{display:'grid', gridTemplateColumns: "95% 5%"}}>
        { data &&
            data.map((item, index) =>(
                <DraggableListItem 
                    key={index} 
                    index={index} 
                    onDragStart={(index) => onDragStart(index)}
                    onDrop={(index)=>onDrop(index)}
                    draggale={true}
                    deleteListItem={(index)=>deleteListItem(index)}
                >{item}</DraggableListItem>
            ))
        }
        {
            data && <DraggableListItem key={data.length} index={data.length} onDrop={(index)=>onDrop(index)} draggale={false}/>
        }
    </ul>
  )
}

DraggableList.propTypes = {
    data: PropTypes.array
}

export default DraggableList
