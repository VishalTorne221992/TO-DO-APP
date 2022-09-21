import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react'
import { Container, Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import { v4 as uuidv4 } from 'uuid';

const TitleStatus = {

  TODO: 'TODO',
  DOING: 'DOING',
  DONE: 'DONE'
}

function reducer(state, actions) {

  switch (actions.type) {

    case 'addTODO': {

      return {
        ...state,
        
        Tasklist: state.Tasklist.map(tasklist => {


          if (tasklist.Title === actions.payload.value) {
            return {
              ...tasklist,
              Tasks: [...tasklist.Tasks, { id: uuidv4(), Title: actions.payload.Title, Desc: actions.payload.Desc, Tag: actions.payload.Tag }]
            }
          }

          return tasklist

        })

      }

      
    }

    case 'addDOING': {

      return {
        ...state,
        
        Tasklist: state.Tasklist.map(tasklist => {

          if (tasklist.Title === actions.payload.value) {
            return {
              ...tasklist,
              Tasks: [...tasklist.Tasks, { id: uuidv4(), Title: actions.payload.Title, Desc: actions.payload.Desc, Tag: actions.payload.Tag }]
            }
          }

          return tasklist

        })

      }

    }

    case 'foundINOthers': {


      return {
        ...state,
        
        Tasklist: state.Tasklist.flatMap(Tasklist => {
          console.log(Tasklist.Title,'current title')

        if(Tasklist.Title !== actions.payload.Title){

          console.log('got it', Tasklist.Tasks )

          return {...Tasklist, Tasks: Tasklist.Tasks.filter( tasks => tasks !== actions.payload.itemfromOthers)}

        }

        console.log('did not match')
        return Tasklist
      })

      }

    }

    default: {
      return state
    }


  }

}

const initialState = {

  Tasklist: [

    {
      id: uuidv4(),
      Title: TitleStatus.TODO,
      Tasks: []
    },

    {
      id: uuidv4(),
      Title: TitleStatus.DOING,
      Tasks: []
    },

    {
      id: uuidv4(),
      Title: TitleStatus.DONE,
      Tasks: []
    }


  ]


}
export default function Todoapp() {

  const [state, dispatch] = useReducer(reducer, initialState)
  //const {Tasklist} = state
  const [status, setstatus] = useState('')
  const [TaskDesc, setTaskDesc] = useState('')
  const [TaskTag, setTaskTag] = useState('')
  const [selected, setselected] = useState(false)
  const [Defaultselected, setDefaultselected] = useState(false)

  const currentChecked = useRef('');


  const handleCheckChange = async (e) => {


    const getchk1 = document.querySelector('#formCheck')

    const getRadio = document.querySelectorAll('input[name="group-tasks-status"]')

    console.log('done value', getchk1.value, state)

    if (getchk1.checked) {

      dispatch({

        type: 'addTODO',
        payload: { value: getchk1.value, Title: status, Desc: TaskDesc, Tag: TaskTag }

      })

      const founditem = await state.Tasklist.flatMap(e => {
        if(e.Title !== getchk1.value){
          return e.Tasks
        }
        return e
      }
        ).find(t => t.Title === status)
  
        console.log(founditem, 'found in others and DONE')
  
        if(founditem && founditem !== undefined){
  
          dispatch({type:'foundINOthers', payload : { itemfromOthers : founditem, Title : getchk1.value }})
        }

    }else{  

      dispatch({

        type: 'addTODO',
        payload: { value: currentChecked.current, Title: status, Desc: TaskDesc, Tag: TaskTag }

      })

      const founditem = await state.Tasklist.flatMap(e => {
        if(e.Title !== currentChecked.current){
          return e.Tasks
        }
        return e
      }
        ).find(t => t.Title === status)
  
        console.log(founditem, 'found in others and DONE')
  
        if(founditem && founditem !== undefined){
  
          dispatch({type:'foundINOthers', payload : { itemfromOthers : founditem, Title : currentChecked.current }})
        }
        
        

    }

    for (let index = 0; index < getRadio.length; index++) {

      if (getchk1.checked) {

        const element = getRadio[index]
        element.toggleAttribute('disabled', true)
        element.toggleAttribute('checked', false)


      } else {
        const element = getRadio[index]
        element.toggleAttribute('disabled', false)
        element.toggleAttribute('checked', true)
      }

    }


  }

  const handleRadioChangeTODO = async (e) => {
   

    
    // Add TODO Task


    const getRadio = document.querySelectorAll('input[name="group-tasks-status"]')[0]

    console.log(getRadio.checked, 'The TODO first radio element if checked')
    console.log(getRadio.value, 'The TODO first radio element value')
    console.log('title', status)
   
    

    if (getRadio.checked) {

      dispatch({

        type: 'addTODO',
        payload: { value: getRadio.value, Title: status, Desc: TaskDesc, Tag: TaskTag }

      })

      const founditem = await state.Tasklist.flatMap(e => {
        if(e.Title !== getRadio.value){
          return e.Tasks
        }
        return e
      }
        ).find(t => t.Title === status)
  
        console.log(founditem, 'found in others and TODO')
  
        if(founditem && founditem !== undefined){
  
          dispatch({type:'foundINOthers', payload : { itemfromOthers : founditem, Title : getRadio.value }})
        }

        currentChecked.current = getRadio.value

    }


  }

  

  const handleRadioChangeDOING = async (e) => {

  
    const getRadio = document.querySelectorAll('input[name="group-tasks-status"]')[1]

    console.log(getRadio.value, 'The TODO second radio element')


    if (getRadio.checked) {

      dispatch({

        type: 'addDOING',
        payload: { value: getRadio.value, Title: status, Desc: TaskDesc, Tag: TaskTag }

      })

      const founditem = await state.Tasklist.flatMap(e => {
        if(e.Title !== getRadio.value){
          return e.Tasks
        }
        return e
      }
        ).find(t => t.Title === status)
  
        console.log("found in others and doing", founditem)
  
  
        if(founditem && founditem !== undefined){
  
          dispatch({type:'foundINOthers', payload : { itemfromOthers : founditem, Title : getRadio.value }})
        }

        currentChecked.current = getRadio.value


    }


  }

  const handleTextChange = (e) => {

    const getRadioFirst = document.querySelectorAll('input[name="group-tasks-status"]')[0]

    getRadioFirst.checked = true;

    const getRadio = document.querySelectorAll('input[name="group-tasks-status"]')


    for (let index = 0; index < getRadio.length; index++) {

      const element = getRadio[index]
      element.toggleAttribute('disabled', false)

    }



  }

  const handleButtonClick = (e) => {

    const getRadio = document.querySelectorAll('input[name="group-tasks-status"]')[0]

    getRadio.checked = true;
  
    const data = state.Tasklist.filter(tasklist => tasklist.Title === 'DONE').flatMap(t => t.Tasks)

    console.log(data, 'done data')

    const titleInputBtn = document.querySelector('#Tasktitle')

    const DescInputBtn = document.querySelector('#TaskDescription')

    const tagInputBtn = document.querySelector('#TaskTag')
    
    const res = data.find(r => r.Title === titleInputBtn.value)

    console.log(res, 'found data')

    DescInputBtn.value = res.Desc;

    tagInputBtn.value = res.Tag;


  }


useEffect(() => {
  
  const getchktxt = document.querySelector('#formCheck')

  const titleInput = document.querySelector('#Tasktitle')

  titleInput.addEventListener('focus', () => {

    setselected(p => !p)

  })

  titleInput.addEventListener('focusout', () => {

    setselected(p => !p)

    const getRadio = document.querySelectorAll('input[name="group-tasks-status"]')


    for (let index = 0; index < getRadio.length; index++) {

      const element = getRadio[index]
      element.toggleAttribute('disabled', false)

    }

  })

}, [selected])


    

    


  useEffect(() => {

    console.log('Current State', state)
    
    console.log('current checked', currentChecked.current)


  }, [state, currentChecked])



  return (
    <Container>

      <Form>

        <Form.Group className="mb-3 mt-3" controlId='Tasktitle'>

          <Form.Label>Task Title </Form.Label>

          <Form.Control type="text" onChange={(e) => {setstatus(e.target.value); handleTextChange(e)}} placeholder=" Enter Task name :" style={{ display: 'block' }} />
          <Form.Text className="text-muted">
            Please enter task Title
          </Form.Text>

        </Form.Group>

        <Button variant="primary" onClick={(e) => handleButtonClick(e)} className='mb-3'>
          Get Task
        </Button>

        <Form.Group className="mb-3" controlId='TaskDescription'>

          <Form.Label>Enter Task Description : </Form.Label>
          <Form.Control type="text" onChange={(e) => setTaskDesc(e.target.value)} placeholder=" Enter Description :" style={{ display: 'block' }} />

        </Form.Group>

        <Form.Group className="mb-3" controlId='TaskTag'>

          <Form.Label>Enter tag : </Form.Label>
          <Form.Control type="text" onChange={(e) => setTaskTag(e.target.value)} placeholder=" Enter tag :" style={{ display: 'block' }} />

        </Form.Group>

        <Form.Check type='radio' id='TODORadio' value={'TODO'} onChange={(e) => handleRadioChangeTODO(e)} className='FormRadio' name='group-tasks-status' label='TO - DO' style={{ fontWeight: 'bolder' }}></Form.Check>
        <Form.Check type='radio' id='DOINGRadio' value={'DOING'} onChange={(e) => handleRadioChangeDOING(e)} className='FormRadio' name='group-tasks-status' label='DOING' style={{ textIndent: '1px', fontWeight: 'bolder' }}></Form.Check>
        <Form.Check type='switch' label='DONE' value={'DONE'} onClick={(e) => setselected(prev => !prev )} onChange={(e) => handleCheckChange(e)} className='mt-4' id='formCheck' style={{ fontWeight: 'bolder' }} checked={selected} ></Form.Check>

        


      </Form>


    </Container>
  )
}
