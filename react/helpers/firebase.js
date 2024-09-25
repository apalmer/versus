import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";
import { getFirestore, collection, doc, getDocs, query, orderBy, limit, addDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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

const db = getFirestore(app);

let getCharacters = (callback) => {

  let q = query(collection(db, "characters"), orderBy("wins", "desc"), limit(100));

  getDocs(q)
    .then((snapshot) => {
      let data = [];
      snapshot.forEach((doc) => {
        let character = doc.data();
        character._id = doc.id;
        data.push(character);
      });

      if (callback) {
        callback(data);
      }
    });
};

let uploadFile = (file, callback) => {

  let fileRef = ref(firebaseStorage, file.name);

  uploadBytes(fileRef, file)
    .then((snapshot) => {
      return getDownloadURL(snapshot.ref);
    })
    .then((downloadUrl) => {
      if (callback) {
        callback(downloadUrl);
      }
    });
};

let upsertCharacter = (character, callback) => {


  if(character._id){
    let {_id, ...dto} = character;

    let docRef = doc(db, "characters", _id);
    
    setDoc(docRef, dto)
      .then((ref) => {
        if (callback) {
          callback(ref);
        } 
      });
  }
  else {
    let collRef = collection(db, "characters");

    addDoc(collRef, character)
      .then((ref) => {
        if (callback) {
          callback(ref);
        }
      });
  }
}

let deleteCharacter = (character, callback) => {
  let docRef = doc(db, "characters", character._id);

  deleteDoc(docRef)
    .then(() => {
      if (callback) {
        callback();
      }
    });
}

export { getCharacters, uploadFile, upsertCharacter, deleteCharacter };
