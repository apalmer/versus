const html = htm.bind(React.createElement);

function Battle({ battlers, dispatch }) {

    let [battler1, battler2] = battlers;

    let handleBattle = (e) => {
        console.log("battling characters");
        
        let winner = battler1;
        winner.wins = winner.wins ? winner.wins + 1 : 1;

        let loser = battler2;
        loser.losses = loser.losses ? loser.losses + 1 : 1;  

        dispatch("battle.won", { winner, loser });
    }
    
    return html`
        <form>
            <h2 className="font-bond text-3xl mb-4" >Battle Characters</h2>
            <div className="grid grid-cols-2 gap-x-2">
                
                <div id="battler1" className="flex flex-col place-items" >
                    <img className="" src=${ battler1 && battler1.portrait || "https://placehold.co/300x300" } alt="Character 1" />
                    <label className="" htmlFor="character-image">${ battler1 && battler1.name }</label>
                </div>

                <div id="battler2" className="flex flex-col place-items">
                    <img className="" src=${ battler2 && battler2.portrait || "https://placehold.co/300x300" } alt="Character 2" />
                    <label className="" htmlFor="character-image">${battler2 && battler2.name }</label>
                </div>

                <div className="col-span-2">
                    <input id="battle" onClick=${handleBattle} className="button" type="button" value="Battle" />
                </div>
            </div>
        </form>
        `
}

export default Battle;