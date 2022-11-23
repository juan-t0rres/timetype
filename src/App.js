import { Fade } from "shards-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "antd/dist/antd.css";
import "./App.css";
import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import * as Tone from "tone";
import Navigation from "./components/Navigation";
import Counter from "./components/Counter";
import Results from "./components/Results";
import easy from "./lists/easy.json";
import notes from "./lists/notes.json";

const SIZE = 8;
const CHAR_LIMIT = 65;
const synth = new Tone.AMSynth().toDestination();
const list = easy;

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function App() {
  const [words, setWords] = useState([]);
  const [currentWords, setCurrentWords] = useState([]);
  const [futureWords, setFutureWords] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [open, setOpen] = useState(false);
  const inputEl = useRef(null);
  const [sum, setSum] = useState(0);
  const [keys, setKeys] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);

  useEffect(() => {
    const random = shuffle(list);
    setWords(random);
    updateCurrentAndFutureWords(random);
  }, []);

  // maybe add modulo
  function updateCurrentAndFutureWords(words, restart) {
    let i = restart ? 0 : index % words.length;
    const current = [words[i]];
    let sum = words[i].length;
    if (restart || futureWords.length === 0) {
      while (sum + words[i + 1].length + 1 < CHAR_LIMIT) {
        i++;
        sum += words[i].length + 1;
        current.push(words[i]);
      }
      setCurrentWords(current);
    } else {
      setCurrentWords(futureWords);
      i += futureWords.length;
    }
    sum = words[i++].length;
    const future = [words[i]];
    while (sum + words[i + 1].length + 1 < CHAR_LIMIT) {
      i++;
      sum += words[i].length + 1;
      future.push(words[i]);
    }
    setFutureWords(future);
    setHistory([]);
  }

  async function submitWord() {
    if (currentWord === "") return;

    if (Tone.context.state !== "running") await Tone.context.resume();

    if (currentWord === words[index % list.length]) {
      synth.triggerAttackRelease(notes[streak % notes.length], "16n");
      setStreak(streak + 1);
      setHistory([...history, "correct"]);
      setSum(sum + currentWord.length);
    } else {
      setSum(sum - 1);
      synth.triggerAttackRelease(notes[0], "16n");
      setStreak(0);
      setHistory([...history, "wrong"]);
    }
    if (currentWords[currentWords.length - 1] === words[index]) {
      updateCurrentAndFutureWords(words);
    }
    setIndex(index + 1);
    setCurrentWord("");
    setCurrentWordIndex(0);
  }

  function endTest() {
    if (inputEl) inputEl.current.blur();
    setIsTesting(false);
    setStartTime(null);
    setOpen(true);
  }

  function restart() {
    setIndex(0);
    setSum(0);
    setStreak(0);
    setKeys(0);
    setCurrentWordIndex(0);
    const random = shuffle(list);
    setWords(random);
    updateCurrentAndFutureWords(random, true);
    setHistory([]);
    setWrong(false);
    setCurrentWord("");
    setOpen(false);
    setIsNewBest(false);
    setIsTesting(false);
    setStartTime(null);
  }

  function toggle() {
    if (open) restart();
    setOpen(!open);
  }

  function handleKeyDown(e) {
    if (!isTesting) {
      setIsTesting(true);
      setStartTime(new Date());
    }
    if (e.key.length === 1) {
      setKeys(keys + 1);
    }
    if (e.key === " ") {
      submitWord();
    }
  }

  function onCurrentWordChange(e) {
    const currWord = e.target.value.replace(" ", "");
    setCurrentWord(currWord);
    if (words[index % list.length].indexOf(currWord) === 0) {
      setCurrentWordIndex(currWord.length);
      setWrong(false);
    } else {
      setWrong(true);
    }
  }

  return (
    <Router>
      <Navigation />
      <Switch>
        <Route exact path="/">
          <div className="content">
            <Fade>
              <h1 className="title">
                timetype<span className="correct">.io</span>
              </h1>
              <div className="container">
                <p className="words">
                  {currentWords.map((w, i) => {
                    const curr = index % SIZE;
                    if (i < history.length) {
                      return (
                        <span key={w} className={history[i]}>
                          {w + " "}
                        </span>
                      );
                    } else if (i === history.length) {
                      if (wrong)
                        return (
                          <span key={w}>
                            <span className="current-word wrong">{w}</span>{" "}
                          </span>
                        );
                      return (
                        <span key={w}>
                          <span className="current-word">
                            <span className="correct">
                              {w.substring(0, currentWordIndex)}
                            </span>
                            {w.substring(currentWordIndex)}
                          </span>{" "}
                        </span>
                      );
                    } else {
                      return w + " ";
                    }
                  })}
                </p>
                <p className="words">{futureWords.map((w) => w + " ")}</p>
              </div>
              <input
                ref={inputEl}
                type="text"
                value={currentWord}
                onChange={onCurrentWordChange}
                onKeyDown={handleKeyDown}
              />
            </Fade>
            <Fade in={isTesting}>
              <Counter
                startTime={startTime}
                endTest={endTest}
                index={index}
                sum={sum}
              />
              <FontAwesomeIcon
                onClick={restart}
                className="restart"
                size="lg"
                icon={faSync}
              />
            </Fade>
            <Results
              open={open}
              toggle={toggle}
              restart={restart}
              index={index}
              keys={keys}
              sum={sum}
              currentWordIndex={currentWordIndex}
            />
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
