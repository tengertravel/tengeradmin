import React,{ useRef } from 'react'
import PropTypes from 'prop-types'

function DraggableListItem(props) {
    const itemRef = useRef(null)
    const onDragStart = (e) =>{
        e.dataTransfer.effectedAllowed = 'move'
        let ghostNode = e.target.cloneNode(true)
        ghostNode.style.position = "absolute"
        ghostNode.style.top = (e.pageY - e.target.offsetHeight /2) + 'px'
        ghostNode.style.left = (e.pageX - e.target.offsetWidth /2) + 'px'
        ghostNode.style.height = e.target.offsetHeight + 'px'
        ghostNode.style.width = e.target.offsetWidth + 'px'
        ghostNode.style.opacity = '0.8'
        ghostNode.style.pointerEvents = 'none'
        ghostNode.id = 'ghostNode'
        document.body.prepend(ghostNode)
        itemRef.current.classList.add('dragstart')
        if(props.onDragStart){props.onDragStart(props.index)}
    }
    const onDrag = (e) =>{
        let ghostNode = document.querySelector('#ghostNode')
        ghostNode.style.top = (e.pageY - e.target.offsetHeight /2) + 'px'
        ghostNode.style.left = (e.pageX - e.target.offsetWidth /2) + 'px'
    }
    const onDragEnd = () =>{
        document.querySelector('#ghostNode').remove()
        itemRef.current.classList.remove('dragstart')
    }
    const onDragEnter = () => itemRef.current.classList.add('dragover')
    const onDragLeave = () => itemRef.current.classList.remove('dragover')
    const onDragOver = (e) => e.preventDefault()
    const onDrop = () => {
        itemRef.current.classList.remove('dragover')
        props.onDrop(props.index)
    }
    const delelele = () =>{
        props.deleteListItem(props.index)
    }
  return (
    <>
    <li
        ref={itemRef} 
        className='draggable-list_item' 
        draggable={props.draggable !== undefined ? props.draggable : true} 
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop} 
    >
        {props.children}
    </li>
    {props.draggale ? <li><button className='btn btn-danger btn-xs' style={{padding:"0px 5px"}} onClick={delelele}>X</button></li>:null}
    </>
  )
}

DraggableListItem.propTypes = {
    draggable: PropTypes.bool,
    index: PropTypes.number,
    onDragStart: PropTypes.func,
    onDrop:PropTypes.func
}

export default DraggableListItem
