import { useState } from 'react'
import './game.css'
import { Link } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import ReactDOM from "react-dom/client";

import { auth, db } from '../../firebaseConnection'
import { signOut } from 'firebase/auth'

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

export default function Game() {
  const jogoInicial = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']]

  const [jogo, setJogo] = useState(jogoInicial)
  const [simboloAtual, setSimboloAtual] = useState('X')
  const [jogando, setJogando] = useState(true)
  const [partidas, setPartidas] = useState(1)
  const [user, setUser] = useState({})

  const tabuleiro = (j) => {
    return (
      <div className='container'>
        <div className='tabu'>
          <div className='tabuLinha'>
            <div className='casa' data-pos='00' onClick={(e) => jogar(e)}>{j[0][0]}</div>
            <div className='casa' data-pos='01' onClick={(e) => jogar(e)}>{j[0][1]}</div>
            <div className='casa' data-pos='02' onClick={(e) => jogar(e)}>{j[0][2]}</div>
          </div>
          <div className='tabuLinha'>
            <div className='casa' data-pos='10' onClick={(e) => jogar(e)}>{j[1][0]}</div>
            <div className='casa' data-pos='11' onClick={(e) => jogar(e)}>{j[1][1]}</div>
            <div className='casa' data-pos='12' onClick={(e) => jogar(e)}>{j[1][2]}</div>
          </div>
          <div className='tabuLinha'>
            <div className='casa' data-pos='20' onClick={(e) => jogar(e)}>{j[2][0]}</div>
            <div className='casa' data-pos='21' onClick={(e) => jogar(e)}>{j[2][1]}</div>
            <div className='casa' data-pos='22' onClick={(e) => jogar(e)}>{j[2][2]}</div>
          </div>
        </div>
      </div>

    )
  }

  const BtnJogarNovamente = () => {
    if (!jogando) {
      return <button className='btn-jogar-nov' onClick={() => reiniciar()}>Jogar Novamente</button>
    }
  }

  const verificaVitoria = () => {
    //Percorrendo linhas, colunas e diagonais para verificar a vitoria;
    //linhas
    let pontos = 0
    let vitoria = false
    let todasPreenchidas = true
    for (let l = 0; l < 3; l++) {
      pontos = 0;
      for (let c = 0; c < 3; c++) {
        if (jogo[l][c] == simboloAtual) {
          pontos++;
        }
      }
      if (pontos >= 3) {
        vitoria = true;

        break;

      }
    }

    //colunas
    for (let c = 0; c < 3; c++) {
      pontos = 0;
      for (let l = 0; l < 3; l++) {
        if (jogo[l][c] == simboloAtual) {
          pontos++;
        }

      }
      if (pontos >= 3) {
        vitoria = true;
        break;

      }
    }

    //Diagonais
    pontos = 0;
    for (let d = 0; d < 3; d++) {
      if (jogo[d][d] == simboloAtual) {
        pontos++;
      }


    }
    if (pontos >= 3) {
      vitoria = true;

    }

    pontos = 0;
    let l = 0;
    for (let c = 2; c >= 0; c--) {
      if (jogo[l][c] == simboloAtual) {
        pontos++;
      }
      l++
    }
    if (pontos >= 3) {
      vitoria = true;

    }

    for (let l = 0; l < 3; l++) {
      for (let c = 0; c < 3; c++) {
        if (jogo[l][c] === '') {
          todasPreenchidas = false;
          break;
        }
      }
      if (!todasPreenchidas) {
        break;
      }
    }
    // se todas as casas estiverem preenchidas, o jogo termina empatado
    if (todasPreenchidas && !vitoria) {
      setJogando(false);
      alert('O jogo deu velha');
    }
  
    return vitoria;

  }

  const trocaJogador = () => {

    simboloAtual == 'X' ? setSimboloAtual('O') : setSimboloAtual('X')

  }

  const retPos = (e) => {
    const p = e.target.getAttribute('data-pos')
    const pos = [parseInt(p.substring(0, 1)), parseInt(p.substring(1, 2))]
    return pos
  }

  const verificaEspacoVazio = (e) => {
    if (jogo[retPos(e)[0]][retPos(e)[1]] == '') {
      return true;
    } else {
      return false;
    }
  }

  const jogar = (e) => {
    if (jogando) {
      if (verificaEspacoVazio(e)) {
        jogo[retPos(e)[0]][retPos(e)[1]] = simboloAtual
        trocaJogador()
        if (verificaVitoria()) {
          trocaJogador()
          alert('Jogador ' + simboloAtual + ' venceu!')
          console.log("partidas jogadas: " + partidas)
          setJogando(false)
        }
      } else {
        alert('Este espaço não está disponivel, escolha outro')
      }
    }
  }

  const reiniciar = () => {
    setJogando(true)
    setJogo(jogoInicial)
    setSimboloAtual('X')
    setPartidas((c) => c + 1);

  }


  return (
    <>
      <div className='container'>
        <h1>Vez de: {simboloAtual}</h1>
      </div>
      <div>
        {tabuleiro(jogo)}
      </div>
      <div>
        {BtnJogarNovamente()}
      </div>
      <div>
        <Link to="/admin">
          <button className="btn-voltar">
            Voltar
          </button>
        </Link>
      </div>
    </>

  );



}
