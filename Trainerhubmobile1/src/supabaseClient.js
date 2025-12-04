// Trainerhubmobile1/src/supabaseClient.js
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

// PEGAR ESSAS INFOS NO PAINEL DO SUPABASE:
// Project Settings → API
const SUPABASE_URL = "https://vvhzdmcfoswxextqvsct.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2aHpkbWNmb3N3eGV4dHF2c2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MDAzMzcsImV4cCI6MjA3NDQ3NjMzN30.AlbG4xcT00F2tewG3MWqeFbsXN0kGPc90_c8jX6K6zE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
