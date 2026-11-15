
  "use client";

  import { useState } from "react";
  import Image from "next/image";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";

  type Player = "X" | "O";
  type Square = Player | null;
  type Winner = Player | "Draw" | null;

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const playerDetails = {
    X: {
      name: "Rabbit",
      image: "/images/rabbit120.gif",
      color: "text-blue-400",
    },
    O: {
      name: "Fox",
      image: "/images/foxxy120.gif",
      color: "text-pink-400",
    },
  };

  export default function Home() {
    const [board, setBoard] = useState<Square[]>(
      Array(9).fill(null)
    );

    const [currentPlayer, setCurrentPlayer] =
      useState<Player>("X");

    const [winner, setWinner] = useState<Winner>(null);

    const [scores, setScores] = useState({
      X: 0,
      O: 0,
      Draw: 0,
    });

    const [winningLine, setWinningLine] = useState<number[]>([]);

    function handleClick(index: number) {
      if (board[index] !== null || winner !== null) return;

      const newBoard = [...board];
      newBoard[index] = currentPlayer;

      setBoard(newBoard);

      const combination = winningCombinations.find(
        ([a, b, c]) =>
          newBoard[a] !== null &&
          newBoard[a] === newBoard[b] &&
          newBoard[a] === newBoard[c]
      );

      if (combination) {
        setWinner(currentPlayer);
        setWinningLine(combination);

        setScores((previous) => ({
          ...previous,
          [currentPlayer]: previous[currentPlayer] + 1,
        }));

        return;
      }

      if (newBoard.every((square) => square !== null)) {
        setWinner("Draw");

        setScores((previous) => ({
          ...previous,
          Draw: previous.Draw + 1,
        }));

        return;
      }

      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }

    function resetGame() {
      setBoard(Array(9).fill(null));
      setCurrentPlayer("X");
      setWinner(null);
      setWinningLine([]);
    }

    function resetScores() {
      resetGame();

      setScores({
        X: 0,
        O: 0,
        Draw: 0,
      });
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">

        <Card className="w-full max-w-md border-slate-800 bg-slate-900 text-white shadow-2xl">

          <CardHeader className="space-y-2 text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
              Classic Game
            </p>

            <CardTitle className="text-4xl font-extrabold tracking-wider">
              Junix Tic-Tac-Toe
            </CardTitle>

            <CardDescription className="text-slate-400">
              Challenge a friend. Get three in a row!
            </CardDescription>

          </CardHeader>

          <CardContent className="space-y-6">

            {/* Scoreboard */}
            <div className="grid grid-cols-3 gap-3">

              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-center">
                <p className="text-sm font-semibold text-blue-400">
                  Rabbit
                </p>
                <p className="mt-1 text-3xl font-bold">
                  {scores.X}
                </p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-center">
                <p className="text-sm font-semibold text-slate-300">
                  Draws
                </p>
                <p className="mt-1 text-3xl font-bold">
                  {scores.Draw}
                </p>
              </div>

              <div className="rounded-xl border border-pink-500/30 bg-pink-500/10 p-3 text-center">
                <p className="text-sm font-semibold text-pink-400">
                  Fox
                </p>
                <p className="mt-1 text-3xl font-bold">
                  {scores.O}
                </p>
              </div>

            </div>

            {/* Game Status */}
            <div className="rounded-xl bg-slate-800 p-4 text-center">

              {winner === "X" || winner === "O" ? (
                <p className="text-lg font-bold text-green-400">
                  {playerDetails[winner].name} wins!
                </p>
              ) : winner === "Draw" ? (
                <p className="text-lg font-bold text-yellow-400">
                  It's a draw!
                </p>
              ) : (
                <p className="text-lg font-medium text-slate-300">
                  Current Turn:{" "}
                  <span className={`font-bold ${playerDetails[currentPlayer].color}`}>
                    {playerDetails[currentPlayer].name}
                  </span>
                </p>
              )}

            </div>

            {/* Game Board */}
            <div className="grid grid-cols-3 gap-3">

              {board.map((square, index) => (

                <button
                  key={index}
                  type="button"
                  onClick={() => handleClick(index)}
                  disabled={square !== null || winner !== null}
                  aria-label={`Square ${index + 1}: ${
                    square ? playerDetails[square].name : "empty"
                  }`}
                  className={`
                    flex aspect-square items-center justify-center
                    rounded-xl border-2
                    transition-all duration-200
                    ${
                      winningLine.includes(index)
                        ? "border-green-400 bg-green-500/20"
                        : "border-slate-700 bg-slate-800"
                    }
                    ${
                      square === null && winner === null
                        ? "hover:border-blue-400 hover:bg-slate-700"
                        : ""
                    }
                    disabled:cursor-not-allowed
                  `}
                >

                  {square && (
                    <Image
                      src={playerDetails[square].image}
                      alt={playerDetails[square].name}
                      width={120}
                      height={120}
                      unoptimized
                      className="h-[85%] w-[85%] max-h-[120px] max-w-[120px] object-contain"
                    />
                  )}

                </button>

              ))}

            </div>

            {/* Game Controls */}
            <div className="space-y-3">

              <Button
                onClick={resetGame}
                className="w-full bg-blue-600 py-5 text-base font-semibold text-white hover:bg-blue-700"
              >
                New Game
              </Button>

              <Button
                onClick={resetScores}
                variant="outline"
                className="w-full border-slate-700 bg-transparent py-5 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Reset Scores
              </Button>

            </div>

            <p className="text-center text-xs text-slate-500">
              Built with React 19, Next.js, Tailwind CSS 4 and shadcn/ui
            </p>

          </CardContent>

        </Card>

      </main>
    );
  }
