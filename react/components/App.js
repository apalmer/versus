import { deleteCharacter, getCharacters, uploadFile, upsertCharacter } from "../helpers/firebase.js"

import LeaderBoard from "./leaderboard/LeaderBoard.js";
import CharacterEditor from "./character/CharacterEditor.js";
import Battle from "./battle/Battle.js"

const html = htm.bind(React.createElement);

function App() {
    
    let [appStateMachine, setAppStateMachine] = React.useState({ mode: "leaderboard" });

    let [isDirty, setIsDirty] = React.useState(false);

    let [characters, setCharacters] = React.useState([]);

    let [modifyingCharacter, setModifingCharacter] = React.useState({});

    let [battlers, setBattlers] = React.useState([]);

    let [battleResults, setBattleResults] = React.useState({ winner: null, loser: null });

    let loadCharacters = () => {
        return getCharacters((chars) => { 
            setCharacters(chars); 
            setIsDirty(false);
        });
    };

    let uploadPortrait = (file) => {
        return uploadFile(file, (downloadUrl) => {
            setModifingCharacter({ ...modifyingCharacter, portrait: downloadUrl })
        });
    }

    let saveCharacter = (character) => {
        return upsertCharacter(character, (doc) => {
            setIsDirty(true);
            dispatch("character.edit.saved");
        });
    }

    let removeCharacter = (character) => {
        return deleteCharacter(character, (doc) => {
            setIsDirty(true);
            dispatch("character.deleted");
        });
    }

    let selectCharacter = (character) => {
        let filtered = battlers.filter(battler => battler._id !== character._id);
        if(battlers.length > filtered.length) {
            setBattlers(filtered);
        }
        else if(battlers.length < 2){
            let nextBattlers = [...battlers, character];
            setBattlers(nextBattlers);
        }
    }
    
    let saveBattleResults = (winner, loser) => {
        setBattlers([]);
        setBattleResults({ winner, loser});
        upsertCharacter(winner, (w) => {
            upsertCharacter(loser, (l) => { 
                setIsDirty(true);
                dispatch("battle.completed");
            });
        });
    }

    let dispatch = (message, payload) => {
        switch (message) {
            case "character.deleting":
                removeCharacter(payload.character);
                break;
            case "character.deleted":
                setAppStateMachine({ mode: "leaderboard" });
                break;
            case "character.editing":
                setAppStateMachine({ mode: "edit" });
                break;
            case "character.edited":
                setModifingCharacter({});
                setAppStateMachine({ mode: "leaderboard" });
                break;
            case "character.portrait.uploading":
                uploadPortrait(payload.file);
                break;
            case "character.edit.saving":
                saveCharacter(payload.character);
                break;
            case "character.edit.saved":
                setAppStateMachine({ mode: "leaderboard" });
                break;
            case "character.selecting":
                selectCharacter(payload.character);
                break;
            case "character.selected":
                setAppStateMachine({ mode: "battle" });
                break;
            case "battlers.selected":
                setAppStateMachine({ mode: "battle" });
                break;
            case "battle.won":
                setAppStateMachine({ mode: "leaderboard" });
                saveBattleResults(payload.winner, payload.loser)
                break;
            case "battle.completed":
                setAppStateMachine({ mode: "leaderboard" });
                break;
            default:
                console.warn(`Unknown message: ${message}`);
        }
    };

    React.useEffect(() => {

        loadCharacters();

        if(battlers.length >= 2){
            setAppStateMachine({ mode: "battle" });
        }
        
    }, [isDirty, battlers, battleResults]);

    return html`
        <div className="container mx-auto flex flex-col text-center">
            <h1 className="text-3xl font-bold mb-6" >React Versus</h1>
            ${appStateMachine.mode === "leaderboard" && html`<${LeaderBoard} characters=${characters} battlers=${battlers} battleResults=${battleResults} dispatch=${dispatch} //>`
        }
            ${appStateMachine.mode === "edit" && html`<${CharacterEditor} modifyingCharacter=${modifyingCharacter} dispatch=${dispatch} //>`
        }
            ${appStateMachine.mode === "battle" && html`<${Battle} battlers=${battlers} dispatch=${dispatch} //>`
        }
        </div>
        `
}

export default App;