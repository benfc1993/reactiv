import { ReactNode } from 'react'
import React, { createApplication, useContext, useState } from './react'
import { createContext } from './react/context/createContext'

function useStoreData() {
  const store = useState({
    first: '',
    last: '',
  })
  return store
}

type UseStoreDataReturnType = ReturnType<typeof useStoreData>

const StoreContext = createContext<UseStoreDataReturnType | null>([
  { first: '', last: '' },
  () => null,
])
const Prov = (props: { value: any; children: ReactNode }) => {
  console.log('Prov')
  return (
    <StoreContext.Provider value={props.value}>
      {props.children}
    </StoreContext.Provider>
  )
}

const TextInput = ({ value }: { value: 'first' | 'last' }) => {
  console.log('TextInput')
  const test = useContext(StoreContext)!
  return (
    <div className='field'>
      {value}:{' '}
      <input
        value={test[0][value]}
        onChange={(e) => test[1]({ ...test[0], [value]: e.target.value })}
      />
    </div>
  )
}

const Display = ({ value }: { value: 'first' | 'last' }) => {
  console.log('Display')
  const [store] = useContext(StoreContext)!
  return (
    <div className='value'>
      {value}: {store[value]}
    </div>
  )
}

const FormContainer = () => {
  console.log('FormContainer')
  return (
    <div className='container'>
      <h5>FormContainer</h5>
      <TextInput value='first' />
      <TextInput value='last' />
    </div>
  )
}

const DisplayContainer = () => {
  console.log('DisplayContainer')
  return (
    <div className='container'>
      <h5>DisplayContainer</h5>
      <Display value='first' />
      <Display value='last' />
    </div>
  )
}

const ContentContainer = () => {
  console.log('ContentContainer')
  return (
    <div className='container'>
      <h5>ContentContainer</h5>
      <FormContainer />
      <DisplayContainer />
    </div>
  )
}

export function App() {
  console.log('App')
  const store = useState({
    first: '',
    last: '',
  })

  return (
    <Prov value={store}>
      <div className='container'>
        <h5>App</h5>
        <ContentContainer />
      </div>
    </Prov>
  )
}

createApplication(document.getElementById('root')!, App)
