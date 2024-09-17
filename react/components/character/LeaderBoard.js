import CharacterList from "./CharacterList.js";

const html = htm.bind(React.createElement);

function LeaderBoard ({ characters, dispatch }) {

    let handleAdd = (e) => {
        console.log("add character");
        dispatch("character.editing");
    }

    return html`
        <div className="leaderboard">
            <div className="character-actions mb-6" >
                <input id="add-character" onClick=${ handleAdd } className="button" type="button" value="Add Character" />
            </div>
            <${ CharacterList } characters=${characters} dispatch=${dispatch} />
        </div>
        `
}

export default LeaderBoard;