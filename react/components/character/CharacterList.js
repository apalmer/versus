import CharacterCard from "./CharacterCard.js";

const html = htm.bind(React.createElement);

function CharacterList({ characters, battlers, battleResults, dispatch }) {
    
    return html`
        <div key="1" className="character-list text-left">
            <!-- <${CharacterCard} character=${characters[0]} dispatch=${dispatch} /> -->
            ${characters.map((character) => { 
                return html`
                    <${CharacterCard} key=${character.id} battlers=${battlers} battleResults=${battleResults} character=${character} dispatch=${dispatch} //>
                `
            })}
        </div>
        `
}

export default CharacterList;