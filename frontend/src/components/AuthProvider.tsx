"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface AuthUser {
  display_name?: string;
  id?: string;
  name?: string;
  email?: string;
  images?: Array<{ url: string; height?: number | null; width?: number | null }>;
  [key: string]: unknown;
}

export interface AuthState {
  spotifyUser: AuthUser | null;
  youtubeUser: AuthUser | null;
  spotifyToken: string | null;
  youtubeToken: string | null;
  hydrated: boolean;
}

interface AuthContextValue extends AuthState {
  refresh: () => void;
  logout: () => void;
}

const initialState: AuthState = {
  spotifyUser: null,
  youtubeUser: null,
  spotifyToken: null,
  youtubeToken: null,
  hydrated: false,
};

const AuthContext = createContext<AuthContextValue | null>(null);
export const AUTH_CHANGED_EVENT = "playlist-exchanger-auth-changed";

export function readToken(key: string): string | null {
  const value = localStorage.getItem(key);
  if (!value) return null;

  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "string" ? parsed : value;
  } catch {
    return value;
  }
}

function readUser(key: string): AuthUser | null {
  const value = localStorage.getItem(key);
  if (!value) return null;

  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    return null;
  }
}

export function persistAuth(
  tokenKey: "access_token" | "access_token_youtube",
  userKey: "spotifyUser" | "youtubeuser",
  token: string,
  user?: AuthUser | null,
) {
  localStorage.setItem(tokenKey, token);
  if (user) localStorage.setItem(userKey, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  const refresh = () => {
    setState({
      spotifyUser: readUser("spotifyUser"),
      youtubeUser: readUser("youtubeuser"),
      spotifyToken: readToken("access_token"),
      youtubeToken: readToken("access_token_youtube"),
      hydrated: true,
    });
  };

  useEffect(() => {
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(AUTH_CHANGED_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(AUTH_CHANGED_EVENT, refresh);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("spotifyUser");
    localStorage.removeItem("access_token_youtube");
    localStorage.removeItem("youtubeuser");
    refresh();
  };

  const value = { ...state, refresh, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
