const html = htm.bind(React.createElement);

function CharacterEditor({ character, dispatch }) {

        let handleSave = (e) => {
                console.log("edited character");
                dispatch("character.edited");
        }

        return html`
        <form>
                <h2 className="font-bond text-3xl mb-4" >Edit Character</h2>
                <div className="grid grid-cols-2 gap-y-4 p-4" >
                        <div className="flex justify-center align-center"> 
                                <img id="character-portrait" className="" src="https://placehold.co/300x300" alt="Character 3" />
                        </div>
                        <div className="grid text-left" >      
                                <label htmlFor="character-name">Name:</label>
                                <input type="text" id="character-name" name="character-name" />

                                <label htmlFor="character-physical">Physical:</label>
                                <input type="number" id="character-physical" name="character-physical" />

                                <label htmlFor="character-mental">Mental:</label>
                                <input type="number" id="character-mental" name="character-mental" />

                                <label htmlFor="character-psychic">Psychic:</label>
                                <input type="number" id="character-psychic" name="character-psychic" />

                                <label htmlFor="character-influence">Influence:</label>
                                <input type="number" id="character-influence" name="character-influence" />

                                <label htmlFor="character-skill">Skill:</label>
                                <input type="number" id="character-skill" name="character-skill" />

                        </div>
                        <div className="flex justify-center align-center"> 
                                <label htmlFor="character-portrait-uploader" className="button">Upload</label>    
                                <input id="character-portrait-uploader" className="hidden" type="file" id="character-image" name="character-image" accept="image/*" />
                        </div>
                        <div className="flex justify-center align-center">
                                <input id="save-character" onClick=${handleSave} className="button" type="button" value="Save" />
                        </div>
                </div>
        </form>
        `
}

export default CharacterEditor;