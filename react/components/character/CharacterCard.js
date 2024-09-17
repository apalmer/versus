const html = htm.bind(React.createElement);

function CharacterCard({ character, dispatch }) {

    let handleCharacterDelete = (e) =>{
        dispatch("character.deleting");
        console.log("delete character");
    }

    let handleCharacterSelect = (e) =>{
        dispatch("character.selected");
        console.log("select character");
    }

    return html`
        <div className="bg-white mb-6 flex">
            <div> <img className="cursor-pointer" src="https://placehold.co/100x100" alt="" onClick=${ handleCharacterSelect }/> </div>
            <div className="flex-grow pl-2"> 
                <h3 className="cursor-pointer font-bold" onClick=${ handleCharacterSelect } >${character.name}</h3> 
                <p>catchphrase</p>
            </div>
            <div className="pt-2 pr-2"  > <img className="cursor-pointer" src="/images/close.png" alt="delete character" onClick=${handleCharacterDelete} /> </div>
        </div>
        `
}

export default CharacterCard;