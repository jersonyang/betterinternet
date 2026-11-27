// Loaded only after the owner supplies a web configuration. No admin credentials.
import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,onAuthStateChanged,GoogleAuthProvider,signInWithPopup,signInWithEmailAndPassword,createUserWithEmailAndPassword,sendEmailVerification,sendPasswordResetEmail,signOut} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getFirestore,collection,doc,getDocsFromServer,getDocFromServer,runTransaction,serverTimestamp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
export function connect(config){
 const app=initializeApp(config),auth=getAuth(app),db=getFirestore(app);
 const ref=(uid,id)=>doc(db,'users',uid,'schools',id);
 function check(uid){if(auth.currentUser?.uid!==uid||!auth.currentUser.emailVerified)throw Error('Sign in with a verified email first.');}
 return {
  observe:fn=>onAuthStateChanged(auth,fn),
  google:()=>signInWithPopup(auth,new GoogleAuthProvider()),
  email:(e,p)=>signInWithEmailAndPassword(auth,e,p),
  async register(e,p){const result=await createUserWithEmailAndPassword(auth,e,p);await sendEmailVerification(result.user);return result;},
  verify:()=>sendEmailVerification(auth.currentUser), reset:e=>sendPasswordResetEmail(auth,e), logout:()=>signOut(auth),
  async schools(uid){check(uid);const snap=await getDocsFromServer(collection(db,'users',uid,'schools'));return snap.docs.map(d=>({id:d.id,name:d.data().name,revision:d.data().revision,updatedAt:d.data().updatedAt?.toMillis?.()||0})).sort((a,b)=>b.updatedAt-a.updatedAt);},
  async read(uid,id){check(uid);const s=await getDocFromServer(ref(uid,id));return s.exists()?s.data():null;},
  async write(uid,id,payload,name,expected){check(uid);return runTransaction(db,async tx=>{check(uid);const r=ref(uid,id),s=await tx.get(r),old=s.exists()?s.data():null;if(old?.payload===payload)return old.revision;if((old?.revision??null)!==expected)throw Error('CLOUD_CONFLICT');const revision=(old?.revision??0)+1;tx.set(r,{schema:1,name,payload,revision,updatedAt:serverTimestamp()});return revision;});},
  async remove(uid,id,expected){check(uid);return runTransaction(db,async tx=>{check(uid);const r=ref(uid,id),s=await tx.get(r);if(!s.exists())return;if(s.data().revision!==expected)throw Error('CLOUD_CONFLICT');tx.delete(r);});}
 };
}
