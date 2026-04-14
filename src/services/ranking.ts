'use client';

import { supabase } from '@/lib/supabase';

export type RankingEntry = {
  name: string;
  score: number;
  timeSeconds: number;
  verbsCount: number;
  mode: string;
  timestamp?: any;
};

/**
 * Guarda una puntuación en la tabla RANKS de Supabase.
 */
export async function submitScore(entry: Omit<RankingEntry, 'timestamp'>) {
  const { error } = await supabase
    .from('RANKS')
    .insert([{ ...entry }]);
    
  if (error) {
    console.error('Error al guardar score en Supabase:', error);
  }
}