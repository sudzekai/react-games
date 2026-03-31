import { useEffect, useState } from "react"
import WorldeWords from "../assets/WordleWords"
import { jsx } from "react/jsx-runtime"

const alphabet = [
    "а", "б", "в", "г", "д", "е", "ё", "ж", "з", "и",
    "й", "к", "л", "м", "н", "о", "п", "р", "с", "т",
    "у", "ф", "х", "ц", "ч", "ш", "щ", "ъ", "ы", "ь",
    "э", "ю", "я"
]

function Wordle() {
    const [word, setWord] = useState("")
    const [history, setHistory] = useState(Array(6).fill(""));

    const [isMobile, setIsMobile] = useState(window.innerWidth < 769)

    const [lettersCount, setLettersCount] = useState(3)
    const [guessWord, setGuessWord] = useState(Array(lettersCount).fill(""))

    const [usedLetters, setUsedLetters] = useState([])
    const [guessedLetters, setGuessedLetters] = useState([])
    const [tries, setTries] = useState(1)

    const [isVisible, setIsVisible] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        const newWord = WorldeWords.getRandomWord(lettersCount);
        setWord(newWord);

    }, [lettersCount])

    const handleInput = (e, i, j) => {
        const nextCell = e.target.nextElementSibling;
        if (e.target.value) {
            if (nextCell)
                nextCell.focus();

            const newWord = [...guessWord]
            newWord[j] = e.target.value
            setGuessWord(newWord)
        }
    };

    const handleKeyDown = (e, i, j) => {
        if (e.key === 'Backspace') {
            const newWord = [...guessWord];

            if (guessWord[j]) {
                newWord[j] = "";
                setGuessWord(newWord);
            }
            else if (e.target.previousElementSibling) {
                e.target.previousElementSibling.focus();
                newWord[j - 1] = "";
                setGuessWord(newWord);
            }
        }
        else if (e.key === "Enter") {
            handleTry()
        }
    };

    const handleTry = () => {
        const currentString = guessWord.join("");
        if (tries + 1 == 7) {
            setIsVisible(true)
            setMessage(`Вы не угадали!\nСлово было: ${word}`)
        }
        if (currentString.length === lettersCount) {
            const newUsed = [...usedLetters];
            const newGuessed = [...guessedLetters];

            currentString.split("").forEach((char, index) => {
                if (word[index] === char) {
                    if (!newGuessed.includes(char)) newGuessed.push(char);
                } else if (word.includes(char)) {
                } else {
                    if (!newUsed.includes(char)) newUsed.push(char);
                }
            });

            setUsedLetters(newUsed);
            setGuessedLetters(newGuessed);

            setHistory(prev => [...prev.filter(w => w !== ""), currentString]);
            setGuessWord(Array(lettersCount).fill(""));
            setTries(prev => prev + 1);
        }
        if (currentString === word) {
            setIsVisible(true)
            setMessage("Вы угадали!")
        }
    }

    const handleAlphabetButtonClick = (e) => {
        setGuessWord(prev => {
            const newWord = [...prev];
            const firstEmptyIndex = newWord.findIndex(char => char === "");

            if (firstEmptyIndex !== -1) {
                newWord[firstEmptyIndex] = e.target.value;
            }
            return newWord;
        });
    };

    const renderRow = () => {
        const rows = [];
        for (let i = 0; i < tries; i++) {
            const row = [];
            const isCurrentRow = i === tries - 1;

            for (let j = 0; j < lettersCount; j++) {
                const char = isCurrentRow ? (guessWord[j] || "") : (history[i]?.[j] || "");
                let placeholder = ""
                if (guessedLetters.includes(word[j])) {
                    placeholder = word[j] || ""

                }
                let bgColor = "";

                if (!isCurrentRow && history[i]) {
                    const letter = history[i][j];
                    if (letter === word[j]) bgColor = "#90ee90";
                    else if (word.includes(letter)) bgColor = "#ffcc00";
                    else bgColor = "#d3d3d3"; // gray
                }

                row.push(
                    <input
                        key={j}
                        className="form-control fs-4 ps-0 pe-0 text-center"
                        maxLength={1}
                        style={{ width: "50px", backgroundColor: bgColor }}
                        onInput={(e) => handleInput(e, i, j)}
                        onKeyDown={(e) => handleKeyDown(e, i, j)}
                        value={char}
                        disabled={!isCurrentRow}
                        placeholder={placeholder}
                    />
                );
            }
            rows.push(<div key={i} className="d-flex gap-1">{row}</div>);
        }
        return rows;
    };

    return (
        <>
            <div className=" position-fixed bg-white border rounded-3"
                style={{
                    transition: "all ease 1s",
                    display: isVisible ? "" : "none",
                    width: isMobile ? "65vw" : "15vw",
                    left: "17.5vw",
                    top: isMobile ? "35vh" : "50vh",
                    boxShadow: "0px 0px 0px 5000px rgba(0,0,0,0.5)"
                }}>
                <div className="d-flex flex-column p-3 ps-0 pe-0 align-items-center gap-3">
                    <label>
                        {message}
                    </label>
                    <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-outline-primary rounded-3">На главную</button>
                        <button className="btn btn-sm btn-primary rounded-3" onClick={() => window.location.reload()}>Новое слово</button>
                    </div>
                </div>
            </div>

            <div className="d-flex flex-column align-items-center gap-3 mt-5">
                <div className="d-flex flex-column gap-2" style={{ height: "400px" }}>
                    {renderRow()}
                </div>
                <div className="d-flex flex-wrap gap-2 justify-content-center"
                    style={{ maxWidth: isMobile ? "100%" : "35%" }}>
                    {alphabet.map((letter) => {
                        return (
                            <button key={letter} value={letter} className={`btn btn-sm fs-5 ${usedLetters.includes(letter) ? "btn-secondary" : "btn-outline-secondary"}`}
                                onClick={(e) => handleAlphabetButtonClick(e)}
                            >
                                {letter}
                            </button>
                        )
                    })}
                    <button className="btn btn-outline-primary btn-sm ms-2 fs-5" onClick={() => handleTry()}>Enter</button>
                </div>
                <div className="d-flex gap-5 align-items-center">
                    <button className="btn btn-outline-primary" onClick={() => window.location.reload()}>Новое слово</button>
                    <div className="d-flex flex-column align-items-center">
                        <label className="text-center">Буквы</label>
                        <div className="d-flex flex-wrap gap-1" style={{ width: "50%" }}>
                            <button className={`btn btn-outline-primary btn-sm ${lettersCount == 3 ? "active" : ""}`}
                                onClick={() => setLettersCount(3)}>
                                3
                            </button>
                            <button className={`btn btn-outline-primary btn-sm ${lettersCount == 4 ? "active" : ""}`}
                                onClick={() => setLettersCount(4)}>
                                4
                            </button>
                            <button className={`btn btn-outline-primary btn-sm ${lettersCount == 5 ? "active" : ""}`}
                                onClick={() => setLettersCount(5)}>
                                5
                            </button>
                            <button className={`btn btn-outline-primary btn-sm ${lettersCount == 6 ? "active" : ""}`}
                                onClick={() => setLettersCount(6)}>
                                6
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Wordle
