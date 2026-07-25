import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const UserRoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!isLoaded) return;

      if (!isSignedIn) {
        setRole(null);
        setProfile(null);
        setLoadingRole(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.id);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();
          setRole(data.role || null);
          setProfile(data);
        } else {
          setRole(null);
          setProfile(null);
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
      } finally {
        setLoadingRole(false);
      }
    };

    fetchRole();
  }, [isLoaded, isSignedIn, user]);

  return (
    <UserRoleContext.Provider value={{ role, profile, loadingRole, setRole, setProfile }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => useContext(UserRoleContext);