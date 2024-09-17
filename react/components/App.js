import LeaderBoard from "./leaderboard/LeaderBoard.js";
import CharacterEditor from "./character/CharacterEditor.js";
import Battle from "./battle/Battle.js"

const html = htm.bind(React.createElement);

function App() {

    //let [characters, setCharacters] = useState([]);
    let mockCharacters = [
        { id: 1, name: "spider-man" },
        { id: 2, name: "venom" },
        { id: 3, name: "longshot" },
        { id: 4, name: "daredevil" },
        { id: 5, name: "bullseye" }
    ];

    let [characters, setCharacters] = React.useState(mockCharacters);

    let [modifingCharacter, setModifingCharacter] = React.useState(mockCharacters[2]);

    let [battlers, setBattlers] = React.useState([mockCharacters[3], mockCharacters[4]]);

    let [battleResults, setBattleResults] = React.useState({winner: mockCharacters[3]});

    let [appStateMachine, setAppStateMachine] = React.useState({ mode: 'leaderboard' })

    let dispatch = (message, payload) => { 
        switch (message) {
            case 'character.deleting':
                setAppStateMachine({ mode: 'leaderboard' });
                break;
            case 'character.editing':
                setAppStateMachine({ mode: 'edit' });
                break;
            case 'character.edited':
                setAppStateMachine({ mode: 'leaderboard' });
                break;
            case 'character.selected':
                setAppStateMachine({ mode: 'battle' });
                break;
            case 'battlers.selected':
                setAppStateMachine({ mode: 'battle' });
                break;
            case 'battle.completed':
                setAppStateMachine({ mode: 'leaderboard' });
                break;
            default:
                console.warn(`Unknown message: ${message}`);
        }
    };

    return html`
        <div className="container mx-auto px-36 flex flex-col text-center">
            <h1 className="text-3xl font-bold mb-6" >React Versus</h1>
            ${ 
                appStateMachine.mode === 'leaderboard' && html`<${LeaderBoard} characters=${characters} dispatch=${dispatch} />`
            }
            ${
                appStateMachine.mode === 'edit' && html`<${CharacterEditor} character=${modifingCharacter} dispatch=${dispatch} />`
            }
            ${
                appStateMachine.mode === 'battle' && html`<${Battle} battlers=${battlers} dispatch=${dispatch} />`
            }
        </div>
        `
}

export default App;