'use client'

import { useState, useEffect } from 'react'
import clsx from 'clsx'

const opcoes = [
  { nome: 'pedra', emoji: '🪨' },
  { nome: 'papel', emoji: '📄' },
  { nome: 'tesoura', emoji: '✂️' },
]

export default function Jokenpo() {
  const [jogador, setJogador] = useState('')
  const [computador, setComputador] = useState('')
  const [resultado, setResultado] = useState('')
  const [jogando, setJogando] = useState(false)
  const [animar, setAnimar] = useState('')
  const [dark, setDark] = useState(false)
  const [jogoIniciado, setJogoIniciado] = useState(false)

  const [placar, setPlacar] = useState({
    vitorias: 0,
    derrotas: 0,
    empates: 0,
  })

  useEffect(() => {
    const salvo = localStorage.getItem('placar')
    if (salvo) setPlacar(JSON.parse(salvo))
  }, [])

  useEffect(() => {
    localStorage.setItem('placar', JSON.stringify(placar))
  }, [placar])

  function jogar(escolha: string) {
    setJogando(true)
    setResultado('')
    setAnimar('')
    setJogador(escolha)
    setComputador('')

    const escolhaPC = opcoes[Math.floor(Math.random() * 3)].nome

    setTimeout(() => {
      setComputador(escolhaPC)
      definirResultado(escolha, escolhaPC)
      setJogando(false)
    }, 1000)
  }

  function definirResultado(j: string, c: string) {
    if (j === c) {
      setResultado('Empate!')
      setAnimar('empate')
      setPlacar((p) => ({ ...p, empates: p.empates + 1 }))
    } else if (
      (j === 'pedra' && c === 'tesoura') ||
      (j === 'papel' && c === 'pedra') ||
      (j === 'tesoura' && c === 'papel')
    ) {
      setResultado('Você venceu!')
      setAnimar('vitoria')
      setPlacar((p) => ({ ...p, vitorias: p.vitorias + 1 }))
    } else {
      setResultado('Você perdeu!')
      setAnimar('derrota')
      setPlacar((p) => ({ ...p, derrotas: p.derrotas + 1 }))
    }
  }

  function resetarPlacar() {
    setPlacar({ vitorias: 0, derrotas: 0, empates: 0 })
  }

  function novaRodada() {
    setJogador('')
    setComputador('')
    setResultado('')
    setAnimar('')
  }

  return (
    <main className={clsx("min-h-screen p-6 flex flex-col items-center justify-center transition-colors duration-300", dark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900')}>
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Jokenpô</h1>
          <meta name="description" content="Jogo de pedra, papel e tesoura" />
          <link rel="icon" href="favicon.png" type="image/png" />
          <button
            onClick={() => setDark(!dark)}
            className={clsx(
              'px-3 py-1 text-sm rounded font-medium transition duration-300 shadow',
              dark
                ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            )}
          >
            {dark ? '☀️ Claro' : '🌙 Escuro'}
          </button>
        </div>

        {!jogoIniciado ? (
          <div className="p-4 rounded shadow text-sm text-center space-y-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium leading-relaxed">
            <p className="font-semibold text-lg">Regras do Jokenpô:</p>
            <ul className="list-disc list-inside text-left space-y-1">
              <li>🪨 PEDRA GANHA DA TESOURA</li>
              <li>📄 PAPEL GANHA DA PEDRA</li>
              <li>✂️ TESOURA GANHA DO PAPEL</li>
            </ul>
            <p className="text-left">Cada jogador mostra, ao mesmo tempo, a opção escolhida com a mão.</p>
            <p className="text-left">Se empatar — ou seja, quando os dois mostram o mesmo objeto — ninguém leva ponto.</p>
            <button
              onClick={() => setJogoIniciado(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Jogar
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-4 justify-center">
              {opcoes.map((op) => (
                <button
                  key={op.nome}
                  onClick={() => jogar(op.nome)}
                  className="text-5xl p-3 bg-white dark:bg-gray-800 rounded-xl shadow hover:scale-110 transition-all duration-200"
                >
                  {op.emoji}
                </button>
              ))}
            </div>

            {jogando && <p className="text-lg font-medium animate-pulse">Jogando...</p>}

            {!jogando && jogador && computador && (
              <div className={clsx(
                'p-4 rounded-lg transition-all text-center',
                animar === 'vitoria' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                animar === 'derrota' && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                animar === 'empate' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              )}>
                <p className="text-2xl">
                  Você: <strong>{emoji(jogador)}</strong>
                </p>
                <p className="text-2xl">
                  Computador: <strong>{emoji(computador)}</strong>
                </p>
                <p className="mt-2 text-xl font-bold">{resultado}</p>

                <button
                  onClick={novaRodada}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Jogar Novamente
                </button>
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Placar</h2>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-1 text-lg text-gray-900 dark:text-gray-100">
                <p>✅ Vitórias: {placar.vitorias}</p>
                <p>❌ Derrotas: {placar.derrotas}</p>
                <p>🤝 Empates: {placar.empates}</p>
                <button
                  onClick={resetarPlacar}
                  className="mt-3 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                >
                  Resetar Placar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

function emoji(nome: string) {
  const op = opcoes.find((o) => o.nome === nome)
  return op?.emoji || '❓'
}
