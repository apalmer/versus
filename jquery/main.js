import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

$(function () {
  // Handler for .ready() called.

  const firebaseConfig = {
    apiKey: "AIzaSyANFePxXmSbZxaKwtwYzj8OpEW0rT1yWSQ",
    authDomain: "versus-6d00a.firebaseapp.com",
    projectId: "versus-6d00a",
    storageBucket: "versus-6d00a.appspot.com",
    messagingSenderId: "388840967266",
    appId: "1:388840967266:web:2e6529c5361cc5a9d5553b"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Storage and get a reference to the service
  const firebaseStorage = getStorage(app);

  let selectedCharacterIds = [];
  let battleCharacters = {};
  let battleResults = {};

  let convertFromFirestoreDTO = (doc) => {
    if (doc.fields) {
      let character = {
        id: doc.name
      };

      Object.entries(doc.fields).forEach(element => {
        let [key, value] = element;
        if (value.integerValue) {
          character[key] = parseInt(value.integerValue);
        }
        else if (value.stringValue) {
          character[key] = value.stringValue;
        }

        else if (value.timestampValue) {
          character[key] = new Date(value.timestampValue);
        }
        else if (value.booleanValue) {
          character[key] = value.booleanValue;
        }
        else {
          character[key] = value;
        }
      });

      return character;
    }
  };

  let convertToFirestoreDTO = (character) => {
    let dto = {
      "fields": {}
    }

    Object.entries(character).forEach(element => {
      let [key, value] = element
      if (typeof value === "number") {
        dto.fields[key] = { integerValue: value.toString() };
      }
      else if (typeof value === "string") {
        dto.fields[key] = { stringValue: value };
      }
      else if (value instanceof Date) {
        dto.fields[key] = { timeStampValue: value.toISOString() };
      }
      else if (typeof value === "boolean") {
        dto.fields[key] = { Value: value };
      }
    });

    return dto;
  }

  let renderCharacters = (characters) => {
    let buffer = '';
    characters.forEach((character) => {
      buffer +=
        `<div class="character-item character" data-character-id="${character.id}">
              <div class="character-thumbnail">
                  <img src="${character.portrait || "https://placehold.co/100x100"}" alt="Character ${character.id}">
              </div>
              <div class="character-details">
                  <div class="character-details-header">
                    <div class="character-title"><h2>${character.name}</h2></div>
                    <!-- <div class="launch-edit-character" >E</div> -->
                    <div class="launch-delete-character" >
                      <img src="/images/close.png" alt="Delete character">
                    </div>
                  </div>
                  <p>${character.catchphrase || ''}</p>
              </div>
          </div>`;
    });

    $('#list-characters .character-item-wrapper').append(buffer);
  };

  let getCharacters = (onLoad) => {
    $.ajax({
      url: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`,
      method: 'POST',
      data: {
        returnSecureToken: true
      },
      success: function (response) {
        var idToken = response.idToken;
        $.ajax({
          url: `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/characters`,
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + idToken
          },
          success: onLoad,
          error: function (error) {
            console.error(error);
          }
        });
      },
      error: function (error) {
        console.error(error);
      }
    });
  };

  let getCharacter = (characterId, onLoad) => {
    $.ajax({
      url: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`,
      method: 'POST',
      data: {
        returnSecureToken: true
      },
      success: function (response) {
        var idToken = response.idToken;
        $.ajax({
          url: `https://firestore.googleapis.com/v1/${characterId}`,
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + idToken
          },
          success: onLoad,
          error: function (error) {
            console.error(error);
          }
        });
      },
      error: function (error) {
        console.error(error);
      }
    });
  };

  let uploadPortrait = () => {
    let file = $("#character-portrait-uploader").prop('files')[0];

    const portraitRef = ref(firebaseStorage, file.name);

    uploadBytes(portraitRef, file)
      .then((snapshot) => {
        return getDownloadURL(snapshot.ref);})
      .then((downloadUrl) =>{
        $("#character-portrait").attr('src',downloadUrl);
      });
  };

  let saveCharacter = (character, onSave) => {
    character = character || {
      name: $("#character-name").val(),
      physical: $("#character-physical").val(),
      mental: $("#character-mental").val(),
      psychic: $("#character-psychic").val(),
      influence: $("#character-influence").val(),
      skill: $("#character-skill").val(),
      portrait: $("#character-portrait").attr("src"),
      wins: 0,
      losses: 0
    }
    
    let data = convertToFirestoreDTO(character);

    $.ajax({
      url: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`,
      method: 'POST',
      data: {
        returnSecureToken: true
      },
      success: function (response) {
        var idToken = response.idToken;
        $.ajax({
          url: `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/characters`,
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + idToken
          },
          data: JSON.stringify(data),
          contentType: 'application/json',
          success: onSave,
          error: function (error) {
            console.error(error);
          }
        });
      },
      error: function (error) {
        console.error(error);
      }
    });
  };

  let deleteCharacter = (characterId, onDelete) => {
    $.ajax({
      url: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`,
      method: 'POST',
      data: {
        returnSecureToken: true
      },
      success: function (response) {
        var idToken = response.idToken;
        $.ajax({
          url: `https://firestore.googleapis.com/v1/${characterId}`,
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + idToken
          },
          contentType: 'application/json',
          success: onDelete,
          error: function (error) {
            console.error(error);
          }
        });
      },
      error: function (error) {
        console.error(error);
      }
    });
  };

  let resetCharacterForm = (character) => {
    character = character || {
      name: "unknown",
      physical: 5,
      mental: 5,
      psychic: 5,
      influence: 5,
      skill: 5,
      portrait: "https://placehold.co/300x300"
    };

    $("#character-name").val(character.name);
    $("#character-physical").val(character.physical);
    $("#character-mental").val(character.mental);
    $("#character-psychic").val(character.psychic);
    $("#character-influence").val(character.influence);
    $("#character-skill").val(character.skill);
    $("#character-portrait").attr('src',character.portrait);
  };

  let loadCharacterList = () => {
    getCharacters((data) => {

      $("#list-characters .character-item-wrapper .character").remove();
      selectedCharacterIds = [];
      battleCharacters = {};

      let characters = [];
      if(data.documents) {
        characters = data.documents
          .map(convertFromFirestoreDTO)
          .filter(e => !!e);
      }

      renderCharacters(characters);
    });
  }

  let loadBattleCharacter = (slot) => {
    return (data) => {
      let character = convertFromFirestoreDTO(data);
      battleCharacters[slot] = character;

      $(`#${slot} .battler-portrait`).attr("src", battleCharacters[slot].portrait);
      $(`#${slot} .battler-name`).text(battleCharacters[slot].name);
    };
  };

  let bindEventHandlers = () => {
    $("#add-character").on("click", (e) => {
      resetCharacterForm();
      $(".panel").hide();
      $("#edit-character").show();
    });

    $("#save-character").on("click", (e) => {
      saveCharacter(null, (data) => {
        loadCharacterList();
        $(".panel").hide();
        $("#list-characters").show();
      });
    });

    $("#battle").on("click", (e) => {
      battle();
      loadCharacterList();
      $(".panel").hide();
      $("#list-characters").show();
    });

    $(".character-item-wrapper").on("click", ".launch-delete-character", (e) => {
      let characterId = $(e.target).closest('.character').data('characterId');
      deleteCharacter(characterId, (data) => {
        loadCharacterList();
      });
    });

    $(".character-item-wrapper").on("click", ".character-item.character", (e) => {
      let $target = $(e.currentTarget);
      let characterId = $target.closest('.character').data('characterId');

      $target.toggleClass('selected');

      const index = selectedCharacterIds.indexOf(characterId)
      if (index > -1) { // only splice array when item is found
        selectedCharacterIds.splice(index, 1); // 2nd parameter means remove one item only
      }
      else {
        selectedCharacterIds.push(characterId);
      }

      if (selectedCharacterIds.length === 2) {
        getCharacter(selectedCharacterIds[0], loadBattleCharacter("battler1"));
        getCharacter(selectedCharacterIds[1], loadBattleCharacter("battler2"));

        $(".panel").hide();
        $("#battle-characters").show();
      }
    });

    $("#character-portrait-uploader").on("change", (e) => {
      uploadPortrait();
    });

  };

  let battle = () => {
    battleResults.winner = battleCharacters["battler1"];
    battleResults.loser = battleCharacters["battler2"];

    $(`[data-character-id="${battleResults.winner.id}"]`).toggleClass("selected").toggleClass("winner");
    $(`[data-character-id="${battleResults.loser.id}"]`).toggleClass("selected").toggleClass("loser");
  };

  loadCharacterList();
  bindEventHandlers();

});