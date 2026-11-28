// Loaded only after the owner supplies a web configuration. No admin credentials.
import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,onAuthStateChanged,GoogleAuthProvider,signInWithPopup,signInWithEmailAndPassword,createUserWithEmailAndPassword,sendEmailVerification,sendPasswordResetEmail,signOut,reload,getIdToken,reauthenticateWithCredential,reauthenticateWithPopup,EmailAuthProvider,deleteUser,applyActionCode,verifyPasswordResetCode,confirmPasswordReset,checkActionCode} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getFirestore,collection,doc,getDocsFromServer,getDocFromServer,runTransaction,serverTimestamp,setDoc,deleteDoc} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
export function connect(config){
 const app=initializeApp(config),auth=getAuth(app),db=getFirestore(app);
 const continueURL=()=>({url:location.origin+'/studio?verified=1',handleCodeInApp:false});
 const ref=(uid,id)=>doc(db,'users',uid,'schools',id);
 function check(uid){if(auth.currentUser?.uid!==uid||!auth.currentUser.emailVerified)throw Error('Sign in with a verified email first.');}
 return {
  observe:fn=>onAuthStateChanged(auth,fn),
  google:()=>signInWithPopup(auth,new GoogleAuthProvider()),
  email:(e,p)=>signInWithEmailAndPassword(auth,e,p),
  async register(e,p){const result=await createUserWithEmailAndPassword(auth,e,p);await sendEmailVerification(result.user,continueURL());return result;},
  verify:()=>sendEmailVerification(auth.currentUser,continueURL()), reset:e=>sendPasswordResetEmail(auth,e), logout:()=>signOut(auth),
  async refresh(){let u=auth.currentUser;if(u){await reload(u);await getIdToken(u,true)}return auth.currentUser},
  async reauth(pw){let u=auth.currentUser;if(!u)throw Error('Sign in again');if(u.providerData.some(x=>x.providerId==='password'))await reauthenticateWithCredential(u,EmailAuthProvider.credential(u.email,pw));else await reauthenticateWithPopup(u,new GoogleAuthProvider());},
  async eraseAccount(uid){check(uid);let u=auth.currentUser;let marker=doc(db,'users',uid,'state','deleting');await setDoc(marker,{deleting:true});let shares=await getDocsFromServer(collection(db,'users',uid,'shares'));for(let d of shares.docs)await deleteDoc(d.ref);let schools=await getDocsFromServer(collection(db,'users',uid,'schools'));for(let d of schools.docs)await deleteDoc(d.ref);await deleteUser(u);},
  applyCode:code=>applyActionCode(auth,code), checkReset:code=>verifyPasswordResetCode(auth,code), confirmReset:(code,password)=>confirmPasswordReset(auth,code,password),checkCode:code=>checkActionCode(auth,code),
  async createShare(uid,id,kind,email,role,payload,name){check(uid);await setDoc(doc(db,'users',uid,'shares',id),{kind,email,role,payload,name,revision:1,updatedAt:serverTimestamp()});},
  async listShares(uid){check(uid);let snap=await getDocsFromServer(collection(db,'users',uid,'shares'));return snap.docs.map(d=>({id:d.id,...d.data()}));},
  async readShare(uid,id){if(!auth.currentUser?.emailVerified)throw Error('Verify your email');let r=await getDocFromServer(doc(db,'users',uid,'shares',id));if(!r.exists())throw Error('Shared link unavailable');return r.data();},
  async updateShare(uid,id,payload,expected){if(!auth.currentUser?.emailVerified)throw Error('Verify your email');let r=doc(db,'users',uid,'shares',id);return runTransaction(db,async tx=>{let snap=await tx.get(r);if(!snap.exists())throw Error('Shared link revoked');let old=snap.data();if(old.revision!==expected)throw Error('CLOUD_CONFLICT');let revision=expected+1;tx.set(r,{...old,payload,revision,updatedAt:serverTimestamp()});return revision})},
  async removeShare(uid,id){check(uid);await deleteDoc(doc(db,'users',uid,'shares',id));},
  async schools(uid){check(uid);const snap=await getDocsFromServer(collection(db,'users',uid,'schools'));return snap.docs.map(d=>({id:d.id,name:d.data().name,revision:d.data().revision,updatedAt:d.data().updatedAt?.toMillis?.()||0})).sort((a,b)=>b.updatedAt-a.updatedAt);},
  async read(uid,id){check(uid);const s=await getDocFromServer(ref(uid,id));return s.exists()?s.data():null;},
  async write(uid,id,payload,name,expected){check(uid);return runTransaction(db,async tx=>{check(uid);const r=ref(uid,id),s=await tx.get(r),old=s.exists()?s.data():null;if(old?.payload===payload)return old.revision;if((old?.revision??null)!==expected)throw Error('CLOUD_CONFLICT');const revision=(old?.revision??0)+1;tx.set(r,{schema:1,name,payload,revision,updatedAt:serverTimestamp()});return revision;});},
  async remove(uid,id,expected){check(uid);return runTransaction(db,async tx=>{check(uid);const r=ref(uid,id),s=await tx.get(r);if(!s.exists())return;if(s.data().revision!==expected)throw Error('CLOUD_CONFLICT');tx.delete(r);});}
 };
}
