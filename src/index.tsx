import { ReactNode } from 'react'
import React, {
  createApplication,
  useContext,
  useEffect,
  useState,
} from './react'
import { createContext } from './react/context/createContext'
import { TodoList } from './components/TodoList'

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
  return (
    <StoreContext.Provider value={props.value}>
      {props.children}
    </StoreContext.Provider>
  )
}

const TextInput = (props: { fieldName: 'first' | 'last' }) => {
  const { fieldName } = props
  const [value, setValue] = useContext(StoreContext)!
  return (
    <div className='field'>
      {fieldName}:{' '}
      <input
        value={value[fieldName]}
        onChange={(e) => setValue({ ...value, [fieldName]: e.target.value })}
      />
    </div>
  )
}

const Display = ({ value }: { value: 'first' | 'last' }) => {
  const [store, setStore] = useContext(StoreContext)!
  useEffect(() => {
    setStore({ last: store[value], first: 'something' })
  }, [store[value]])
  return (
    <div className='value'>
      {value}: {store[value]}
    </div>
  )
}

const FormContainer = () => {
  return (
    <div className='container'>
      <h5>FormContainer</h5>
      <TextInput fieldName='first' />
      <TextInput fieldName='last' />
    </div>
  )
}

const DisplayContainer = () => {
  return (
    <div className='container'>
      <h5>DisplayContainer</h5>
      <Display value='first' />
      <Display value='last' />
    </div>
  )
}

const ContentContainer = () => {
  return (
    <div className='container'>
      <h5>ContentContainer</h5>
      <FormContainer />
      <DisplayContainer />
    </div>
  )
}

export function App() {
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
      <TodoList />
    </Prov>
  )
}

createApplication(document.getElementById('root')!, App)
