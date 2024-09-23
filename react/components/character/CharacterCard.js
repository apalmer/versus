const html = htm.bind(React.createElement);

function CharacterCard({ character, battlers, dispatch }) {

    let handleCharacterDelete = (e) => {
        dispatch("character.deleting",{ character });
        console.log("delete character");
    }

    let handleCharacterSelect = (e) => {
        dispatch("character.selecting", { character });
        console.log("select character");
    }

    return html`
        <div className=${ `mb-6 flex drop-shadow-xl ${ battlers.find(battler => battler._id === character._id) ? 'bg-yellow-300':'bg-white '}` }>
            <div className="bg-gray-300" > <img className="cursor-pointer w-24 h-24" src=${ character.portrait || "https://placehold.co/100x100"} alt="" onClick=${ handleCharacterSelect } /> </div>
            <div className="flex-grow pl-2"> 
                <h3 className="cursor-pointer font-bold" onClick=${ handleCharacterSelect } >${character.name}</h3> 
                <p>${ character.catchphrase }</p>
            </div>
            <div className="flex items-center w-24 h-24 text-3xl">${ character.wins }</div>
            <div className="pt-2 pr-2"  > 
                <img className="cursor-pointer" src="/images/close.png" alt="delete character" onClick=${ handleCharacterDelete } /> 
            </div>
        </div>
        `
}

export default CharacterCard;