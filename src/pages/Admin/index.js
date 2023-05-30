import { useState, useEffect } from 'react'
import './admin.css'

import { auth, db } from '../../firebaseConnection'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore'

export default function Admin() {
  const [tarefaInput, setTarefaInput] = useState('')
  const [user, setUser] = useState({})
  const [edit, setEdit] = useState({})
  const navigate = useNavigate();

  const [value, onChange] = useState(new Date());

  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    async function loadTarefas() {
      const userDetail = localStorage.getItem("@detailUser")
      setUser(JSON.parse(userDetail))

      if (userDetail) {
        const data = JSON.parse(userDetail);

        const tarefaRef = collection(db, "tarefas")
        const q = query(tarefaRef, where("userUid", "==", data?.uid))

        const unsub = onSnapshot(q, (snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              tarefa: doc.data().tarefa,
              userUid: doc.data().userUid,
            })
          })

          setTarefas(lista);


        })

      }

    }

    loadTarefas();
  }, [])


  async function handleRegister(e) {
    e.preventDefault();

    if (tarefaInput === '') {
      alert("Digite sua tarefa...")
      return;
    }

    if (edit?.id) {
      handleUpdateTarefa();
      return;
    }


    await addDoc(collection(db, "tarefas"), {
      tarefa: tarefaInput,
      created: new Date(),
      userUid: user?.uid
    })
      .then(() => {
        console.log("TAREFA REGISTRADA")
        setTarefaInput('')
      })
      .catch((error) => {
        console.log("ERRO AO REGISTRAR " + error)
      })


  }

  async function handleLogout() {
    await signOut(auth);
  }
  async function handleGame() {
    navigate('/game', { replace: true })
  }


  async function deleteTarefa(id) {
    const docRef = doc(db, "tarefas", id)
    await deleteDoc(docRef)
  }

  function editTarefa(item) {
    setTarefaInput(item.tarefa)
    setEdit(item);
  }


  async function handleUpdateTarefa() {
    const docRef = doc(db, "tarefas", edit?.id)
    await updateDoc(docRef, {
      tarefa: tarefaInput
    })
      .then(() => {
        console.log("TAREFA ATUALIZADA")
        setTarefaInput('')
        setEdit({})
      })
      .catch(() => {
        console.log("ERRO AO ATUALIZAR")
        setTarefaInput('')
        setEdit({})
      })
  }

  return (
    <div className='container-fluid'>
      <div className='title text-center'>
        <h1>Minhas tarefas</h1>
      </div>
      <div className='row'>
        <div className='col-12 col-md-4 d-flex d-md-block justify-content-center'>
          <Calendar id='calendar' className='calendario' onChange={onChange} value={value} />
        </div>

        <div className='col-12 col-md-8'>

          <form className="form" onSubmit={handleRegister}>
            <textarea
              id='task-description'
              className='form-control'
              placeholder="Digite sua tarefa..."
              value={tarefaInput}
              onChange={(e) => setTarefaInput(e.target.value)}
            />

            {Object.keys(edit).length > 0 ? (
              <button id='btn-update' className="btn btn-primary" type="submit">Atualizar tarefa</button>
            ) : (
              <button id='btn-register-task' className="btn btn-primary" type="submit">Registrar tarefa</button>
            )}
          </form>

          {tarefas.map((item) => (
            <article key={item.id} className="list">
              <p id='item-tarefa'>{item.tarefa}</p>

              <div>
                <button id='btn-edit' className='btn btn-outline-primary' onClick={() => editTarefa(item)}>Editar</button>
                <button id='btn-conclude' className="btn btn-outline-warning" onClick={() => deleteTarefa(item.id)} >Concluir</button>
              </div>
            </article>
          ))}

          <button id='btn-play' className="btn-game" onClick={handleGame}>Jogar</button>
          <button id='btn-logout' className="btn-logout" onClick={handleLogout}>Sair</button>
        </div>

      </div>
    </div>
  )
}