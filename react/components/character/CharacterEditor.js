const html = htm.bind(React.createElement);

function CharacterEditor({ modifyingCharacter, dispatch }) {

        React.useEffect(() => {
                setCharacter({...defaultCharacter, ...modifyingCharacter});
                //clean up function
                return () => { };
        }, [modifyingCharacter]);

        let defaultCharacter = {
                name: '',
                portrait: '',
                catchphrase: '',
                physical: 5,
                mental: 5,
                psychic: 5,
                influence: 5,
                skill: 5,
                wins: 0
        }

        let [character, setCharacter] = React.useState({...defaultCharacter, ...modifyingCharacter});

        let handleOnChange = (e) => {
                console.log(`changing ${e.currentTarget.name} `);
                let newCharacter = { ...character };
                newCharacter[e.currentTarget.name] = e.currentTarget.value;
                setCharacter(newCharacter);
        }

        let handleSubmit = (e) => {
                e.preventDefault();
                console.log('handle Submit');
                dispatch("character.edit.saving", { character });
        }

        let handleUpload = (e) => {
                console.log("upload portrait");
                dispatch("character.portrait.uploading", { file: e.currentTarget.files[0] });
        }

        return html`
                <form onSubmit=${handleSubmit} >
                        <h2 className="font-bond text-3xl mb-4" >Edit Character</h2>
                        <div className="grid grid-cols-2 gap-y-4 p-4" >
                                <div className="flex justify-center align-center"> 
                                        <img id="character-portrait" className="" src=${ modifyingCharacter.portrait || "https://placehold.co/300x300" } alt="Character 3" />
                                </div>
                                <div className="grid text-left" >      
                                        <label htmlFor="character-name">Name:</label>
                                        <input type="text" id="character-name" name="name" value=${character.name} onChange=${handleOnChange} />

                                        <label htmlFor="character-catchphrase">Catch Phrase:</label>
                                        <input type="text" id="character-catchphrase" name="catchphrase"  value=${character.catchphrase} onChange=${handleOnChange} />

                                        <label htmlFor="character-physical">Physical:</label>
                                        <input type="number" id="character-physical" name="physical"  value=${character.physical} onChange=${handleOnChange} />

                                        <label htmlFor="character-mental">Mental:</label>
                                        <input type="number" id="character-mental" name="mental"  value=${character.mental} onChange=${handleOnChange} />

                                        <label htmlFor="character-psychic">Psychic:</label>
                                        <input type="number" id="character-psychic" name="psychic"  value=${character.psychic} onChange=${handleOnChange} />

                                        <label htmlFor="character-influence">Influence:</label>
                                        <input type="number" id="character-influence" name="influence"  value=${character.influence} onChange=${handleOnChange} />

                                        <label htmlFor="character-skill">Skill:</label>
                                        <input type="number" id="character-skill" name="skill"  value=${character.skill} onChange=${handleOnChange} />

                                </div>
                                <div className="flex justify-center align-center"> 
                                        <label htmlFor="character-portrait-uploader" className="button">Upload</label>    
                                        <input id="character-portrait-uploader"  onChange=${ handleUpload } className="hidden" type="file" accept="image/*" />
                                </div>
                                <div className="flex justify-center align-center">
                                        <input id="save-character" className="button" type="submit" value="Save" />
                                </div>
                        </div>
                </form>
        `
}

export default CharacterEditor;