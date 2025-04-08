import { signInWithPopup, updateCurrentUser } from 'firebase/auth'
import React, { useContext, useEffect, useState,createContext } from 'react'
import {  createUserWithEmailAndPassword, 
  onAuthStateChanged, getAuth,GoogleAuthProvider,signInWithEmailAndPassword } from 'firebase/auth'
  import { auth } from "../../../firebase";


const AuthContext=createContext()

// Custom Hook for Auth



export function useAuth(){
  return useContext(AuthContext) 
}
// Initialize Firebase 

  //sign up with google account
  export const doSignUpWithGoogle= async ()=>{
    const provider=new GoogleAuthProvider();
    await signInWithPopup(auth,provider)
  
   

  }
  export const doSignInWithGoogle=async()=>{
    const provider=new GoogleAuthProvider();
    return await signInWithPopup(auth,provider)
  }


export  function AuthProvider({children}) {
    const [CurrentUser,setCurrentUser]=useState(null)
    
  // Signup function
    function signup(email,password){
    
      return createUserWithEmailAndPassword(auth, email, password)
    }

   
  
     // Track user authentication state

     useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
      });
  
      return () => unsubscribe();
    }, []);

       


    const value={
        CurrentUser,
        signup
    }
  return (
    <AuthContext.Provider value={value}>
        {children}

    </AuthContext.Provider>
  )
}
